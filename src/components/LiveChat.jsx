import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello! I am MediBot, your virtual assistant. How can I help you today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const botResponses = (input) => {
    const text = input.toLowerCase();
    
    if (text.includes('prescription') || text.includes('schedule h') || text.includes('schedule h1') || text.includes('upload')) {
      return 'Under Indian law, Schedule H & H1 medicines require a valid doctor prescription. You can upload it during checkout or in the "Upload Prescription" link in the navigation bar. Our pharmacist will review it within 30 minutes!';
    }
    if (text.includes('cough') || text.includes('cold') || text.includes('fever')) {
      return 'For dry cough, we suggest Benadryl or Ascoril. For fever or minor body ache, Crocin Pain Relief or Crocin 650 (Paracetamol) are good OTC options. Please consult a doctor if symptoms persist!';
    }
    if (text.includes('diabetes') || text.includes('sugar') || text.includes('insulin')) {
      return 'We offer Glucophage (Metformin) and insulins for blood glucose management. Note: These are Schedule H medicines and require a valid prescription upload.';
    }
    if (text.includes('shipping') || text.includes('delivery') || text.includes('charge')) {
      return 'We offer FREE delivery for orders above Rs. 500! For orders under Rs. 500, a standard shipping fee of Rs. 40 is charged. Delivery takes 1-2 business days.';
    }
    if (text.includes('payment') || text.includes('upi') || text.includes('card')) {
      return 'We accept all major Credit/Debit Cards, Net Banking, and popular UPI payments (Google Pay, PhonePe, Paytm), as well as Cash on Delivery (COD).';
    }
    if (text.includes('refund') || text.includes('return') || text.includes('cancel')) {
      return 'Medicines can be returned within 10 days of delivery if they are unopened and undamaged. Refunds are processed back to the original payment mode within 5 working days.';
    }
    if (text.includes('contact') || text.includes('phone') || text.includes('address')) {
      return 'You can call us at +91-120-445566 or email support@medicare.com. We are located at 12 Health Plaza, Sector 62, Noida.';
    }
    
    return "I am sorry, I didn't quite catch that. Could you ask about prescriptions, cough/cold, shipping charges, payments, or how to contact our support?";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    
    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponses(currentInput),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-emerald-500 animate-pulse-soft"
          aria-label="Open Live Chat"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[450px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-4 text-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot size={22} className="text-white" />
              <div>
                <h4 className="font-semibold text-sm">MediCare Assistant</h4>
                <p className="text-[10px] text-emerald-100 flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block mr-1.5 animate-pulse"></span> Online Support
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2 ${
                  msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white ${
                    msg.sender === 'user' 
                      ? 'bg-emerald-600' 
                      : 'bg-slate-600'
                  }`}
                >
                  {msg.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                </div>

                <div
                  className={`p-3 rounded-2xl text-xs max-w-[75%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[9px] block text-right mt-1 opacity-70">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-white">
                  <Bot size={12} />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl rounded-tl-none text-xs text-slate-500">
                  <span className="flex space-x-1 items-center py-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex space-x-2 items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about prescription, cold/cough, etc..."
              className="flex-grow text-xs bg-slate-100 dark:bg-slate-800 text-slate-850 dark:text-slate-100 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 border-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`p-2.5 rounded-xl text-white ${
                inputText.trim() 
                  ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer' 
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              } transition-colors`}
            >
              <Send size={16} />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
