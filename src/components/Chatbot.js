import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        // Add user message
        const userMessage = {
            text: inputMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');

        // Simulate bot response
        setTimeout(() => {
            const botResponse = getBotResponse(inputMessage);
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    const getBotResponse = (message) => {
        const lowerMessage = message.toLowerCase();
        
        // Common questions and responses
        const responses = {
            'hello': 'Hello! How can I help you today?',
            'hi': 'Hi there! How can I assist you?',
            'help': 'I can help you with:\n- Creating and managing invoices\n- Adding and editing customers\n- Generating reports\n- Understanding the dashboard\nWhat would you like to know more about?',
            'invoice': 'To create an invoice:\n1. Go to the Invoices section\n2. Click "Create New Invoice"\n3. Fill in the customer details\n4. Add items and quantities\n5. Save the invoice',
            'customer': 'To add a customer:\n1. Go to the Customers section\n2. Click "Add New Customer"\n3. Fill in the customer details\n4. Save the information',
            'report': 'To view reports:\n1. Go to the Reports section\n2. Select the type of report\n3. Choose the date range\n4. View or download the report',
            'dashboard': 'The dashboard shows:\n- Recent invoices\n- Customer overview\n- Financial summaries\n- Quick actions for common tasks',
            'default': 'I\'m not sure I understand. Could you please rephrase your question? You can ask about:\n- Invoices\n- Customers\n- Reports\n- Dashboard features'
        };

        // Check for keywords in the message
        for (const [key, value] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return {
                    text: value,
                    sender: 'bot',
                    timestamp: new Date().toLocaleTimeString()
                };
            }
        }

        return {
            text: responses.default,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString()
        };
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-4 right-4 p-4 rounded-full shadow-lg transition-all duration-300 ${
                    isOpen ? 'bg-red-500' : 'bg-blue-500'
                }`}
            >
                {isOpen ? <FaTimes className="text-white text-xl" /> : <FaRobot className="text-white text-xl" />}
            </button>

            {/* Chat Interface */}
            {isOpen && (
                <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col">
                    {/* Chat Header */}
                    <div className="bg-blue-500 text-white p-3 rounded-t-lg flex justify-between items-center">
                        <div className="flex items-center">
                            <FaRobot className="mr-2" />
                            <span>Invoice Assistant</span>
                        </div>
                        <button onClick={() => setIsOpen(false)}>
                            <FaTimes />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`mb-4 ${
                                    message.sender === 'user' ? 'text-right' : 'text-left'
                                }`}
                            >
                                <div
                                    className={`inline-block p-2 rounded-lg ${
                                        message.sender === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-800'
                                    }`}
                                >
                                    <div className="text-sm whitespace-pre-line">{message.text}</div>
                                    <div className="text-xs mt-1 opacity-70">{message.timestamp}</div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t">
                        <div className="flex">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
                            >
                                <FaPaperPlane />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot; 