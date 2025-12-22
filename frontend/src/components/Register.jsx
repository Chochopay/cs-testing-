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
        <main className="flex w-screen h-screen justify-center items-center bg-v200">
            <form className="inline-block w-[25%] h-[70%]" onSubmit={handleSubmit}>
                <div className="flex flex-col w-full h-full rounded-xl p-3 bg-v300 text-center items-center">
                    <h2 className="font-bold text-2xl mt-3 text-v500">Sign up</h2> 

                    <input type="text" placeholder="username" name="username" className="focus:outline-none rounded-xl border-o bg-v200 rounded-xl w-full h-10 m-2 mt-10 p-2" value={form.username} onChange={handleChange} />

                    <input type="email" placeholder="email" className="focus:outline-none w-full h-10 bg-v200 p-2 border-0 rounded-xl m-2" name="email" value={form.email} onChange={handleChange} />

                    <div className="relative flex w-full h-10 rounded-xl bg-v200 m-2">
                        <input className="w-full focus:outline-none bg-v200 h-full rounded-xl p-2" type={visible ? "password": "text"} placeholder="password" name="password" value={form.password} onChange={handleChange} />
                        <button type="button" className="absolute right-0 mr-3 top-1/2 -translate-y-1/2" onClick={() => setVisible(!visible)}>G</button>
                    </div>

                    <input type="text" disabled={form.role === "student"} placeholder={form.role === "teacher" ? "Код учителя" : "Не обязательно"} name="teacherCode" className="focus-v200 rounded-xl bg-v200 focus:outline-none p-2 m-2 w-full " value={form.teacherCode} onChange={handleChange} />
            

                    <div className="flex flex-row mt-7 text-v500 w-full justify-center p-2">
                        <button type="button" className={`rounded-xl bg-v300 hover:border-v500 hover:border-2 hover:scale-105 transition-all duration-150 p-2 mr-3 w-3/6 ${form.role === "student" ? "bg-v500 text-v200" : "bg-v300"}`} onClick={() => roleBtn("student")}> Студент </button>
                        <button type="button" className={`rounded-xl bg-v300 hover:border-v500 hover:border-2 hover:scale-105 transition-all duration-150 p-2 ml-3 w-3/6 ${form.role === "teacher" ? "bg-v500 text-v200" : "bg-v300"}`} onClick={() => roleBtn("teacher")}> Преподаватель </button>
                    </div>

                    <button type="submit" className="mt-7 text-v500 duration-150 hover:scale-105 active:scale-100 hover:bg-v500 hover:text-v200 rounded-xl p-2 m-2"> Зарегистрироваться </button>

                    <div className="flex flex-row mt-3 justify-center w-full text-v500">
                        <p > Уже есть аккаунт? </p>
                        <button type="button" className="ml-5 font-bold" onClick={() => setPage("login")}> Войти </button>
                    </div>
                </div>
            </form>
        </main>
    );
};
