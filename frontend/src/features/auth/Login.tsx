import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, TextInput } from "../../components/UI";
import { useLoginMutation } from "../../app/services/auth";
import { setCredentials } from "./authSlice";
import { useAppDispatch } from "../../hooks/store";
import { useNavigate } from "react-router-dom";
import { VKButton } from "./LoginVK";

const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Неправильный email").required("Обязательно"),
    password: Yup.string().required("Обязательно"),
});

export const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const initialValues = {
        email: "",
        password: "",
    };

    const [login, { isLoading }] = useLoginMutation();

    const handleSubmit = async (values) => {
        try {
            console.log(values);
            const user = await login(values).unwrap();
            dispatch(setCredentials(user));
            navigate("/");
        } catch (err) {
            console.log(err, values);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="p-2 text-h1 font-bold">Добро пожаловать!</h1>
            <div className="max-w-[250px]">
                <Formik
                    initialValues={initialValues}
                    validationSchema={LoginSchema}
                    onSubmit={handleSubmit}
                >
                    <Form className="flex flex-col justify-center items-center gap-3 ">
                        <TextInput
                            name="email"
                            placeholder="Email"
                            type="email"
                            label="Email"
                        />
                        <TextInput
                            name="password"
                            placeholder="Password"
                            type="password"
                            label="Password"
                        />
                        <div className="mt-2 w-full">
                            <Button type="submit">Войти</Button>
                        </div>
                    </Form>
                </Formik>
                <div className="w-full">
                    <VKButton />
                </div>
            </div>
        </div>
    );
};
