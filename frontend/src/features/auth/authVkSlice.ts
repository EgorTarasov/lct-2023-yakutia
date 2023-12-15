export interface vkAuthResponseData {
    access_token: string;
    expires: number;
    user_id: string;
}

const groupGetUrl = `https://api.vk.ru/method/groups.get?v=5.199`;

const vkApi = {
    async fetchAndUseItems(authData: vkAuthResponseData) {
        // Fetch data from groupGetUrl
        const userDataResponse = await fetch(
            `https://api.vk.ru/method/users.get?v=5.199`,
            {
                headers: {
                    Authorization: `Bearer ${authData.access_token}`,
                },
            },
        );
        
        console.log("u", userDataResponse);

        const response = await fetch(groupGetUrl, {
            headers: {
                Authorization: `Bearer ${authData.access_token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("d", data);

        const groupInfo = await fetch(
            "https://api.vk.ru/method/groups.getById",
            {
                method: "POST",

                body: new URLSearchParams({
                    group_ids: data.response.items.join(","),
                    access_token: authData.access_token,
                    v: "5.199",
                }),
            },
        );

        const groupInfoResponse = await groupInfo.json();

        // на бэк надо собрать объект формата:
        // {
        //  user_id: int,
        // groups: данные из groupInfoResponse.response.groups
        // }
        console.log("g", groupInfoResponse);
        const response_data = {
            first_name: userDataResponse.response[0].first_name,
            last_name: userDataResponse.response[0].last_name,
            user_id: authData.user_id,
            groups: groupInfoResponse.response,
        };
        return response_data;
    },
};

export default vkApi;
