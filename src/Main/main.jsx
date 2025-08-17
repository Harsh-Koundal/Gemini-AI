import React, { useState } from "react";
import Sidebar from "../sidebar";
import './main.css'
import { assets } from "../assets/assets";
import { URL } from "../constant";

const Main = () => {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recentPrompt , setRecentPrompt] = useState([])

    const askQuestion = async (customQuestion) => {
        
        const finalQuestion = customQuestion || question;
        if (!finalQuestion.trim()) return;

        const userMessage = { text: finalQuestion, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setRecentPrompt(prev=> prev.includes(finalQuestion)? prev : [...prev ,finalQuestion]);
        setQuestion('');
        setLoading(true);

        const payload = {
            contents: [{ parts: [{ text: finalQuestion }] }]
        };

        try {
            let response = await fetch(URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            response = await response.json();
            const botText = response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received";
            const botMessage = { text: botText, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            setMessages(prev => [...prev, { text: "Error fetching response", sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main">
            <div className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon} alt="" />
            </div>

            <div className="main-container">
                {messages.length > 0 ? (
                    <div className="chat-container">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                <img src={assets.user_icon} alt="" />
                                <p>{msg.text}</p>
                            </div>
                        ))}
                        {loading && (
                            <div className="message bot typing-animation">
                                <span></span><span></span><span></span>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="greet">
                            <p><span>Hello, Anku</span></p>
                            <p>How can I help you today?</p>
                        </div>
                        <div className="cards">
                            <div className="card" onClick={()=>askQuestion("Suggest beautiful places to see on an upcoming road trip")} >
                                <p>Suggest beautiful places to see on an upcoming road trip</p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                            <div className="card" onClick={()=>askQuestion("Briefly summarize this concept: urban planning")}>
                                <p>Briefly summarize this concept: urban planning</p>
                                <img src={assets.bulb_icon} alt="" />
                            </div>
                            <div className="card"onClick={()=>askQuestion("Brainstorm team bonding activities for our work retreat")}>
                                <p>Brainstorm team bonding activities for our work retreat</p>
                                <img src={assets.message_icon} alt="" />
                            </div>
                            <div className="card"onClick={()=>askQuestion("Improve the readability of the following code")}>
                                <p>Improve the readability of the following code</p>
                                <img src={assets.code_icon} alt="" />
                            </div>
                        </div>
                    </>
                )}

                <div className="main-bottom">
                    <div className="search-box">
                        <input
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") askQuestion();
                            }}
                            type="text"
                            placeholder="Enter a prompt here"
                        />
                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            <img src={assets.mic_icon} alt="" />
                            <img onClick={askQuestion} src={assets.send_icon} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
