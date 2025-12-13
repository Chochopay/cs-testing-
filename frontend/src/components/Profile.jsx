import {useUser} from "../UserContext"

export default function ProfilePage(){
    const {user} = useUser()

    if (!user){
        return <p className="mt-20 text-center"> Загрузка данных... </p>
    }

    return(
        <main className="flex flex-col w-screen h-screen justify-center items-center">
            <div className="flex flex-col border w-[25%] h-[60%] text-center">
                <h1> Профиль </h1>

                <div className="flex flex-col text-start pl-5 pt-3">
                    <p><strong>username:</strong> {user.username}</p>
                    <p><strong>email:</strong> {user.email}</p>
                    <p><strong>role:</strong> {user.role}</p>
                </div>
            </div>
        </main>
    )
}