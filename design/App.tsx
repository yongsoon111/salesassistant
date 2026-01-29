
import React, { useState, useEffect, useRef } from 'react';
import { ViewType, Script, Resource, Customer, StrategicGoal } from './types';
import { INITIAL_SCRIPTS, INITIAL_RESOURCES, SCENARIOS, DEFAULT_GOALS } from './constants';
import { generateSmartResponse } from './services/geminiService';

// --- UI 서브 컴포넌트 ---

const StatusBadge: React.FC<{ status: Customer['status'] }> = ({ status }) => {
  const styles = {
    VIP: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    Active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    Lead: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    Churned: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  };
  const labels = { VIP: 'VIP', Active: '활성', Lead: '잠재', Churned: '위험' };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const Toast: React.FC<{ message: string; show: boolean }> = ({ message, show }) => (
  <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-emerald-500 text-white rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all duration-500 z-[999] flex items-center gap-3 ${
    show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'
  }`}>
    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
    <span className="text-sm font-bold">{message}</span>
  </div>
);

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

// --- 메인 애플리케이션 ---

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('assistant');
  const [scripts, setScripts] = useState<Script[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [goals, setGoals] = useState<StrategicGoal[]>([]);
  
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [aiContext, setAiContext] = useState('');
  const [attachedImage, setAttachedImage] = useState<{file: File, preview: string} | null>(null);
  const [aiResult, setAiResult] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalLabel, setNewGoalLabel] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState({ message: '', show: false });

  useEffect(() => {
    const savedScripts = localStorage.getItem('crm_scripts');
    const savedCustomers = localStorage.getItem('crm_notion_data');
    const savedResources = localStorage.getItem('crm_resources');
    const savedGoals = localStorage.getItem('crm_strategic_goals');
    
    setScripts(savedScripts ? JSON.parse(savedScripts) : INITIAL_SCRIPTS);
    setCustomers(savedCustomers ? JSON.parse(savedCustomers) : [
      { id: 'c1', name: '김철수 본부장', status: 'VIP', notes: '기술적 디테일 중시, 의사결정권 높음', purchaseHistory: 'Enterprise', lastContact: '2024-03-24' },
      { id: 'c2', name: '이영희 매니저', status: 'Active', notes: '예산 집행 실무자, 빠른 피드백 선호', purchaseHistory: 'Pro', lastContact: '2024-03-25' }
    ]);
    setResources(savedResources ? JSON.parse(savedResources) : INITIAL_RESOURCES);
    setGoals(savedGoals ? JSON.parse(savedGoals) : DEFAULT_GOALS);
  }, []);

  const saveGoals = (newGoals: StrategicGoal[]) => {
    setGoals(newGoals);
    localStorage.setItem('crm_strategic_goals', JSON.stringify(newGoals));
  };

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: '', show: false }), 2500);
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => showToast("복사되었습니다."));
  };

  const addCustomGoal = () => {
    if (!newGoalLabel.trim()) return;
    const newGoal: StrategicGoal = {
      id: `custom-${Date.now()}`,
      label: newGoalLabel,
      icon: '🎯',
      description: '사용자 정의 전략 목표',
      isCustom: true
    };
    saveGoals([...goals, newGoal]);
    setNewGoalLabel('');
    setIsAddingGoal(false);
    showToast("새로운 전략 목표가 추가되었습니다.");
  };

  const deleteGoal = (id: string) => {
    const filtered = goals.filter(g => g.id !== id);
    saveGoals(filtered);
    if (selectedGoalId === id) setSelectedGoalId('');
    showToast("목표가 삭제되었습니다.");
  };

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const selectedGoal = goals.find(g => g.id === selectedGoalId);

  const handleAiAsk = async () => {
    if (!selectedScenario || !selectedGoalId) {
      showToast("상황과 전략적 목표를 선택해주세요.");
      return;
    }
    setIsAiLoading(true);
    try {
      let imageData;
      if (attachedImage) {
        const base64 = await fileToBase64(attachedImage.file);
        imageData = { data: base64, mimeType: attachedImage.file.type };
      }
      const result = await generateSmartResponse(
        selectedCustomer || null, 
        selectedScenario, 
        selectedGoal?.label as any || '', 
        aiContext, 
        imageData
      );
      setAiResult(result);
    } catch (e) {
      showToast("분석 엔진 연결에 실패했습니다.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden text-slate-100">
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full"></div>
      </div>

      <aside className="w-24 lg:w-72 bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col z-10">
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg neon-border">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-xl font-extrabold tracking-tighter leading-none">FORCE CRM</h1>
            <p className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase mt-1">지능형 전략 엔진</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-10 space-y-4">
          {[
            { id: 'assistant', label: '응대 도우미', icon: '⚡' },
            { id: 'scripts', label: '스크립트 라이브러리', icon: '📄' },
            { id: 'resources', label: '자료 관리', icon: '📂' },
            { id: 'crm', label: '고객 관리', icon: '📋' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setView(item.id as ViewType)} 
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${view === item.id ? 'bg-white/10 text-emerald-400 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className="text-2xl group-hover:scale-125 transition-transform">{item.icon}</span>
              <span className="hidden lg:block font-bold text-sm tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <header className="h-24 flex items-center justify-between px-12 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-1 h-8 bg-emerald-500 rounded-full neon-border"></div>
            <h2 className="text-2xl font-black tracking-tight uppercase">
              {view === 'assistant' ? 'Strategy Assistant' : view === 'scripts' ? 'Script Library' : view === 'resources' ? 'Resource Vault' : 'Customer CRM'}
            </h2>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-right hidden md:block">
               <p className="text-[10px] font-black text-emerald-500 tracking-widest">SYSTEM STATUS</p>
               <p className="text-xs font-bold text-slate-400">NEURAL LINK STABLE</p>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold">JD</div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto custom-scrollbar p-12 pt-0">
          {view === 'assistant' && (
            <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-10">
              <div className="col-span-12 xl:col-span-8 space-y-8">
                <div className="glass-card p-10 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-emerald-400 uppercase tracking-widest px-1">대상 고객 (Target Character)</label>
                      <select 
                        value={selectedCustomerId} 
                        onChange={e => setSelectedCustomerId(e.target.value)} 
                        className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-slate-900">고객 프로필 선택...</option>
                        {customers.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-emerald-400 uppercase tracking-widest px-1">대화 상황 (Scenario Context)</label>
                      <select 
                        onChange={e => setSelectedScenario(e.target.value)} 
                        className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-slate-900">현재 대화 맥락...</option>
                        {SCENARIOS.map(sc => <option key={sc.id} value={sc.id} className="bg-slate-900">{sc.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">전략적 목표 및 단계 (Strategic Goals)</label>
                      <button 
                        onClick={() => setIsAddingGoal(true)}
                        className="text-[10px] font-black text-slate-400 hover:text-emerald-400 transition-colors uppercase"
                      >
                        + 목표 커스텀 추가
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {goals.map(goal => (
                        <div key={goal.id} className="relative group">
                          <button 
                            onClick={() => setSelectedGoalId(goal.id)}
                            className={`w-full flex flex-col items-center justify-center p-6 rounded-[1.5rem] border-2 transition-all duration-300 gap-3 ${selectedGoalId === goal.id ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-white/5 bg-white/2 hover:border-emerald-500/30'}`}
                          >
                            <span className={`text-3xl transition-transform group-hover:scale-110 ${selectedGoalId === goal.id ? 'scale-110' : 'grayscale group-hover:grayscale-0'}`}>{goal.icon}</span>
                            <span className={`text-[11px] font-black text-center tracking-tighter ${selectedGoalId === goal.id ? 'text-emerald-400' : 'text-slate-400'}`}>{goal.label}</span>
                          </button>
                          {goal.isCustom && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); deleteGoal(goal.id); }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      
                      {isAddingGoal && (
                        <div className="flex flex-col gap-2 p-2 glass-card border-emerald-500/50 animate-in zoom-in-95 duration-200">
                          <input 
                            autoFocus
                            placeholder="목표 이름..."
                            value={newGoalLabel}
                            onChange={e => setNewGoalLabel(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addCustomGoal()}
                            className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-emerald-500"
                          />
                          <div className="flex gap-2">
                            <button onClick={addCustomGoal} className="flex-1 py-2 bg-emerald-500 text-white text-[10px] font-black rounded-lg">추가</button>
                            <button onClick={() => setIsAddingGoal(false)} className="px-3 py-2 bg-white/5 text-slate-400 text-[10px] font-black rounded-lg">취소</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-5">
                    <label className="text-[11px] font-black text-emerald-400 uppercase tracking-widest px-1">추가 인텔리전스 (Text or Screenshot)</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()} 
                      className={`relative w-full h-40 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all group ${attachedImage ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:border-emerald-500/30 hover:bg-white/5'}`}
                    >
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => {
                        const file = e.target.files?.[0];
                        if(file) setAttachedImage({file, preview: URL.createObjectURL(file)});
                      }} />
                      {attachedImage ? (
                        <div className="relative">
                          <img src={attachedImage.preview} className="h-32 rounded-xl shadow-lg" alt="미리보기" />
                          <button onClick={(e) => { e.stopPropagation(); setAttachedImage(null); }} className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white rounded-full">✕</button>
                        </div>
                      ) : (
                        <div className="text-center opacity-40 group-hover:opacity-100 transition-opacity">
                          <p className="text-3xl mb-2">🖼️</p>
                          <p className="text-sm font-bold">대화 캡쳐본 또는 자료 드롭</p>
                        </div>
                      )}
                    </div>
                    <textarea 
                      value={aiContext} onChange={e => setAiContext(e.target.value)}
                      placeholder="상대방의 숨겨진 의도나 현재 대화의 온도를 설명해주세요..."
                      className="w-full h-32 px-6 py-5 bg-white/5 border border-white/10 rounded-3xl text-sm font-medium outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none shadow-inner"
                    />
                  </div>

                  <button 
                    onClick={handleAiAsk} disabled={isAiLoading}
                    className={`w-full py-6 rounded-3xl font-black text-xl transition-all relative overflow-hidden group ${isAiLoading ? 'bg-slate-800 text-slate-500' : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-xl neon-border'}`}
                  >
                    {isAiLoading ? (
                      <div className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        신경망 전략 도출 중...
                      </div>
                    ) : '전략적 응대 솔루션 생성'}
                  </button>
                </div>
              </div>

              <div className="col-span-12 xl:col-span-4 space-y-8">
                {aiResult ? (
                  <div className="glass-card p-10 bg-emerald-950/20 border-emerald-500/20 animate-in slide-in-from-right-5 duration-500 shadow-2xl">
                    <header className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">AI 인텔리전스 리포트</span>
                      </div>
                      <button onClick={() => copyToClipboard(aiResult)} className="text-xs font-bold text-slate-400 hover:text-white transition-colors">복사</button>
                    </header>
                    <div className="whitespace-pre-wrap leading-relaxed text-slate-200 text-sm font-medium custom-scrollbar overflow-y-auto max-h-[70vh] pr-2">
                      {aiResult}
                    </div>
                  </div>
                ) : (
                   <div className="glass-card p-10 flex flex-col items-center justify-center text-center opacity-30 h-full min-h-[400px]">
                      <div className="text-6xl mb-6">🧠</div>
                      <h4 className="text-lg font-bold mb-2">분석 대기 중</h4>
                      <p className="text-sm">고객 정보와 상황을 입력하고<br/>전략 버튼을 클릭하세요.</p>
                   </div>
                )}
              </div>
            </div>
          )}

          {view === 'scripts' && (
            <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-500">
              <header className="flex justify-between items-center">
                <h3 className="text-4xl font-black tracking-tight">마스터 스크립트 라이브러리</h3>
                <button className="h-14 px-8 bg-emerald-500 text-white rounded-2xl font-black hover:bg-emerald-400 transition-all shadow-lg neon-border">+ 새 스크립트</button>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {scripts.map(s => (
                  <div key={s.id} onClick={() => copyToClipboard(s.content)} className="glass-card p-8 hover:border-emerald-500/50 transition-all group cursor-pointer active:scale-95">
                    <span className="px-2 py-0.5 bg-white/5 text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-white/10 rounded-md">{s.category}</span>
                    <h4 className="text-xl font-bold mt-4 mb-3 group-hover:text-emerald-400 transition-colors">{s.title}</h4>
                    <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed font-medium">{s.content}</p>
                    <div className="mt-6 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-[10px] font-black text-slate-500">클릭하여 복사</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'resources' && (
            <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-500">
              <header className="flex justify-between items-center">
                <h3 className="text-4xl font-black tracking-tight">비즈니스 자산 관리</h3>
                <button className="h-14 px-8 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-500 transition-all shadow-lg">+ 자료 등록</button>
              </header>
              <div className="glass-card overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-10 py-6 font-black text-slate-500 uppercase text-[10px] tracking-widest">자료 명칭</th>
                      <th className="px-10 py-6 font-black text-slate-500 uppercase text-[10px] tracking-widest">유형</th>
                      <th className="px-10 py-6 font-black text-slate-500 uppercase text-[10px] tracking-widest">자료 설명</th>
                      <th className="px-10 py-6 font-black text-slate-500 uppercase text-[10px] tracking-widest text-right">액션</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {resources.map(r => (
                      <tr key={r.id} className="hover:bg-white/5 transition-all group">
                        <td className="px-10 py-8">
                          <span className="font-bold text-lg group-hover:text-emerald-400 transition-colors">{r.name}</span>
                        </td>
                        <td className="px-10 py-8">
                          <span className="px-2 py-1 bg-white/5 rounded-lg text-xs font-mono border border-white/5">{r.type}</span>
                        </td>
                        <td className="px-10 py-8 text-sm text-slate-400 font-medium">{r.description}</td>
                        <td className="px-10 py-8 text-right space-x-6">
                          <button onClick={() => copyToClipboard(r.url)} className="text-xs font-black text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-widest">링크 복사</button>
                          <button className="text-xs font-black text-slate-600 hover:text-rose-400 transition-colors uppercase tracking-widest">삭제</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {view === 'crm' && (
            <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-500">
              <header className="flex justify-between items-center">
                <h3 className="text-4xl font-black tracking-tight">고객 인텔리전스</h3>
                <button className="h-14 px-8 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-500 transition-all shadow-lg">+ 리드 추가</button>
              </header>
              <div className="glass-card overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-10 py-6 font-black text-slate-500 uppercase text-[10px] tracking-widest">고객 식별</th>
                      <th className="px-10 py-6 font-black text-slate-500 uppercase text-[10px] tracking-widest">참여도</th>
                      <th className="px-10 py-6 font-black text-slate-500 uppercase text-[10px] tracking-widest">인텔리전스 메모</th>
                      <th className="px-10 py-6 font-black text-slate-500 uppercase text-[10px] tracking-widest">최종 분석</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {customers.map(c => (
                      <tr key={c.id} className="hover:bg-white/5 transition-all cursor-pointer">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-tr from-slate-800 to-slate-700 rounded-xl flex items-center justify-center font-black text-emerald-400 border border-white/10 shadow-inner">{c.name.charAt(0)}</div>
                            <span className="font-black text-lg">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-10 py-8"><StatusBadge status={c.status} /></td>
                        <td className="px-10 py-8 text-sm text-slate-400 italic font-medium">"{c.notes}"</td>
                        <td className="px-10 py-8 font-mono text-xs text-slate-500 uppercase tracking-tighter">{c.lastContact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>

      <Toast message={toast.message} show={toast.show} />
    </div>
  );
};

export default App;
