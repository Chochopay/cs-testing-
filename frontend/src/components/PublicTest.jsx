import {useState, useEffect} from "react";
 
export default function PublicTests({setSelectedId, setPage }) {
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
        <main className="pb-17 bg-v200">
            <div className="w-full flex justify-center m-5 p-4">
                <input className="border border-v400 p-2 mr-5 focus:outline-none rounded-xl bg-v100" type="text" value={search} placeholder="Найти тест" onChange={e => setSearch(e.target.value)}/>
                <button type="button" className="text-v500 font-semibold hover:bg-v500 hover:text-v200 hover:scale-105 active:scale-95 duration-200 rounded-lg p-2 transition-all" disabled={loading} onClick={loadTests} >Обновить</button>
            </div>

            {loading ? (<p>Загрузка...</p>) : (
                <ul className="flex flex-col justify-center mt-10">
                    {filterTests.map(test => (
                        <li className=" w-[90%] p-3 m-2 rounded-xl bg-v300 text-v500 font-semibold border border-v400 border-3" key={test.id}>
                            <h3 className="font-bold">{test.title}</h3>
                            <p>Количество вопросов: {test.questions?.length || 0}</p>
                            <p>Автор: {test.author?.username || "Неизвестно"}</p>
                            <button type="button" className="bg-v200 rounded-lg p-2 mt-2 hover:scale-105 hover:bg-v500 hover:text-v200 active:scale-95 duration-200 transition-all" onClick={() => {setSelectedId(test.id); setPage("taketest")}}>Пройти тест</button>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    )
}