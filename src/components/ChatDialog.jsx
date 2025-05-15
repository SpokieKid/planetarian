import React, { useState, useEffect, useRef } from 'react';
import './ChatDialog.css';

// Nounii System Prompt REMOVED FROM HERE
// const NOUNII_SYSTEM_PROMPT = ...;

const ChatDialog = ({ onClose }) => {
    // Keep existing state
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hello Planetarian! How can I help you today?', sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const [isSending, setIsSending] = useState(false);
    // hasSentSystemPrompt ref REMOVED FROM HERE
    // const hasSentSystemPrompt = useRef(false);

    // Effect to send the system prompt REMOVED FROM HERE
    // useEffect(() => { ... }, []);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    // handleSendMessage function remains the same as before
    const handleSendMessage = async () => {
        const trimmedInput = inputValue.trim();
        if (trimmedInput !== '' && !isSending) {
            setIsSending(true);
            const newMessage = {
                id: messages.length + 1,
                text: trimmedInput,
                sender: 'user'
            };
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setInputValue('');

            const apiUrl = 'http://127.0.0.1:11434/v1/chat/completions';
            // NOTE: This request *doesn't* automatically include the system prompt unless your backend handles conversation history.
            // If the backend is stateless per request, you might need to include the system prompt + user message history here.
            // For now, assuming the backend service manages the context after the initial priming.
            const requestBody = {
                model: "gemma3:12b",
                messages: [
                    // TODO: Consider sending conversation history if needed by the backend
                    { role: "user", content: trimmedInput }
                ]
            };

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!response.ok) {
                    const errorText = response.statusText || `status: ${response.status}`;
                    throw new Error(`HTTP error! ${errorText}`);
                }

                const data = await response.json();
                console.log('Success:', data);

                let botReplyContent = data.choices?.[0]?.message?.content;

                if (botReplyContent) {
                    const thinkTagEnd = '</think>';
                    const thinkTagEndIndex = botReplyContent.indexOf(thinkTagEnd);
                    if (thinkTagEndIndex !== -1) {
                        botReplyContent = botReplyContent.substring(thinkTagEndIndex + thinkTagEnd.length);
                    } 
                    botReplyContent = botReplyContent.trim(); 
                }

                if (botReplyContent) {
                    setMessages(prevMessages => {
                        const botMessage = {
                             id: prevMessages.length + 1, 
                             text: botReplyContent, 
                             sender: 'bot'
                         };
                         return [...prevMessages, botMessage];
                    });
                } else {
                    const originalContent = data.choices?.[0]?.message?.content;
                    if (originalContent) {
                        console.warn('Bot response content was fully contained within <think> tags and removed.');
                        setMessages(prevMessages => {
                            const warnMessage = {
                                id: prevMessages.length + 1,
                                text: "(Bot thought process hidden)",
                                sender: 'bot'
                            };
                            return [...prevMessages, warnMessage];
                        });
                    } else {
                        console.warn('Bot response content not found in expected location:', data);
                        setMessages(prevMessages => {
                            const warnMessage = {
                                id: prevMessages.length + 1,
                                text: "Received response, but couldn't find message content.",
                                sender: 'bot'
                            };
                            return [...prevMessages, warnMessage];
                        });
                    }
                }

            } catch (error) {
                console.error('Error sending message:', error);
                const errorMessage = {
                     id: -1,  
                     text: `Error: ${error.message}. Please check the service and try again.`,
                     sender: 'bot'
                 };
                 setMessages(prevMessages => {
                     const errorMsgWithCorrectId = {...errorMessage, id: prevMessages.length + 1};
                     return [...prevMessages, errorMsgWithCorrectId];
                 });
            } finally {
                 setIsSending(false);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !isSending) { 
            handleSendMessage();
        }
    };

    // Rest of the component (return statement) remains the same
    return (
        <div className="chat-dialog-container">
            <div className="chat-dialog">
                <div className="chat-dialog-header">
                    <span>Chat with Nounii</span> 
                    <button onClick={onClose} className="chat-dialog-close-btn" disabled={isSending}>&times;</button>
                </div>
                <div className="chat-dialog-messages">
                    {messages.map((message) => (
                        <div key={message.id} className={`message ${message.sender}`}>
                            {typeof message.text === 'string' && message.text.includes('\n') 
                                ? message.text.split('\n').map((line, index) => (
                                    <React.Fragment key={index}>{line}<br/></React.Fragment>
                                ))
                                : message.text}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chat-dialog-input-area">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder={isSending ? "Sending..." : "Type your message..."}
                        disabled={isSending} 
                    />
                    <button onClick={handleSendMessage} disabled={isSending}>
                        {isSending ? "..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatDialog; 