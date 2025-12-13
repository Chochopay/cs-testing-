import { useState } from "react";
import {useUser} from "../UserContext"

export default function RegistrationForm({ setPage}) {
    const {setUser} = useUser()

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        teacherCode: "",
        role: "student"
    });

    const [visible, setVisible] = useState(true)

    const handleChange = (e) => {
        const { name, value } = e.target;
        const noSpaces = ["username", "email", "password", "teacherCode"];

        if (noSpaces.includes(name) && value.includes(" ")) {
            alert("Пробел но но но");
            return;
        }

        setForm(prev => ({ ...prev, [name]: value.trimStart() }));
    };

    const roleBtn = (role) => {
        setForm(prev => ({
            ...prev,
            role,
            teacherCode: role === "teacher" ? prev.teacherCode : ""
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const required = ["username", "email", "password"];
        if (form.role === "teacher") required.push("teacherCode");

        if (!required.every(key => form[key].trim() !== "")) {
            alert("Заполните все поля!");
            return;
        }

        if (form.role === "teacher" && !form.teacherCode.trim()) {
            alert("Код учителя обязателен");
            return;
        }

        console.log("Данные перед отправкой:", form);

        try {
            const response = await fetch("http://127.0.0.1:8000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: form.username,
                    email: form.email,
                    role: form.role,
                    password: form.password,
                    teacher_code: form.role === "teacher" ? form.teacherCode : null
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Успешно зарегистрирован", data);
                alert(`Пользователь ${data.username} зарегистрирован`);
                setUser(data)
                setPage("main");
            } else {
                console.log(data.detail || "Ошибка при регистрации");
                alert(data.detail || "Ошибка при регистрации");
            }

        } catch (error) {
            console.log("Произошла ошибка:", error);
            alert("Сетевая ошибка, попробуйте ещё раз");
        }
    };

    return (
        <main className="flex w-screen h-screen justify-center items-center">
            <form className="inline-block w-[30%] h-[60%]" onSubmit={handleSubmit}>
                <div className="flex flex-col w-[100%] h-[100%] border-[2px] border-solid border-red-500 ">

                    <input type="text" placeholder="username" name="username" value={form.username} onChange={handleChange} />

                    <input type="email" placeholder="email" name="email" value={form.email} onChange={handleChange} />

                    <div className="relative flex">
                        <input className="w-full" type={visible ? "password": "text"} placeholder="password" name="password" value={form.password} onChange={handleChange} />
                        <button type="button" className="absolute right-0 mr-3" onClick={() => setVisible(!visible)}>G</button>
                    </div>

                    {form.role === "teacher" && (
                        <input type="text" placeholder="Код Учителя" name="teacherCode" value={form.teacherCode} onChange={handleChange} />
                    )}

                    <div className="flex flex-row">
                        <button type="button" onClick={() => roleBtn("student")}> Студент </button>
                        <button type="button" onClick={() => roleBtn("teacher")}> Преподаватель </button>
                    </div>

                    <button type="submit"> Зарегистрироваться </button>

                    <div className="flex flex-row">
                        <p> Уже есть аккаунт? </p>
                        <button type="button" onClick={() => setPage("login")}> Войти </button>
                    </div>
                </div>
            </form>
        </main>
    );
};
