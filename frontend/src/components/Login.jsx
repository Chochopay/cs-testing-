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
        <main className="flex w-screen h-screen justify-center items-center bg-v200">
           
            <form className="inline-block w-[25%] h-[70%]" onSubmit={handleSubmit}>
                <div className="flex flex-col bg-v300 w-full h-full rounded-xl p-3 items-center jusify-around">
                    <h2 className="text-xl font-bold m-2 text-v500 mb-10 mt-10">Sign in</h2>

                    <input type="text" autoComplete="username" placeholder="username" name="username" className="p-2 w-full focus:outline-none bg-v200 rounded-xl m-2" value={form.username} onChange={handleChange} />

                    <div className="relative w-full m-2">
                        <input type={visible ? "password": "text"} className="w-full p-2 focus:outline-none bg-v200 rounded-xl" placeholder="password" name="password" value={form.password} onChange={handleChange}/>
                        <button type="button" className="absolute right-0 mr-3 top-1/2 -translate-y-1/2" onClick={() => setVisible(!visible)}>G</button>
                    </div>

                    <button type="submit" className="mt-10 w-1/2 text-center p-2 transition-all duration-100 hover:border-2 hover:border-v500 rounded-xl text-v500 font-bold m-2 active:bg-v500 active:text-v200">Войти</button>

                    <div className="flex flex-row text-v500 mt-10">
                        <p>Вы не зарегистрированы?</p>
                        <button className="pl-2 font-bold" type="button" onClick={() => setPage("register")}>Зарегистрироваться</button>
                    </div>
                </div>
            </form>

        </main>
    )
}