import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { env } from "../../env";
import queryString from "query-string";

export const VKButton: React.FC = () => {
  const [isError, setIsError] = useState(false);
  const location = useLocation();
  console.log(env)


  const host =
    env.MODE === "production"
      ? env.FRONT_URL_PROD
      : env.FRONT_URL_LOCAL;

  const cbLink = `${host}/login`;

  useEffect(() => {

    const queryObj = queryString.parse(location.search);
    console.log(queryObj)
    console.log(cbLink)
    if (isError) window.location.href = cbLink;

  }, [location.search, isError, cbLink, history]);


  const handleRedirect = () => {
    window.location.href = `https://oauth.vk.com/authorize?client_id=${env.CLIENT_ID}&display=popup&redirect_uri=${cbLink}&scope=270338&response_type=token&v=5.131`;
  };

  return (
    <>
      <button onClick={handleRedirect} className="mt-5 w-full py-3 text-white rounded-input bg-blue-700">
        Войти через Вконтакте
      </button>
      {isError && <p style={{ color: "red" }}>Ошибка входа через ВК</p>}
    </>
  );
};

