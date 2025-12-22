import { useState, useEffect } from "react";
import { useUser } from "../UserContext";

export default function CreateTest() {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [tests, setTests] = useState([]);
    const [createForm, setCreateForm] = useState(false);

    const [test, setTest] = useState({
        title: "",
        questions: [],
    });

    const [newQuestionText, setNewQuestionText] = useState("");
    const [optionText, setOptionText] = useState("");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const question = test.questions[currentQuestion];

    const addQuestion = () => {
        if (!newQuestionText.trim()) return;

        setTest((prev) => {
            const copy = structuredClone(prev);
            copy.questions.push({ text: newQuestionText, options: [] });
            return copy;
        });

        setCurrentQuestion(test.questions.length);
        setNewQuestionText("");
    };

    const addOption = (questionIndex) => {
        if (!optionText.trim()) return;

        setTest((prev) => {
            const copy = structuredClone(prev);
            copy.questions[questionIndex].options.push({ text: optionText, isCorrect: false });
            return copy;
        });

        setOptionText("");
    };

    const deleteQuestion = (questionIndex) => {
        setTest((prev) => {
            const copy = structuredClone(prev);
            copy.questions = copy.questions.filter((_, idx) => idx !== questionIndex);
            setCurrentQuestion((prev) => {
                if (copy.questions.length === 0) return 0;
                if (prev >= copy.questions.length) return copy.questions.length - 1;
                return prev;
            });
            return copy;
        });
    };

    const deleteOption = (questionIndex, optionIndex) => {
        setTest((prev) => {
            const copy = structuredClone(prev);
            copy.questions[questionIndex].options = copy.questions[questionIndex].options.filter(
                (_, idx) => idx !== optionIndex
            );
            return copy;
        });
    };

    const setCorrectOption = (questionIndex, optionIndex) => {
        setTest((prev) => {
            const copy = structuredClone(prev);
            copy.questions[questionIndex].options.forEach((opt, idx) => {
                opt.isCorrect = idx === optionIndex;
            });
            return copy;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("Вы не зарегистрированы");
            return;
        }

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
            if (!q.text.trim()) {
                alert(`Вопрос ${i + 1} пустой`);
                return;
            }
            if (!q.options || q.options.length < 2) {
                alert(`Вопрос ${i + 1} должен содержать хотя бы 2 варианта`);
                return;
            }
            const hasCorrect = q.options.some((opt) => opt.isCorrect);
            if (!hasCorrect) {
                alert(`Вопрос ${i + 1} должен иметь хотя бы 1 правильный ответ`);
                return;
            }
            for (let j = 0; j < q.options.length; j++) {
                if (!q.options[j].text.trim()) {
                    alert(`В вопросе ${i + 1} вариант ${j + 1} пустой`);
                    return;
                }
            }
        }

        const testData = { ...test, author_id: user.id };

        try {
            const response = await fetch("http://127.0.0.1:8000/test/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(testData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.detail || "Ошибка запроса");
                return;
            }

            await response.json();
            alert("Тест успешно создан");
            setTest({ title: "", questions: [] });
            setCurrentQuestion(0);
            setNewQuestionText("");
            setOptionText("");
            setCreateForm(false);
        } catch (error) {
            console.log("Произошла ошибка:", error);
            alert("Сетевая ошибка, попробуйте ещё раз");
        }
    };

    const loadTest = async () => {
        try {
            setLoading(true);
            const res = await fetch(`http://127.0.0.1:8000/publictest/${user.id}`);
            if (!res.ok) throw new Error("Тесты не найдены");
            const data = await res.json();
            setTests(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) loadTest();
    }, [user]);

    const filterTests = tests.filter((test) => test.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <main className="flex items-center justify-center w-screen h-screen">
            <div className="flex flex-col text-center absolute top-0 mt-3">
                <h3>Мои тесты</h3>
                <input
                    type="text"
                    className="border mt-3"
                    placeholder="Найти тест"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="flex flex-col">
                {loading ? (
                    <p>Загрузка...</p>
                ) : (
                    <ul>
                        {filterTests.map((t) => (
                            <li key={t.id}>
                                <button type="button">Удалить тест</button>
                                <h3>{t.title}</h3>
                                <p>Количество вопросов: {t.questions?.length || 0}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {createForm && (
                <div className="flex flex-col p-4 border rounded w-[600px] absolute">
                    <div className="flex flex-row justify-between mb-4">
                        <h2 className="text-xl font-bold">Создать тест</h2>
                        <button onClick={() => setCreateForm(false)}>Закрыть</button>
                    </div>

                    <input
                        type="text"
                        className="border p-2 mb-3"
                        placeholder="Название теста"
                        value={test.title}
                        onChange={(e) => setTest((prev) => ({ ...prev, title: e.target.value }))}
                    />

                    <input
                        type="text"
                        className="border p-2 mb-3"
                        placeholder="Введите текст вопроса и нажмите Enter"
                        value={newQuestionText}
                        onChange={(e) => setNewQuestionText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addQuestion();
                            }
                        }}
                    />

                    {question && (
                        <div key={currentQuestion} className="border p-3 rounded mb-3">
                            <button className="m-2" onClick={() => deleteQuestion(currentQuestion)}>
                                delete
                            </button>
                            <h3 className="font-semibold">
                                Вопрос {currentQuestion + 1}) {question.text}
                            </h3>

                            <div className="text-sm text-gray-700 mt-2 ml-2">
                                {question.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center m-2 relative border">
                                        <input
                                            type="radio"
                                            name={`question-${currentQuestion}`}
                                            checked={option.isCorrect}
                                            onChange={() => setCorrectOption(currentQuestion, optionIndex)}
                                            className="m-2"
                                        />
                                        <span className="block w-[80%] break-words">{option.text}</span>
                                        <button
                                            onClick={() => deleteOption(currentQuestion, optionIndex)}
                                            className="absolute right-2 -translate-y-1/2 top-1/2"
                                        >
                                            del
                                        </button>
                                    </div>
                                ))}
                                <input
                                    type="text"
                                    className="border p-1 mt-2"
                                    placeholder="Добавить вариант"
                                    value={optionText}
                                    onChange={(e) => setOptionText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addOption(currentQuestion);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex mb-2">
                        <button onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}>Назад</button>
                        <button
                            onClick={() => setCurrentQuestion((prev) => Math.min(prev + 1, test.questions.length - 1))}
                        >
                            Вперед
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!user || !test.title || test.questions.length === 0}
                    >
                        Сохранить тест
                    </button>
                </div>
            )}

            <button
                onClick={() => setCreateForm(true)}
                className="fixed right-5 bottom-25 p-5 rounded bg-blue-500 text-white"
            >
                Add test
            </button>
        </main>
    );
}
