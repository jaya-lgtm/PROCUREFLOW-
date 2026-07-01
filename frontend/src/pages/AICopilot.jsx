import React, { useState } from 'react';
import { useSimulatedDB } from '../context/SimulatedDBContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Bot, Send, User, ChevronRight, HelpCircle,
  AlertTriangle, ShieldCheck, TrendingUp, Cpu
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const AICopilot = () => {
  const { vendors, materials, pos, invoices, payments } = useSimulatedDB();

  // Chat conversation state
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I am your ProcureFlow S/4 Procurement AI assistant. Ask me questions about vendor ratings, open invoices, inventory risks, or spend forecasts.',
      time: 'Just now',
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sampleQuestions = [
    'Which vendor has best performance?',
    'Which materials need reorder?',
    'Predict next month\'s spend.',
    'Identify procurement risks.',
  ];

  // Logic to process chatbot queries
  const handleQuery = (queryText) => {
    if (!queryText.trim()) return;

    // User Message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: queryText,
      time: 'Just now',
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let response = { id: Date.now() + 1, sender: 'ai', time: 'Just now' };

      const cleanQuery = queryText.toLowerCase();

      if (cleanQuery.includes('vendor') || cleanQuery.includes('performance') || cleanQuery.includes('supplier')) {
        // Find best vendor
        const best = [...vendors].sort((a, b) => b.rating - a.rating)[0];
        response.text = `Based on performance scorecards, **${best.vendorName}** is our top-performing supplier. Here is the comparative checklist:`;
        response.table = {
          headers: ['Vendor', 'Rating', 'On-Time Del.%', 'Quality%'],
          rows: vendors.map(v => [v.vendorName, `★ ${v.rating.toFixed(1)}`, `${v.performanceMetrics.onTimeDelivery}%`, `${v.performanceMetrics.qualityScore}%`]),
        };
      } else if (cleanQuery.includes('reorder') || cleanQuery.includes('stock') || cleanQuery.includes('inventory')) {
        // Find low stock
        const low = materials.filter(m => m.currentStock <= m.reorderPoint);
        if (low.length > 0) {
          response.text = `I have detected **${low.length} materials** that have breached their reorder thresholds and require replenishment POs:`;
          response.table = {
            headers: ['Code', 'Material Name', 'Current Stock', 'Min Req'],
            rows: low.map(m => [m.materialId, m.materialName, `${m.currentStock} ${m.unitOfMeasure}`, `${m.reorderPoint} ${m.unitOfMeasure}`]),
          };
        } else {
          response.text = 'Excellent news: all materials currently exceed reorder thresholds. No immediate purchasing action is required.';
        }
      } else if (cleanQuery.includes('predict') || cleanQuery.includes('spend') || cleanQuery.includes('forecast')) {
        // Spend forecast
        response.text = 'Predicting spend based on historical purchasing orders and inventory replenishment lead times. We forecast a **$98,000 spend** next month, mostly driven by ROH steel plate orders:';
        response.chart = [
          { month: 'Apr (Actual)', spend: 63000 },
          { month: 'May (Actual)', spend: 71000 },
          { month: 'Jun (Actual)', spend: 82000 },
          { month: 'Jul (Forecast)', spend: 98000 },
        ];
      } else if (cleanQuery.includes('risk') || cleanQuery.includes('delay') || cleanQuery.includes('mismatch')) {
        // Procurement Risks
        const blockedCount = invoices.filter(i => i.status === 'Blocked').length;
        response.text = `I have identified **2 critical procurement risks** requiring buyer attention:\n\n1. **Lead Time Slippage**: Matrix Metals (VND-2003) average lead times increased from 7 to 9 days.\n2. **Blocked Accounts Payable**: ${blockedCount} vendor invoice currently blocked due to price discrepancies.`;
        response.alert = 'Matrix Metals raw steel plates orders have a 12% probability of stock-out if safety stock is not raised to 25 units.';
      } else {
        response.text = "I'm sorry, I couldn't query that statement directly. You can ask me to: 'Which vendor has best performance?', 'Which materials need reorder?', 'Predict next month\\'s spend.', or 'Identify procurement risks.'";
      }

      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch min-h-[75vh]">
      {/* Left Column: AI Spend Insights and Risk Panels (Purple Glassmorphic Cards) */}
      <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
        {/* Core AI Insights Dashboard */}
        <div className="purple-glass purple-glow p-5 rounded-xl border border-purple-500/30 flex-1 flex flex-col justify-between">
          <div className="flex items-center gap-3 text-purple-300">
            <Cpu className="text-purple-400" size={20} />
            <h3 className="text-sm font-black uppercase tracking-wider">AI RECOMMENDATIONS ENGINE</h3>
          </div>

          <div className="mt-6 space-y-4">
            <div className="purple-glass-card p-4 rounded-xl space-y-1">
              <span className="text-purple-300 text-[10px] font-bold uppercase tracking-wider block">Vendor Optimal Routing</span>
              <p className="text-xs text-slate-200 leading-normal font-semibold">
                Apex Industrial Supplies offers <strong>12% lower cost</strong> than Matrix Metals with <strong>96% on-time delivery</strong>. Recommend updating default purchase routes.
              </p>
            </div>

            <div className="purple-glass-card p-4 rounded-xl space-y-1">
              <span className="text-purple-300 text-[10px] font-bold uppercase tracking-wider block">Spend Anomaly Alert</span>
              <p className="text-xs text-slate-200 leading-normal font-semibold">
                IT & Engineering Department spend rose by <strong>18%</strong> this month. Anomalous activity detected in raw spool requisitions.
              </p>
            </div>

            <div className="purple-glass-card p-4 rounded-xl space-y-1">
              <span className="text-purple-300 text-[10px] font-bold uppercase tracking-wider block">Inventory Replenishment Forecast</span>
              <p className="text-xs text-slate-200 leading-normal font-semibold">
                Industrial Gas Valves (MAT-1003) will deplete safety stock in <strong>6 days</strong>. Lead time is 10 days. Recommend issuing PO immediately.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-purple-500/20 text-[10px] text-purple-400 font-bold flex items-center justify-between mt-6">
            <span>Model Version: ProcureLLM-v4.1</span>
            <span>Accuracy: 97.4%</span>
          </div>
        </div>
      </div>

      {/* Right Column: AI Assistant Chat Interface */}
      <div className="lg:col-span-3 bg-slate-900 border border-purple-500/20 rounded-xl shadow-2xl flex flex-col justify-between overflow-hidden purple-glow min-h-[500px]">
        {/* Chat Header */}
        <div className="p-4 border-b border-purple-500/20 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-purple-650 rounded-lg flex items-center justify-center text-purple-200 font-bold">
              <Bot size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">ProcureFlow Copilot Agent</span>
              <span className="text-[10px] text-purple-400 block font-medium">LLM Active • Cognitive Reasoning</span>
            </div>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-6 h-6 rounded bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0 text-xs">
                  <Bot size={13} />
                </div>
              )}
              <div className="max-w-[85%] space-y-2">
                <div className={`p-3 rounded-lg text-xs leading-relaxed font-medium ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-none shadow shadow-purple-600/10'
                    : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50'
                }`}>
                  {msg.text}
                </div>

                {/* Inline answers tables */}
                {msg.table && (
                  <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-950 text-[10px] text-slate-350">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-850 text-slate-400 border-b border-slate-700">
                          {msg.table.headers.map((h, i) => <th key={i} className="p-2 font-bold">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {msg.table.rows.map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => <td key={j} className="p-2 font-semibold">{cell}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Inline answers charts */}
                {msg.chart && (
                  <div className="h-32 bg-slate-950 p-2 border border-slate-750 rounded-lg">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={msg.chart} barSize={16}>
                        <XAxis dataKey="month" stroke="#7C3AED" fontSize={9} tickLine={false} />
                        <YAxis stroke="#7C3AED" fontSize={9} tickLine={false} />
                        <Tooltip contentStyle={{ fontSize: '9px', background: '#090D16', borderColor: '#7C3AED' }} />
                        <Bar dataKey="spend" fill="#8B5CF6" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Inline risk alert panels */}
                {msg.alert && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 text-[10px] font-bold rounded-lg flex items-center gap-2">
                    <AlertTriangle size={14} className="flex-shrink-0" />
                    <span>{msg.alert}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0 text-xs">
                <Bot size={13} />
              </div>
              <div className="bg-slate-800 border border-slate-700/50 p-3 rounded-lg text-xs text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Chat Actions & Input */}
        <div className="p-4 border-t border-purple-500/20 bg-slate-950 space-y-3 print:hidden">
          {/* Sample quick questions prompts */}
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuery(q)}
                className="text-[10px] font-bold text-purple-400 hover:text-purple-300 px-2.5 py-1 border border-purple-500/25 bg-purple-500/5 hover:bg-purple-500/10 rounded-full transition cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); handleQuery(input); }}
            className="flex items-center bg-slate-850 border border-slate-700/60 rounded-xl px-3 py-1.5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask copilot to run calculations, risk logs, or forecasts..."
              className="w-full bg-transparent border-0 outline-none text-xs text-white placeholder-slate-500"
            />
            <button
              type="submit"
              className="p-1.5 bg-purple-600 hover:bg-purple-750 text-white rounded-lg transition shadow-md cursor-pointer"
            >
              <Send size={12} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AICopilot;
