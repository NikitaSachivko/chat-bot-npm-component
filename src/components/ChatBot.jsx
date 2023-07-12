import React, { useEffect, useState } from 'react'

const ChatBot = ({ token }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [inputText, setInputText] = useState("")
    const [popularQuestions, setPopularQuestions] = useState({})

    const fetchChaBotConfiguration = async (token) => {
        try {

            const response = await fetch(`http://localhost:8080/chat-bot/${token}`, {
                method: 'GET',
            })

            // if (!response.ok) {
            //     throw new Error('Failed to fetch chat bot configuration')
            // }

            const data = await response.json()

            return data.chatBot
        } catch (error) {
            console.error(error)
        }
    }

    const fetchAnswer = async (token, question) => {
        try {
            const requestBody = JSON.stringify({ token, question })

            const response = await fetch("http://localhost:8080/openai/get-answer", {
                method: 'POST',
                body: requestBody,
            })

            if (!response.ok) {
                throw new Error('Failed to fetch answer from the API.')
            }

            const data = await response.json()
            return data.answer
        } catch (error) {
            console.error(error)
        }
    }

    const handleSendMessage = async () => {
        const userMessage = { content: inputText, sender: 'user' }
        const botMessage = { content: '', sender: 'bot' }

        setMessages((prevMessages) => [...prevMessages, userMessage])
        setIsLoading(true)

        try {
            const answer = await fetchAnswer(token, inputText)
            botMessage.content = answer
            setMessages((prevMessages) => [...prevMessages, botMessage])
        } catch (error) {
            console.error('Error:', error)
        }

        setIsLoading(false)
    }

    useEffect(() => {
        const fetchChatBot = async () => {
            const data = await fetchChaBotConfiguration(token)
            const dataSorted = data.dictionaries.sort((a, b) => b.count - a.count)
            const [firstObject, secondObject] = dataSorted.slice(0, 2)
            setPopularQuestions({
                firstQuestion: firstObject,
                secondQuestion: secondObject,
            })
        }

        fetchChatBot()
    }, [token])

    const handlePopularQuestionsSelection = (text) => {
        setInputText(text)
    }

    return (
        <>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`absolute bg-white text-black h-16 w-16 rounded-full bottom-20 end-20`}>
            </div>
            <div>
                {
                    isOpen &&
                    <div className={`grid grid-rows-6 rounded-t-lg rounded-bl-lg absolute bg-white text-black h-[500px] w-[350px] bottom-36 end-36`}>
                        <div className="row-span-5 bg-white drop-shadow-md overflow-auto p-5">
                            {
                                !!messages && messages.map((message, key) => {
                                    return (
                                        <div key={key} className={`h-min mb-5 flex ${message.sender === 'bot' ? "justify-end" : "justify-start"} `}>
                                            <div className={`min-w-[70px] max-w-[200px] text-sm ${message.sender === 'bot' ? "text-white bg-slate-900 rounded-tl-xl" : "bg-amber-400 rounded-tr-xl"} rounded-b-xl text-lg p-2 shadow-md text-start w-fit min-w-30`} >{message.content}</div>
                                        </div>
                                    )
                                })
                            }
                            {!!popularQuestions.firstQuestion?.question && messages.length === 0 &&
                                <div onClick={() => handlePopularQuestionsSelection(popularQuestions.firstQuestion?.question)} className={`h-min mb-5 flex justify-center cursor-pointer`}>
                                    <div className={`min-w-[70px] max-w-[200px] text-sm text-white bg-slate-900 rounded-tl-xl rounded-xl text-lg p-2 shadow-md text-start w-fit min-w-30`} >
                                        {popularQuestions.firstQuestion?.question}
                                    </div>
                                </div>
                            }
                            {!!popularQuestions.secondQuestion?.question && messages.length === 0 &&
                                <div onClick={() => handlePopularQuestionsSelection(popularQuestions.firstQuestion?.question)} className={`h-min mb-5 flex justify-center cursor-pointer`}>
                                    <div className={`min-w-[70px] max-w-[200px] text-sm text-white bg-slate-900 rounded-tl-xl rounded-xl text-lg p-2 shadow-md text-start w-fit min-w-30`} >
                                        {popularQuestions.secondQuestion?.question}
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="row-span-1 grid grid-cols-12 border border-gray-300 rounded-bl-lg">
                            <div className="col-span-9">
                                <input onChange={(event) => setInputText(event.target.value)} value={inputText} type="text" className="outline-none h-full col-span-4text-gray-900 text-sm rounded-bl-lg w-full p-2.5" placeholder="Ask a question" />
                            </div>
                            <div className="col-span-3 flex justify-center content-center items-center text-lg">
                                {!isLoading ?
                                    <div className="cursor-pointer" onClick={() => handleSendMessage()}>
                                        Send
                                    </div>
                                    :
                                    <svg className="animate-spin" width="40px" height="40px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z" /></svg>
                                }
                            </div>
                            {/* <button className="col-span-1 text-sm">Submit</button> */}
                        </div>
                    </div>
                }
            </div >
        </>
    )
}

export default ChatBot
