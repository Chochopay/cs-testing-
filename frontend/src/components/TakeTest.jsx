import {useState, useEffect} from "react";
import { useUser } from "../UserContext";

export default function TakeTest({testId, setPage}) {

    const {user} = useUser()

    const [test, setTest] = useState(null)
    const [loading, setLoading] = useState(false)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [result, setResult] = useState(null)

    const clear = () => {
        setTest(null)
        setCurrentQuestion(0)
        setResult(null)
    }

    const loadTest = async () => {

        try{
            setLoading(true)
            const res = await fetch(`http://127.0.0.1:8000/test/publictest/${testId}`)
            if (!res.ok) throw new Error("Что-то пошло не так");

            const data = await res.json();
            setTest(data)

        }catch(err){
            console.log(err)

        }finally{setLoading(false)}
    }
    
    const [answers, setAnswers] = useState([])

    useEffect(() => {
        loadTest()
    }, [])

    useEffect(() => {
        if (test){
            setAnswers(Array(test.questions.length).fill(null))
        }
    }, [test])

    const selectOption = (currentQuestion, optionId) => {
        setAnswers(prev => {
            const copy = [...prev]
            copy[currentQuestion] = optionId
            return copy
        })
    }

    const handleSubmit = async () => {
        if (!test) return;

        if (answers.some(a => a === null)) {
            alert("Ответьте на все вопросы");
            return;
        }

        const payLoad = {
            test_id: test.id, 
            user_id: user.id,
            answers: test.questions.map((q, qId) => ({
                question_id: q.id,
                option_id: answers[qId]
            }))
            
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/test/publictest/submit",{
                method: "POST", 
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify(payLoad)
            })
            if(!res.ok) throw new Error("Что-то пошло не так")
                
            const data = await res.json()
            console.log(data)
            setResult(data)
        } catch (err) {
            console.log(err)
        }
    }

    const question = test?.questions[currentQuestion]

    return (
        <main className="w-screen h-screen flex justify-center items-center">
            <button className="absolute left-4 top-2" onClick={() => setPage("publictest")}>Назад</button>

            {loading ? (<p>Загрузка...</p>) : (
                <div className="flex flex-col border w-1/3 h-3/5 text-center justify-between items-center" >
                    {test && question && (
                        <div className="flex flex-col mt-4  w-full h-2/5">
                            <h3 className="m-2">Вопрос {currentQuestion + 1} из {test?.questions?.length || 0}</h3>
                            <p>{question.text}</p>
                        </div>
                    )}
                    <div className="flex flex-col w-full h-full items-start border justify-center ">
                        {question?.options?.map((option) => (
                            <label key={option.id} className="m-2  w-14/15 flex p-2 border" >
                                <input type="radio" name={`question-${currentQuestion}`} checked={answers[currentQuestion] === option.id} onChange={() => selectOption(currentQuestion, option.id)} 
                                    className="m-2"/>
                                <span>{option.text}</span>
                            </label>
                                ))}
                    </div>
                    <div className="flex w-full border justify-center">
                        <button className="m-2" onClick={() => setCurrentQuestion(prev => Math.max(prev - 1, 0))}> Назад </button>
                        {currentQuestion < test?.questions?.length - 1 ? (
                            <button onClick={() => setCurrentQuestion(prev => Math.min(prev + 1, test?.questions?.length - 1))}>Вперед</button>
                        ) : (
                            <button className="" onClick={handleSubmit} disabled={answers.some(p => p === null)}>Завершить</button>
                        )}
                    </div>
                </div>
            )}
            {result && (
                <div className="flex justify-center items-center fixed z-100 inset-0 w-screen h-screen bg-black/50 ">
                    <div className="flex flex-col bg-white w-1/3 h-1/3 text-center justify-around items-center rounded border border-3">
                        <h3 className="font-bold ">Ваш результат</h3>
                        <p>Вы ответили правильно на {result?.score} вопросов из {result?.total} </p>
                        <button type="button" className="w-1/3 border rounded " onClick= {() =>setPage("publictest")}>Выйти</button>
                    </div>
                </div>
            )}

        </main>
    )
}