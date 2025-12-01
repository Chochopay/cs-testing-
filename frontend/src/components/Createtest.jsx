import { useState } from "react";
import set from "lodash/set";


export default function CreateTest(){
    const [createForm, setCreateForm] = useState(false);
    const [test, setTest] =  useState({
        title: "",
        questions:[{
            text:"",
            options:[
                {text: "", isCorrect: true},
                {text: "", isCorrect: false}
            ]
        }]
    });

    const handleChange = (e) => {
        const {name, value} = e.target
        
        setTest(prev =>{
            const newState = {...prev}

            set(newState, name, value);
            return newState;
        })
    }

    return (

        <main className="flex items-center justify-center">

            {createForm && (
                <div className="flex flex-col">
                    <div className="flex flex-row">
                        <h2>Создать Тест</h2>
                        <button onClick={() => setCreateForm(false)}>Закрыть</button>
                    </div>
                    <input type="text" placeholder="Название теста" value={test.title} onChange={() => handleChange} />


                </div>
            )}

            <button onClick={() => setCreateForm(true)}>Add test</button>
        </main>

    )
}