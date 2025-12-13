import { useState } from "react";

export default function CreateTest() {
    const [createForm, setCreateForm] = useState(false);

    const [test, setTest] = useState({
        title: "",
        questions: []
    });

    const toggleCorrect = (optionIndex) => {
        setTest(prev => {

            const copy = structuredClone(prev)
            copy.questions[currentQuestion].options[optionIndex].isCorrect = !copy.questions[currentQuestion].options[optionIndex].isCorrect
            
            return copy;
        })
    }

    const [newQuestionText, setNewQuestionText] = useState("");
    const [optionText, setOptionText] = useState("");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const question = test.questions[currentQuestion]

    const addQuestion = () => {
        if (!newQuestionText.trim()) return;

        setTest(prev => {
            const copy = structuredClone(prev);
            copy.questions.push({
                text: newQuestionText,
                options: []
            });
            return copy;
        });

        setCurrentQuestion(test.questions.length);
        setNewQuestionText("");
    };

    const addOption = (currentQuestion) => {
        if (!optionText.trim()) return;

        setTest(prev => {
            const copy = structuredClone(prev);
            copy.questions[currentQuestion].options.push({
                text: optionText,
                isCorrect: false
            });
            return copy;
        });

        setOptionText("");
    };

    const questionKey = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addQuestion();
        }
    };

    const optionKey = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addOption(currentQuestion);  
        }
    };

    const deleteQuestion = (currentQuestion) => {
        setTest(prev =>{
            const copy = structuredClone(prev);
            copy.questions = copy.questions.filter((_, idx) => idx !== currentQuestion);

            setCurrentQuestion(prev => {
                if (copy.questions.length === 0) return 0;
                if (prev >= copy.questions.length) return copy.questions.length - 1;
                return prev;
            })
            
            return copy
        })
    }

    const deleteOption = (questionIndex, optionIndex) => {
    setTest(prev => {
        const copy = structuredClone(prev);
        copy.questions[questionIndex].options = copy.questions[questionIndex].options.filter((_, idx) => idx !== optionIndex);

        return copy;  
    });
};

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!test.title || test.title.trim() === "") {
            alert("Название теста обязательно");
            return;
        }

        if (!test.questions || test.questions.length === 0) {
            alert("Тест должен содержать хотя бы 1 вопрос");
            return;
        }

        for (let i = 0; i < test.questions.length; i++) {
            const q = test.questions[i];

            if (!q.text || q.text.trim() === "") {
                alert(`Вопрос ${i+1} пустой`);
                return;
            }

            if (!q.options || q.options.length < 2) {
                alert(`Вопрос ${i+1} должен содержать хотя бы 2 варианта`);
                return;
            }

            const hasCorrect = q.options.some(opt => opt.isCorrect);
            if (!hasCorrect) {
                alert(`Вопрос ${i+1} должен иметь хотя бы 1 правильный ответ`);
                return;
            }

            for (let j = 0; j < q.options.length; j++) {
                if (!q.options[j].text || q.options[j].text.trim() === "") {
                    alert(`В вопросе ${i+1} вариант ${j+1} пустой`);
                    return;
                }
            }
        }

        try{
            const response = await fetch("", {
                method: "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(test)
            });

            

        } catch (error) {
            console.log("Произошла ошибка:", error);
            alert("Сетевая ошибка, попробуйте ещё раз");
        }
    }

    return (
        <main className="flex items-center justify-center w-screen h-screen">

            {createForm && (
                <div className="flex flex-col p-4 border rounded w-[600px]">

                    <div className="flex flex-row justify-between mb-4">
                        <h2 className="text-xl font-bold">Создать тест</h2>
                        <button onClick={() => setCreateForm(false)}>
                            Закрыть
                        </button>
                    </div>

                    <input
                        type="text"
                        className="border p-2 mb-3"
                        placeholder="Название теста"
                        name="title"
                        value={test.title}
                        onChange={e => setTest(prev => ({ ...prev, title: e.target.value }))}
                    />

                    <input
                        type="text"
                        className="border p-2 mb-3"
                        placeholder="Введите текст вопроса и нажмите Enter"
                        value={newQuestionText}
                        onChange={(e) => setNewQuestionText(e.target.value)}
                        onKeyDown={questionKey}
                    />

                    <div>
                        {question && (
                            <div key={currentQuestion} className="border p-3 rounded mb-3">

                                <button className="m-2 top-0 right-0" onClick={() => deleteQuestion(currentQuestion)}> delete</button>

                                <h3 className="font-semibold">
                                    Вопрос {currentQuestion + 1}: {question.text}
                                </h3>

                                <div className="text-sm text-gray-700 mt-2 ml-2">
                                    {question.options.map((option, optionIndex) => (                                 
                                        <div className="flex justify-between m-2 border p-2 relative" key={optionIndex}>
                                            <span className="font-mono break-words w-[80%]">
                                                {optionIndex + 1}) {option.text}
                                            </span>

                                            <input type="checkbox" onChange={() => toggleCorrect(optionIndex)} className=" right-10 absolute top-1/2 -translate-y-1/2"/>
                                            <button className=" absolute right-3 top-1/2 -translate-y-1/2" onClick={() => deleteOption(currentQuestion, optionIndex)} >del</button>
                                        </div>                                                    
                                    ))}
                                    <input
                                        type="text"
                                        className="border p-1 mt-2"
                                        placeholder="Добавить варивнт"
                                        value={optionText}
                                        onChange={(e) => setOptionText(e.target.value)}
                                        onKeyDown={optionKey}        
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex">
                            <button onClick={() => setCurrentQuestion(prev => Math.max(prev - 1, 0))}>Назад</button>
                            <button onClick={() => setCurrentQuestion(prev => Math.min(prev + 1, test.questions.length - 1))}>Вперед</button>
                        </div>
                    </div>

                    <button type="submit">Сохранить тест</button>
                </div>
            )}

            <button onClick={() => setCreateForm(true)} className="fixed right-5 bottom-25 p-5 rounded bg-blue-500 text-white">
                Add test
            </button>
        </main>
    );
}
