import { useState } from "react";
import {useUser} from "../UserContext"

export default function LoginForm({setPage, setFormRole}) {  
    const {setUser} = useUser()

    const [form, setForm] = useState({
        username: "", 
        password: ""
    })

    const [visible, setVisible] = useState(true)

    const handleChange = (e) => {
        const {name, value} = e.target;
        const noSpaces = ["username", "password"]
        if (noSpaces.includes(name) && value.includes(" ")) return;

        setForm((prev) => ({...prev, [name]: value.trimStart()}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const required = ["username", "password"]

        if (!required.every(key => form[key].trim() !== "")){
            alert("Все поля должны быть заполнены");
            return;
        }

        try{
            console.log("Данные для отправки", form)

            const response = await fetch("http://127.0.0.1:8000/auth/login", {
                method: "POST", 
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify ({
                    username: form.username,
                    password: form.password
                    })
                }
            )

            const data = await response.json()

            if (response.ok){
                console.log("Успешно вошел", data)
                alert(`Добро пожаловать ${data.username}`)
                setUser(data)
                setPage("main")
            }else{
                console.log(data.detail || "Ошибка при входе")
                alert(data.detail || "Ошибка при входе")
            }
            

        }catch(error){
            console.log("Произошла ошибка", error)
            alert(error.message || "Что-то пошло не так")
        }
    }


    return(
        <main className="flex w-screen h-screen justify-center items-center">
           
            <form className="inline-block w-[30%] h-[60%]" onSubmit={handleSubmit}>
                <div className="flex flex-col ">
                    <input type="text" autoComplete="username" placeholder="username" name="username" value={form.username} onChange={handleChange} />

                    <div className="relative">
                        <input type={visible ? "password": "text"} className="w-full" placeholder="password" name="password" value={form.password} onChange={handleChange}/>
                        <button type="button" className="absolute right-0 mr-3" onClick={() => setVisible(!visible)}>G</button>
                    </div>

                    <button type="submit">Войти</button>

                    <div className="flex flex-row">
                        <p>Вы не зарегистрированы?</p>
                        <button type="button" onClick={() => setPage("register")}>Зарегистрироваться</button>
                    </div>
                </div>
            </form>

        </main>
    )
}