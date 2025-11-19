import { useState } from "react";

export default function LoginForm({setPage}) {  
    const [form, setForm] = useState({
        email: "", 
        password: ""
    })

    const handleChange = (e) => {
        const {name, value} = e.target;
        const noSpaces = ["email", "password"]
        if (noSpaces.includes(name) && value.includes(" ")) return;

        setForm((prev) => ({...prev, [name]: value.trimStart()}))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const required = ["email", "password"]

        if (!required.every(key => form[key].trim !== "")){
            alert("Все поля должны быть заполнены");
            return;
        }

        try{
            console.log("Данные для отправки", form)
        }catch(error){
            comsole.log("Произошла ошибка", error)
            alert(error.message || "Что-то пошло не так")
        }
    }


    return(
        <main className="flex w-screen h-screen justify-center items-center">
           
            <form className="inline-block w-[30%] h-[60%]" onSubmit={handleSubmit}>
                <div className="flex flex-col ">
                    <input type="email" placeholder="email" name="email" value={form.email} onChange={handleChange} />

                    <input type="password" placeholder="password" name="password" value={form.password} onChange={handleChange}/>

                    <button type="submit">Войти</button>

                    <div className="flex flex-row">
                        <p>Вы не зарегистрированы?</p>
                        <a onClick={() => setPage("register")}>Зарегистрироваться</a>
                    </div>
                </div>
            </form>

        </main>
    )
}