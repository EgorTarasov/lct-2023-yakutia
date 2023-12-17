import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, TextInput } from "../../components/UI";
import { SignUpRequest, useLoginMutation, useSignUpMutation } from "../../app/services/api";
import { setIsAuth, setUserToken } from "./authSlice";
import { useAppDispatch } from "../../hooks/store";
import { useLocation, useNavigate } from "react-router-dom";
import { VKButton } from "./VkButton";
import { useEffect, useState } from "react";
import { env } from "../../env";
import queryString from "query-string";
import VkService, { VkLoginRequest } from "../../app/services/authWithSocial";
import { LoginModel } from "../../models/AuthModel";

const LoginSchema = Yup.object().shape({
    username: Yup.string().email("Неправильный email").required("Обязательно"),
    password: Yup.string().required("Обязательно"),
});

const SignUpSchema = Yup.object().shape({
    email: Yup.string().email("Неправильный email").required("Обязательно"),
    password: Yup.string().required("Обязательно"),
    first_name: Yup.string().required("Обязательно"),
    last_name: Yup.string().required("Обязательно"),
});

export const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isRegistering, setIsRegistering] = useState(true);
    const [isError, setIsError] = useState(false);

    const signUpForm = {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    };

    const loginForm = {
        username: "",
        password: "",
    }

    const [login] = useLoginMutation();
    const [signUp] = useSignUpMutation();

    const host =
        env.MODE === "production" ? env.FRONT_URL_PROD : env.FRONT_URL_LOCAL;
    const cbLink = `${host}/login`;

    useEffect(() => {
        const queryObj = queryString.parse(location.search);
        if (queryObj.code) {
            const queryCode = queryObj.code?.toString() as unknown as VkLoginRequest;
            handleVKlogin(queryCode);
        }
        if (isError) window.location.href = cbLink;
    }, []);

    const handleVKlogin = async (code: VkLoginRequest) => {
        try {
            console.log(code);
            const { access_token } = await VkService.loginVk(code);
            dispatch(setUserToken(access_token));
            dispatch(setIsAuth());
            console.log(access_token);
            navigate('/dashboard');
        } catch (err) {
            console.log(err);
            setIsError(true);
        }
    }

    const handleLogin = async (values: LoginModel) => {
        try {
            const formData: FormData = new FormData();

            formData.append("username", values.username);
            formData.append("password", values.password);

            const { access_token } = await login(formData).unwrap();

            dispatch(setUserToken(access_token));
            dispatch(setIsAuth());
            console.log(access_token);
            navigate("/admin");
        } catch (err) {
            console.log(err, values);
        }
    };

    const handleSignUp = async (values: SignUpRequest) => {
        console.log(values);
        try {
            setIsRegistering(false);
            console.log(values);
            const { access_token } = await signUp(values).unwrap();
            dispatch(setUserToken(access_token));
            dispatch(setIsAuth());
            navigate("/dashboard");
        } catch (err) {
            console.log(err, values);
        }
    }

    const toggleRegister = () => {
        setIsRegistering(!isRegistering);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="text-left text-h1 font-bold">
                <h1>Добро</h1>
                <h1>пожаловать!</h1>
            </div>
            <div className="max-w-[300px] mt-12">
                {isRegistering ? (
                    <div className="w-full">
                        <Formik
                            initialValues={loginForm}
                            validationSchema={LoginSchema}
                            onSubmit={handleLogin}
                        >
                            <Form className="flex flex-col justify-center items-center gap-2">
                                <TextInput
                                    name="username"
                                    type="email"
                                    label="Почта"
                                />
                                <TextInput
                                    name="password"
                                    type="password"
                                    label="Пароль"
                                />
                                <div className="mt-7 w-full">
                                    <Button type="submit">Войти</Button>
                                </div>
                            </Form>
                        </Formik>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 mt-4">
                                <div className="md:border-t-2 border-gray-300 w-full"></div>
                                <p>Или</p>
                                <div className="md:border-t-2 border-gray-300 w-full"></div>
                            </div>
                            <VKButton />
                        </div>
                    </div>

                ) : (
                    <div className="w-full">
                        <Formik
                            initialValues={signUpForm}
                            validationSchema={SignUpSchema}
                            onSubmit={handleSignUp}
                        >
                            <Form className="flex flex-col justify-center items-center gap-2 ">
                                <TextInput
                                    name="first_name"
                                    type="text"
                                    label="Имя"
                                />
                                <TextInput
                                    name="last_name"
                                    type="text"
                                    label="Фамилия"
                                />
                                <TextInput
                                    name="email"
                                    type="email"
                                    label="Почта"
                                />
                                <TextInput
                                    name="password"
                                    type="password"
                                    label="Пароль"
                                />
                                <div className="mt-2 w-full">
                                    <Button type="submit">
                                        Зарегистрироваться
                                    </Button>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                )}
                <div className="mt-4">
                    {isRegistering ? <p className="text-caption">Нет аккаунта? <span className="font-bold cursor-pointer" onClick={toggleRegister}>Зарегистрироваться</span></p> : <p className="text-caption">Есть аккаунт? <span className="font-bold cursor-pointer" onClick={toggleRegister}>Войти</span></p>}
                </div>
            </div>
        </div>
    );
};
