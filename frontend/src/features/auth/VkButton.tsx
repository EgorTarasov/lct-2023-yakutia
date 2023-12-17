import { Icon } from "../../components/UI";
import { env } from "../../env";

export const VKButton = () => {
    const host =
        env.MODE === "production" ? env.FRONT_URL_PROD : env.FRONT_URL_LOCAL;
    const cbLink = `${host}/login`;

    const handleRedirect = () => {
        window.location.href = `https://oauth.vk.com/authorize?client_id=${env.CLIENT_ID}&display=page&redirect_uri=${cbLink}&scope=270338&response_type=code&v=5.131`;
    };

    return (
        <>
            <button
                onClick={handleRedirect}
                className=" w-full py-3 rounded-input flex justify-center items-center bg-whit shadow-btn gap-2 text-[#0077ff] font-semibold hover:bg-[#0077ff] hover:text-white"
            >
                <Icon iconName="vk" /> VK ID
            </button>
        </>
    );
};
