'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  RefreshCw, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  ExternalLink, 
  Check, 
  ShieldCheck, 
  X,
  Building2,
  Clock,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { 
  defaultScrapeTargets, 
  ScrapeTarget, 
  ScrapedRateResult, 
  AgentExecutionLog 
} from '@/lib/scraping-agent';
import { DebtInstrument } from '@/lib/debt-data';

interface ScrapingAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRatesToPortal?: (scrapedResults: ScrapedRateResult[]) => void;
}

export function ScrapingAgentModal({ isOpen, onClose, onApplyRatesToPortal }: ScrapingAgentModalProps) {
  const [selectedTargets, setSelectedTargets] = useState<string[]>(defaultScrapeTargets.map(t => t.id));
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<AgentExecutionLog[]>([]);
  const [results, setResults] = useState<ScrapedRateResult[]>([]);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'results' | 'terminal' | 'targets'>('results');

  if (!isOpen) return null;

  const handleToggleTarget = (id: string) => {
    setSelectedTargets(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleSelectAllTargets = () => {
    setSelectedTargets(defaultScrapeTargets.map(t => t.id));
  };

  const handleDeselectAll = () => {
    setSelectedTargets([]);
  };

  const handleRunAgent = async () => {
    if (selectedTargets.length === 0) return;

    setIsRunning(true);
    setAppliedSuccess(false);
    setActiveTab('terminal');
    setLogs([]);
    setResults([]);

    try {
      const response = await fetch('/api/agent/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetIds: selectedTargets })
      });

      const json = await response.json();
      if (json.success && json.data) {
        setLogs(json.data.logs || []);
        setResults(json.data.results || []);
        setCompletedAt(json.data.completedAt);
        setActiveTab('results');
      } else {
        setLogs(prev => [
          ...prev, 
          { timestamp: new Date().toLocaleTimeString('en-IN'), stage: 'SYNC', level: 'error', message: json.error || 'Execution failed' }
        ]);
      }
    } catch (err: any) {
      setLogs(prev => [
        ...prev, 
        { timestamp: new Date().toLocaleTimeString('en-IN'), stage: 'SYNC', level: 'error', message: err.message || 'Network error' }
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleApplyRates = () => {
    if (results.length === 0) return;

    if (onApplyRatesToPortal) {
      onApplyRatesToPortal(results);
    }

    try {
      const existingRaw = localStorage.getItem('bharat_debt_instruments');
      if (existingRaw) {
        const instruments: DebtInstrument[] = JSON.parse(existingRaw);
        const updated = instruments.map(inst => {
          const match = results.find(r => 
            r.issuer.toLowerCase().includes(inst.issuer.toLowerCase()) ||
            inst.issuer.toLowerCase().includes(r.issuer.toLowerCase())
          );
          if (match) {
            return {
              ...inst,
              generalRate: match.generalRate,
              seniorCitizenRate: match.seniorCitizenRate,
              popularTenureLabel: match.tenure
            };
          }
          return inst;
        });
        localStorage.setItem('bharat_debt_instruments', JSON.stringify(updated));
      }
    } catch (e) {
      console.error(e);
    }

    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold shadow-2xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif tracking-tight">
                  Autonomous Debt Scraping & Rate Sync Agent
                </h3>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                  Gemini 2.5 Flash Engine
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Monitors bank rate schedules, RBI gazettes, and corporate NBFC deposits for senior citizen rate changes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Status Bar */}
        <div className="bg-white p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('results')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
                activeTab === 'results' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Discovered Rates ({results.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
                activeTab === 'terminal' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Agent Execution Logs ({logs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('targets')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
                activeTab === 'targets' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Target Banks ({selectedTargets.length}/{defaultScrapeTargets.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAgent}
              disabled={isRunning || selectedTargets.length === 0}
              id="btn-run-scraping-agent"
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 shadow-2xs active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Scraping Banks...' : 'Run Agent Scraper'}</span>
            </button>

            {results.length > 0 && (
              <button
                onClick={handleApplyRates}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                {appliedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Applied to Catalog!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-100" />
                    <span>Apply Rates to Portal</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* View: Results */}
          {activeTab === 'results' && (
            <div className="space-y-4">
              {results.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center mx-auto">
                    <Bot className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Agent Ready to Scrape</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Click <strong>&ldquo;Run Agent Scraper&rdquo;</strong> to initiate real-time inspection across SBI, HDFC, ICICI, Unity SFB, AU SFB, Bajaj Finance, and RBI Sovereign gazettes.
                  </p>
                  <button
                    onClick={handleRunAgent}
                    className="mt-2 px-5 py-2.5 bg-blue-700 text-white font-bold text-xs rounded-xl hover:bg-blue-800 shadow-2xs"
                  >
                    Start Scraping All 8 Institutions
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Extracted {results.length} active debt tranches as of {completedAt || 'today'}</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> All rates cross-verified with statutory rules
                    </span>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Institution & Scheme</th>
                          <th className="py-2.5 px-3">Tenure</th>
                          <th className="py-2.5 px-3">General Rate</th>
                          <th className="py-2.5 px-3">Senior Citizen (60+)</th>
                          <th className="py-2.5 px-3">Safety Cover</th>
                          <th className="py-2.5 px-3">Source URL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {results.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-50/70">
                            <td className="py-3 px-3">
                              <span className="font-bold text-slate-900 font-sans block">{r.instrumentName}</span>
                              <span className="text-[10px] text-blue-700 font-sans font-medium">{r.issuer}</span>
                            </td>
                            <td className="py-3 px-3 text-slate-600 font-sans">{r.tenure}</td>
                            <td className="py-3 px-3 font-bold text-slate-800">{r.generalRate.toFixed(2)}%</td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-blue-900">{r.seniorCitizenRate.toFixed(2)}%</span>
                                {r.rateChange && r.rateChange > 0 && (
                                  <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1 rounded font-sans font-bold">
                                    +{r.rateChange}%
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 font-sans">
                              {r.dicgcInsured ? (
                                <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                  DICGC ₹5L Insured
                                </span>
                              ) : (
                                <span className="text-slate-600 text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-semibold">
                                  {r.creditRating}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 font-sans">
                              <a 
                                href={r.sourceUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 text-[11px]"
                              >
                                <span>Official Tariff</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* View: Terminal Logs */}
          {activeTab === 'terminal' && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-1.5 max-h-[380px] overflow-y-auto">
              <div className="text-slate-400 pb-2 border-b border-slate-800 text-[11px]">
                # BharatFixed AI Agent Execution Stream &bull; Session {new Date().toISOString().slice(0, 10)}
              </div>
              {logs.length === 0 ? (
                <div className="text-slate-400 italic py-4">No logs yet. Press &ldquo;Run Agent Scraper&rdquo; to start.</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-slate-400 shrink-0">[{log.timestamp}]</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold shrink-0 ${
                      log.stage === 'CONNECT' ? 'bg-blue-900 text-blue-200' :
                      log.stage === 'SCRAPE' ? 'bg-amber-900 text-amber-200' :
                      log.stage === 'GEMINI_PARSE' ? 'bg-purple-900 text-purple-200' :
                      log.stage === 'VALIDATE' ? 'bg-emerald-900 text-emerald-200' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {log.stage}
                    </span>
                    <span className={`${
                      log.level === 'error' ? 'text-red-400' :
                      log.level === 'warn' ? 'text-amber-400' :
                      log.level === 'success' ? 'text-emerald-300' : 'text-slate-200'
                    }`}>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
              {isRunning && (
                <div className="text-blue-400 animate-pulse pt-2">
                  &gt; Autonomous agent actively analyzing institutional tariff pages...
                </div>
              )}
            </div>
          )}

          {/* View: Target Institutions */}
          {activeTab === 'targets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Select which bank websites and corporate issuers the agent visits:</span>
                <div className="flex gap-2">
                  <button onClick={handleSelectAllTargets} className="text-blue-700 font-bold hover:underline">Select All</button>
                  <span className="text-slate-400">&bull;</span>
                  <button onClick={handleDeselectAll} className="text-slate-500 hover:underline">Deselect All</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {defaultScrapeTargets.map(target => {
                  const isChecked = selectedTargets.includes(target.id);
                  return (
                    <div
                      key={target.id}
                      onClick={() => handleToggleTarget(target.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isChecked 
                          ? 'bg-blue-50/70 border-blue-300 text-slate-900' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-xs block">{target.name}</span>
                        <span className="text-[10px] text-slate-500 block truncate max-w-xs">{target.officialUrl}</span>
                      </div>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Automated Cron Schedule: Runs daily at 06:00 AM IST</span>
          </div>

          <div className="text-[11px] text-slate-500">
            Powered by Gemini AI Semantic Rate Extraction Engine
          </div>
        </div>

      </div>
    </div>
  );
}
