import { useState } from "react";

export default function RegistrationForm({setPage}){
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        teacherCode: "",
        role: "student"
        })

    const handleChange = (e) => {
        const {name, value} = e.target;
        const noSpaces = ["username", "email", "password", "teacherCode"]

        if (noSpaces.includes(name) && value.includes(" ")) return;

        setForm(prev => ({...prev, [name] : value.trimStart()}))        
    };

    const roleBtn = (role) => {
        setForm(prev =>({...prev, role}))
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
  
        const required = ["username", "email", "password", "teacherCode"]

        if (!required.every(key => form[key].trim() !== "")){
            alert("Заполните все поля!");
            return;
        }
            
        if (form.role === "teacher" && !form.teacherCode.trim()){
            alert("Код учителя обязателен");
            return;
        }

        try{
            console.log("Данные для отправки:", form)
        }catch(error){
            console.log("Произошла ошибка:", error)
            alert(error.message || "Что-то пошло не так")
        }
    }

    return(
        <main className="flex w-screen h-screen justify-center items-center">
            <form className="inline-block w-[30%] h-[60%]" onSubmit={handleSubmit}>

                <div className="flex flex-col w-[100%] h-[100%] border-[2px] border-solid border-red-500 ">
                
                    <input type="text" placeholder="username" name="username" value={form.username} onChange={handleChange} />

                    <input type="email" placeholder="email" name="email" value={form.email} onChange={handleChange} />

                    <input type="password" placeholder="password" name="password" value={form.password} onChange={handleChange} />

                    {form.role === "teacher" && (
                        <input type="text" placeholder="Код Учителя" name="teacherCode" value={form.teacherCode} onChange={handleChange} />
                    )}


                    <div className="flex flex-row">
                        <button type="button" onClick={() => roleBtn("student")}> Студент </button>
                        <button type="button" onClick={() =>roleBtn("teacher")}> Преподователь </button>
                    </div>

                    <button type="submit"> Зарегистрироваться </button>
                    
                    <div className="flex flex-row">
                        <p> Уже есть аккаунт? </p>
                        <a onClick={() => setPage("login")}> Войти </a>
                    </div>

                </div>
            </form>
        </main>
    )};

