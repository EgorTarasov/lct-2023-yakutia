import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput } from "../../components/UI";
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
import { Button, Modal } from "antd";
import { DemoWordCloud } from "../../app/pages/Graphs";
import { CustomButton } from "../../components/UI/CustomButton";

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
    const [open, setOpen] = useState(false);

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

    useEffect(() => {
        const queryObj = queryString.parse(location.search);
        if (queryObj.code) {
            const queryCode = queryObj.code?.toString() as unknown as VkLoginRequest;
            handleVKlogin(queryCode);
        }
        if (isError) window.location.href = host;
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
            navigate("/graph");
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

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <div className="flex flex-col items-center justify-center sm:pt-10 md:pt-0 pt-14">
            <Modal
                title="Авторизироваться как администратор"
                centered
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                width={1000}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Закрыть
                    </Button>
                ]}
            >
                <div className="max-w-[300px] mt-8 sm:mt-12 mx-auto py-16 justify-center">
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
                                        <CustomButton type="submit">Войти</CustomButton>
                                    </div>
                                </Form>
                            </Formik>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 mt-4">
                                    <div className="md:border-t-2 border-gray-300 w-full"></div>
                                    <p>Или</p>
                                    <div className="md:border-t-2 border-gray-300 w-full"></div>
                                </div>
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
                                        <CustomButton type="submit">
                                            Зарегистрироваться
                                        </CustomButton>
                                    </div>
                                </Form>
                            </Formik>
                        </div>
                    )}
                    <div className="mt-4">
                        {isRegistering ? <p className="text-caption">Нет аккаунта? <span className="font-bold cursor-pointer" onClick={toggleRegister}>Зарегистрироваться</span></p> : <p className="text-caption">Есть аккаунт? <span className="font-bold cursor-pointer" onClick={toggleRegister}>Войти</span></p>}
                    </div>
                </div>
            </Modal>
            <div className="text-left text-h2 sm:text-h1 font-bold">
                <h1>Добро</h1>
                <h1>пожаловать!</h1>

                <p className="text-base font-semibold">Подберите жизненный курс для себя</p>
            </div>
            <div className="text-left text-h3 sm:text-h2 pt-4  sm:pt-16">
            </div>
            <div className="h-[300px] w-full">
                <DemoWordCloud />
            </div>
            <div className="max-w-[350px] w-full flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <p>Присоединяйся и узнай про себя больше!</p>
                    <VKButton />
                </div>
                <CustomButton onClick={() => setOpen(true)}>
                    <span className="font-semibold">Войти как Админ</span>
                </CustomButton>
            </div>
        </div>
    );
};
