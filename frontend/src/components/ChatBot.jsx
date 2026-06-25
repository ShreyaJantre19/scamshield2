import { useState, useRef, useEffect } from "react";

function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);

    const [messages, setMessages] = useState([
        {
            text: "Hi! 👋 I'm your ScamShield AI Assistant. Ask me anything about phishing, scams, malware, QR scams or online safety.",
            sender: "bot",
        },
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    const sendMessage = async (messageToSend = input) => {
        if (!messageToSend.trim()) return;

        const userMessage = {
            text: messageToSend,
            sender: "user",
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: messageToSend,
                }),
            });

            const data = await res.json();

            setMessages((prev) => [
                ...prev,
                {
                    text:
                        data.reply ||
                        data.response ||
                        "No response received.",
                    sender: "bot",
                },
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    text:
                        "⚠️ Sorry, ScamShield AI is currently unavailable.",
                    sender: "bot",
                },
            ]);
        }

        setLoading(false);
    };

    const quickQuestion = (question) => {
        sendMessage(question);
    };

    return (
        <>
            {/* Floating Button */}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-5 right-5 w-16 h-16 rounded-full bg-blue-600 text-white text-3xl shadow-xl hover:scale-110 transition z-50"
            >
                🛡️
            </button>

            {/* Chat Window */}

            {isOpen && (
                <div className="fixed bottom-24 right-5 w-[370px] h-[560px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50">

                    {/* Header */}

                    <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-4">

                        <div className="flex justify-between items-center">

                            <div>
                                <h2 className="font-bold text-lg">
                                    ScamShield AI
                                </h2>

                                <p className="text-xs opacity-90">
                                    Cybersecurity Assistant
                                </p>

                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-xl"
                            >
                                ✕
                            </button>

                        </div>

                    </div>

                    {/* Messages */}

                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-3 flex ${msg.sender === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`px-4 py-3 rounded-2xl max-w-[80%] ${msg.sender === "user"
                                            ? "bg-blue-600 text-white"
                                            : "bg-white shadow text-gray-800"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="mb-3 flex justify-start">

                                <div className="bg-white shadow px-4 py-3 rounded-2xl">

                                    🤖 ScamShield AI is thinking...

                                </div>

                            </div>
                        )}

                        <div ref={messagesEndRef}></div>

                    </div>

                    {/* Quick Questions */}

                    <div className="border-t p-3 flex flex-wrap gap-2">

                        <button
                            onClick={() =>
                                quickQuestion(
                                    "How do I spot phishing?"
                                )
                            }
                            className="border border-blue-500 text-blue-600 rounded-full px-3 py-1 text-xs hover:bg-blue-50"
                        >
                            Phishing
                        </button>

                        <button
                            onClick={() =>
                                quickQuestion(
                                    "Are QR code scams dangerous?"
                                )
                            }
                            className="border border-blue-500 text-blue-600 rounded-full px-3 py-1 text-xs hover:bg-blue-50"
                        >
                            QR Scams
                        </button>

                        <button
                            onClick={() =>
                                quickQuestion(
                                    "How can I verify a URL?"
                                )
                            }
                            className="border border-blue-500 text-blue-600 rounded-full px-3 py-1 text-xs hover:bg-blue-50"
                        >
                            Verify URL
                        </button>

                        <button
                            onClick={() =>
                                quickQuestion(
                                    "How do email scams work?"
                                )
                            }
                            className="border border-blue-500 text-blue-600 rounded-full px-3 py-1 text-xs hover:bg-blue-50"
                        >
                            Email Scams
                        </button>

                    </div>

                    {/* Input */}

                    <div className="border-t p-3 flex gap-2">

                        <input
                            type="text"
                            placeholder="Ask anything..."
                            className="flex-1 border rounded-full px-4 py-2 outline-none"
                            value={input}
                            onChange={(e) =>
                                setInput(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                        />

                        <button
                            onClick={() => sendMessage()}
                            className="bg-blue-600 text-white px-5 rounded-full hover:bg-blue-700"
                        >
                            Send
                        </button>

                    </div>

                </div>
            )}
        </>
    );
}

export default ChatBot;