import RegistrationForm from "./components/Register"; 
import LoginForm from "./components/Login"; 
import CreateTest from "./components/Createtest";
import { useState } from "react";

export default function App(){
    const [page, setPage] = useState("register");
    const [formRole, setFormRole] = useState({role: ""});

    const noHeaderPage = ["register", "login"]
    const showHeader = !noHeaderPage.includes(page);

    return(
        <>
            {showHeader && (
                <header>
                    <button>
                        Главная
                    </button>

                    {formRole.role === "teacher" && (
                        <button>
                            Создание тестов
                        </button>
                    )}

                    <button>
                        Профиль
                    </button>
                </header>
            )}
            <main>
                {page === "register" && <RegistrationForm setPage={setPage} formRole={formRole} setFormRole={setFormRole} />}
                {page === "login" && <LoginForm setPage={setPage} />}
                {page === "createtest" && <CreateTest />}
            </main>        
        </>
    )
};