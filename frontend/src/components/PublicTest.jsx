import {useState, useEffect} from "react";
 
export default function PublicTests() {
    const [tests, setTests] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)

    const loadTests = async () => {
        setLoading(true)
        try{
            const res = await fetch("http://127.0.0.1:8000/test/publictest")
            if (!res.ok) throw new Error("Что-то пошло не так")
            const data = await res.json()
            console.log(data)
            setTests(data)
        }catch(err){
            console.log(err.message)
            alert("Не удалось загрузить тесты")
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        loadTests()
    }, [])


    const filterTests = tests.filter(test => test.title.toLowerCase().includes(search.toLowerCase()))

    return(
        <main className="w-screen h-screen ">
            <div className="w-full flex justify-center m-5">
                <input className="border p-2 mr-5" type="text" value={search} placeholder="Найти тест" onChange={e => setSearch(e.target.value)}/>
                <button type="button" disabled={loading} onClick={loadTests} >Обновить</button>
            </div>

            {loading ? (<p>Загрузка...</p>) : (
                <ul className="flex flex-col justify-center mt-10">
                    {filterTests.map(test => (
                        <li className="border w-[90%] p-3 m-2" key={test.id}>
                            <h3>{test.title}</h3>
                            <p>Количество вопросов: {test.questions?.length || 0}</p>
                            <p>Автор: {test.author?.username || "Неизвестно"}</p>
                            <button>Пройти тест</button>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    )
}