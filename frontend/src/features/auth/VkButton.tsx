
import { env } from "../../env";
import vkLogo from "../../assets/icons/vk.svg";

export const VKButton = () => {
    const host =
        env.MODE === "production" ? env.FRONT_URL_PROD : env.FRONT_URL_LOCAL;

    console.log(host);

    const handleRedirect = () => {
        window.location.href = `https://oauth.vk.com/authorize?client_id=${env.CLIENT_ID}&display=page&redirect_uri=${host}&scope=270338&response_type=code&v=5.131`;
    };

    return (
        <>
            <button
                onClick={handleRedirect}
                className=" w-full py-3 rounded-input flex justify-center items-center bg-whit shadow-btn gap-2 text-[#0077ff] font-semibold hover:bg-[#0077ff] hover:text-white"
            >
                <img src={vkLogo} /> VK ID
            </button>
        </>
    );
};
