"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Command,
  ArrowRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

type Message = {
  role: "user" | "system";
  content: string;
};

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "system", 
      content: "Hello. I am the Operon Executive Agent. I can explain any trend, policy citation, or simulation result. How can I help you today?" 
    }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Simulating system response
    setTimeout(() => {
      const systemMsg: Message = { 
        role: "system", 
        content: "Based on the Data Analyst's findings, demand is increasing due to a 24% surge in Northern region orders over the last 30 days. The Policy Guardian confirms this aligns with expansion policy 4.1." 
      };
      setMessages(prev => [...prev, systemMsg]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto border border-black/5 bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-black/5 flex items-center justify-between bg-[#F9F9F9]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold">Executive Intelligence</p>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[10px] uppercase font-bold text-black/40 tracking-widest">Active Orchestrator</p>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="border-black/10">GROQ Llama 3.3</Badge>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6 space-y-6">
        <div className="space-y-6 pb-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-4 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user" ? "bg-black/5" : "bg-black text-white"
                  }`}>
                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-black text-white rounded-tr-none" 
                      : "bg-[#F9F9F9] border border-black/5 text-black rounded-tl-none"
                  }`}>
                    {msg.content}
                    {msg.role === "system" && i > 0 && (
                      <div className="mt-4 pt-4 border-t border-black/5 flex items-center gap-2">
                        <Button variant="ghost" className="h-7 text-[10px] uppercase font-bold px-2 hover:bg-black/5">
                          View Citations
                        </Button>
                        <Button variant="ghost" className="h-7 text-[10px] uppercase font-bold px-2 hover:bg-black/5">
                          Show Math
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-black/5">
        <div className="relative">
          <Command className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask why demand is increasing or query a policy..." 
            className="pl-12 pr-12 h-14 bg-[#F9F9F9] border-black/5 rounded-xl focus-visible:ring-black"
          />
          <button 
            onClick={handleSend}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-lg flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-[10px] text-center text-black/40 mt-3 uppercase font-bold tracking-widest">
          Operon uses verifiable CoT to prevent hallucinations
        </p>
      </div>
    </div>
  );
}
