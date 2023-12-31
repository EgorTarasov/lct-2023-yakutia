import httpx
import sqlalchemy as sa
import sqlalchemy.orm as orm
from sqlalchemy.ext.asyncio import AsyncSession


from ..models import VkUser, VkGroup
from ..initializers import settings, tokenizer, sbert
from ..services.ml.vectorizer import vectorize


async def update_groups(
    db: AsyncSession, client: httpx.AsyncClient, user: VkUser, token: str
):
    response = await client.get(
        settings.vk_base_url + "/groups.get",
        headers={"Authorization": f"Bearer {token}"},
        params={"v": "5.199"},
    )

    groups_stmt = sa.select(VkGroup).where(
        VkGroup.id.in_(response.json()["response"]["items"])
    )
    user_stmt = (
        sa.select(VkUser)
        .options(orm.selectinload(VkUser.groups))
        .where(VkUser.id == user.id)
    )
    db_user: VkUser | None = (await db.execute(user_stmt)).unique().scalar()

    if db_user is None:
        return
    db_groups: list[VkGroup] = [obj[0] for obj in (await db.execute(groups_stmt)).all()]

    response = await client.get(
        settings.vk_base_url + "/groups.getById",
        headers={"Authorization": f"Bearer {settings.vk_service_token}"},
        params={
            "group_ids": ",".join(map(str, response.json()["response"]["items"])),
            "fields": "photo_200,description",
            "v": "5.199",
        },
    )

    groups_info = response.json()["response"]["groups"]
    new_groups: list[VkGroup] = []
    user_groups: list[VkGroup] = []

    for group_info in groups_info:
        db_group: VkGroup | None = next(
            (group for group in db_groups if group.id == group_info["id"]), None
        )
        if db_group is None:
            group = VkGroup(
                id=group_info["id"],
                name=group_info["name"],
                description=group_info["description"]
                if "description" in group_info.keys()
                else "",
                screen_name=group_info["screen_name"],
                type=group_info["type"],
                photo_200=group_info["photo_200"],
                embeddings=vectorize(
                    tokenizer,
                    sbert,
                    group_info["description"]
                    if "description" in group_info.keys()
                    else "",
                ),
            )
            new_groups.append(group)
        else:
            db_group.name = group_info["name"]
            db_group.description = group_info["description"]
            db_group.screen_name = group_info["screen_name"]
            db_group.type = group_info["type"]

            db_group.photo_200 = group_info["photo_200"]
            user_groups.append(db_group)
    db.add_all(new_groups)
    user.groups = user_groups + new_groups  # type: ignore
    await db.commit()

    await client.aclose()
