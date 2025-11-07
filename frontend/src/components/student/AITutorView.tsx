import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Topic } from '../../types';
import { getAITutorResponse } from '../../services/api';
import Button from '../shared/Button';
import { SparklesIcon, UserIcon } from '../icons/Icons';
import LoadingSpinner from '../shared/LoadingSpinner';

interface AITutorViewProps {
    topics: Topic[];
}

const AITutorView: React.FC<AITutorViewProps> = ({ topics }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', content: "Hi! I'm your AI Tutor. How can I help you with your React course today? You can ask me about concepts like 'props', 'state', or 'hooks'." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const responseContent = await getAITutorResponse([...messages, userMessage]);
            const modelMessage: ChatMessage = { role: 'model', content: responseContent };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { role: 'model', content: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg flex flex-col h-[75vh]">
            <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
                <SparklesIcon className="w-6 h-6 mr-3 text-amber-400" />
                AI Tutor
            </h2>
            
            <div className="flex-grow overflow-y-auto pr-4 space-y-4 mb-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && (
                             <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                                <SparklesIcon className="w-5 h-5 text-white" />
                            </div>
                        )}
                        <div className={`max-w-md lg:max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-purple-700 text-white' : 'bg-gray-700 text-gray-200'}`}>
                           <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{msg.content}</pre>
                        </div>
                         {msg.role === 'user' && (
                             <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                                <UserIcon className="w-5 h-5 text-white" />
                            </div>
                        )}
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                            <SparklesIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="max-w-md lg:max-w-lg p-3 rounded-lg bg-gray-700 text-gray-200">
                           <LoadingSpinner text="Thinking..."/>
                        </div>
                    </div>
                 )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="mt-auto flex gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about a topic..."
                    className="flex-grow p-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                    Send
                </Button>
            </form>
        </div>
    );
};

export default AITutorView;
