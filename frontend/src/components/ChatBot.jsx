import { useState } from "react";

function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);

    const [messages, setMessages] = useState([
        {
            text: "Hi! I'm your ScamShield Assistant. Ask me anything about phishing, scams, malware, or how to stay safe online.",
            sender: "bot",
        },
    ]);

    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = {
            text: input,
            sender: "user",
        };

        setMessages((prev) => [...prev, userMsg]);

        const currentInput = input;
        setInput("");

        try {
            const res = await fetch("http://localhost:8000/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: currentInput,
                }),
            });

            const data = await res.json();

            setMessages((prev) => [
                ...prev,
                {
                    text: data.reply,
                    sender: "bot",
                },
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    text: "Sorry, something went wrong.",
                    sender: "bot",
                },
            ]);
        }
    };

    const handleQuickQuestion = (question) => {
        setInput(question);
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-5 right-5 bg-blue-600 text-white w-16 h-16 rounded-full shadow-xl text-2xl z-50 hover:scale-105 transition"
            >
                🛡️
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-5 w-[360px] h-[450px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] overflow-hidden z-50 flex flex-col">

                    {/* Header */}
                    <div className="bg-blue-600 text-white px-4 py-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="font-bold text-lg">
                                    ScamShield Assistant
                                </h2>

                                <p className="text-xs opacity-90">
                                    Security advisor • Always online
                                </p>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-xl hover:opacity-80"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="h-[220px] overflow-y-auto p-4 bg-white">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-3 flex ${msg.sender === "user"
                                    ? "justify-end"
                                    : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`px-4 py-2 rounded-2xl max-w-[80%] ${msg.sender === "user"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-black"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Questions */}
                    <div className="px-3 py-2 flex flex-wrap gap-2 border-t">

                        <button
                            onClick={() =>
                                handleQuickQuestion(
                                    "How do I spot phishing?"
                                )
                            }
                            className="border border-blue-400 text-blue-600 rounded-full px-3 py-1 text-xs"
                        >
                            How do I spot phishing?
                        </button>

                        <button
                            onClick={() =>
                                handleQuickQuestion(
                                    "Are QR codes dangerous?"
                                )
                            }
                            className="border border-blue-400 text-blue-600 rounded-full px-3 py-1 text-xs"
                        >
                            Are QR codes dangerous?
                        </button>

                        <button
                            onClick={() =>
                                handleQuickQuestion(
                                    "How to verify a URL?"
                                )
                            }
                            className="border border-blue-400 text-blue-600 rounded-full px-3 py-1 text-xs"
                        >
                            How to verify a URL?
                        </button>

                        <button
                            onClick={() =>
                                handleQuickQuestion(
                                    "Email scam red flags?"
                                )
                            }
                            className="border border-blue-400 text-blue-600 rounded-full px-3 py-1 text-xs"
                        >
                            Email scam red flags?
                        </button>

                    </div>

                    {/* Input Area */}
                    <div className="border-t p-3 flex items-center gap-2">

                        <input
                            type="text"
                            placeholder="Ask about scams, phishing..."
                            className="flex-1 border rounded-full px-4 py-2 outline-none"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && sendMessage()
                            }
                        />

                        <button
                            onClick={sendMessage}
                            className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center"
                        >
                            ➤
                        </button>

                    </div>
                </div>
            )}
        </>
    );
}

export default ChatBot;