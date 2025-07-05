"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Bot, User } from 'lucide-react';
import { Button } from '../ui/button';

const messages = [
  { from: 'user', text: 'Nerida, analyze Q3 sales data and identify top-performing regions.' },
  { from: 'bot', text: 'Analyzing Q3 sales data now...' },
  { from: 'bot', text: 'Analysis complete. The Northeast region shows a 25% increase in sales, driven by the new product line. The West coast is flat. Would you like a detailed report?' },
  { from: 'user', text: 'Yes, generate a report and schedule a meeting with the regional heads for tomorrow at 10 AM.' },
  { from: 'bot', text: 'Report generated. I\'ve scheduled "Q3 Sales Review" with all regional heads for tomorrow at 10 AM and attached the report to the invite.' }
];

function ChatMessage({ message }: { message: { from: 'user' | 'bot'; text: string } }) {
  if (!message) {
    return null;
  }
  const isBot = message.from === 'bot';
  return (
    <div className={cn("flex items-start gap-3", isBot ? "" : "justify-end")}>
      {isBot && (
        <Avatar className="w-8 h-8 border">
          <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
        </Avatar>
      )}
      <div className={cn("max-w-[70%] rounded-xl px-4 py-2.5", isBot ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground")}>
        <p className="text-sm">{message.text}</p>
      </div>
      {!isBot && (
        <Avatar className="w-8 h-8 border">
          <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

export function NeridaBrain() {
  const [displayedMessages, setDisplayedMessages] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const runSimulation = () => {
    setDisplayedMessages([]);
    setIsSimulating(true);
    let currentMessageIndex = 0;

    const addMessage = () => {
      if (currentMessageIndex < messages.length) {
        setDisplayedMessages(prev => [...prev, messages[currentMessageIndex]]);
        currentMessageIndex++;
        setTimeout(addMessage, messages[currentMessageIndex-1].from === 'bot' ? 1500 : 800);
      } else {
        setIsSimulating(false);
      }
    };

    addMessage();
  };

  useEffect(() => {
    runSimulation();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [displayedMessages]);

  return (
    <section id="features" className="py-20 md:py-28">
      <div className="container max-w-7xl grid md:grid-cols-2 gap-12 items-center">
        <div className="md:pr-8">
          <span className="text-primary font-semibold">Nerida Brain</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">The Neural Core of Nerida</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Nerida Brain is our core intelligent engine that powers real-time interaction, task execution, and semantic understanding. It's designed to be your business's central nervous system.
          </p>
          <ul className="mt-6 space-y-4">
            {[
              'Autonomous Task Execution',
              'Multi-agent Collaboration',
              'Context-Aware Reasoning',
              'Proactive Intelligence',
              'Smart Scheduling',
              'Enterprise-Grade Security'
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Card className="h-[450px] flex flex-col shadow-2xl shadow-primary/10">
            <CardContent className="flex-1 p-4 flex flex-col">
              <div ref={chatContainerRef} className="flex-1 space-y-4 overflow-y-auto pr-2">
                {displayedMessages.map((msg, index) => (
                  <ChatMessage key={index} message={msg} />
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <Button onClick={runSimulation} disabled={isSimulating} variant="outline" size="sm">
                  {isSimulating ? 'Simulation in progress...' : 'Re-run Simulation'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
