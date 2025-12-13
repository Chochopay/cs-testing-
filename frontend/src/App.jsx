import RegistrationForm from "./components/Register"; 
import LoginForm from "./components/Login"; 
import CreateTest from "./components/Createtest";
import InformationPage from "./components/Inf"
import ProfilePage from "./components/Profile"
import { useState } from "react";
import {useUser} from "./UserContext"

export default function App(){
    const {user} = useUser()

    const [page, setPage] = useState("register");
    const [formRole, setFormRole] = useState("");

    const noHeaderPage = ["register", "login"]
    const showHeader = !noHeaderPage.includes(page);

    return(
        <>
            {showHeader && (
                <header className="flex flex-row justify-around fixed bottom-0 left-0 w-screen border p-6">
                    <button onClick={() => setPage("main")}>
                        Главная
                    </button>

                    <button>
                        Тесты
                    </button>

                    {user?.role === "teacher" && (
                        <button onClick={() => setPage("createtest")}>
                            Создание тестов
                        </button>
                    )}

                    <button onClick={() => setPage("profile")}>
                        Профиль
                    </button>
                </header>
            )}
            <main>
                {page === "register" && <RegistrationForm setPage={setPage} setFormRole={setFormRole} />}
                {page === "login" && <LoginForm setPage={setPage} setFormRole={setFormRole} />}
                {page === "createtest" && <CreateTest />}
                {page === "main" && <InformationPage />} 
                {page === "profile" && <ProfilePage />}
            </main>        
        </>
    )
};