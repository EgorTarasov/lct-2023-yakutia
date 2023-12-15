import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { env } from "../../env";
import queryString from "query-string";
import vkApi, { vkAuthResponseData } from "./authVkSlice";

export const VKButton: React.FC = () => {
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    console.log(env);

    const host =
        env.MODE === "production" ? env.FRONT_URL_PROD : env.FRONT_URL_LOCAL;

    const cbLink = `${host}/login`;

    useEffect(() => {
        const queryObj = queryString.parse(location.search);

        if (queryObj) {
            fetch(`http://localhost:8000/auth/vk`, {
                method: "POST",
                body: JSON.stringify({ code: queryObj.code }),
            });
            //     navigate("/profile");
        }
        console.log("loc", location);
        console.log("query", queryObj);
        console.log("cblink", cbLink);

        if (isError) window.location.href = cbLink;
    }, [location.search, isError, cbLink, history]);

    const handleRedirect = () => {
        window.location.href = `https://oauth.vk.com/authorize?client_id=${env.CLIENT_ID}&display=page&redirect_uri=${cbLink}&scope=270338&response_type=code&v=5.131`;
        //тут срать запросы
    };

    return (
        <>
            <button
                onClick={handleRedirect}
                className="mt-5 w-full py-3 text-white rounded-input bg-blue-700"
            >
                Войти через Вконтакте 2
            </button>
            {isError && <p style={{ color: "red" }}>Ошибка входа через ВК</p>}
        </>
    );
};