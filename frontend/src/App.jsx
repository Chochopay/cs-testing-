import RegistrationForm from "./components/Register"; 
import LoginForm from "./components/Login"; 
import { useState } from "react";

export default function App(){
    const [page, setPage] = useState("register");

    return(
        <main>
            {page === "register" && <RegistrationForm setPage={setPage} />}
            {page === "login" && <LoginForm setPage={setPage} />}
        </main>
    )
};