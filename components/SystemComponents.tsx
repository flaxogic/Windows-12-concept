import React, { useState, useEffect } from 'react';
import { 
    Grid, Wifi, Volume2, Battery, Search, Power, 
    Settings as SettingsIcon, User, ChevronUp, RotateCcw, LogOut, Moon
} from 'lucide-react';
import { AppConfig, AppID, PowerAction } from '../types';

// --- Clock ---
export const Clock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col items-end justify-center px-2 hover:bg-white/10 rounded-md transition-colors cursor-default h-full select-none">
            <div className="text-xs font-medium leading-tight">
                {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </div>
            <div className="text-[10px] leading-tight text-white/80">
                {time.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
        </div>
    );
};

// --- Start Menu ---
interface StartMenuProps {
    isOpen: boolean;
    apps: AppConfig[];
    onLaunch: (appId: AppID) => void;
    onClose: () => void;
    onPowerAction: (action: PowerAction) => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, apps, onLaunch, onClose, onPowerAction }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showPowerMenu, setShowPowerMenu] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setShowPowerMenu(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="pointer-events-auto absolute bottom-16 left-1/2 transform -translate-x-1/2 w-[640px] h-[650px] bg-[#1a1a1a]/80 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200 z-50 origin-bottom"
            onClick={(e) => {
                e.stopPropagation();
                if (showPowerMenu) setShowPowerMenu(false);
            }}
        >
            {/* Search */}
            <div className="p-6 pb-2">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-white/50" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search for apps, settings, and documents" 
                        className="w-full bg-[#2d2d2d] border border-white/5 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-white/30"
                        autoFocus
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Pinned Section */}
            <div className="flex-1 p-6 pt-2 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-white/90 ml-2">Pinned</h3>
                    <button className="text-xs bg-white/5 px-2 py-1 rounded hover:bg-white/10 transition-colors">All apps &gt;</button>
                </div>
                
                <div className="grid grid-cols-6 gap-2">
                    {apps.map((app) => (
                        <button 
                            key={app.id}
                            onClick={() => { onLaunch(app.id); onClose(); }}
                            className="flex flex-col items-center gap-2 p-3 hover:bg-white/5 rounded-lg transition-colors group active:scale-95 duration-100"
                        >
                            <div className={`w-10 h-10 ${app.color} flex items-center justify-center rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                                <app.icon size={24} className="text-white drop-shadow-md" />
                            </div>
                            <span className="text-xs text-white/80 font-medium tracking-tight truncate w-full text-center">{app.name}</span>
                        </button>
                    ))}
                    {/* Placeholder dummies for grid fill */}
                    {Array.from({length: 6}).map((_, i) => (
                         <div key={`dummy-${i}`} className="flex flex-col items-center gap-2 p-3 opacity-30 pointer-events-none">
                            <div className="w-10 h-10 bg-white/10 rounded-xl"></div>
                            <div className="w-12 h-2 bg-white/10 rounded-full"></div>
                         </div>
                    ))}
                </div>

                <div className="flex justify-between items-center mb-4 mt-8">
                    <h3 className="text-sm font-semibold text-white/90 ml-2">Recommended</h3>
                    <button className="text-xs bg-white/5 px-2 py-1 rounded hover:bg-white/10 transition-colors">More &gt;</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer group">
                        <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center text-blue-400 font-bold text-xs group-hover:bg-blue-500/30 transition-colors">W</div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium">Project Proposal.docx</span>
                            <span className="text-[10px] text-white/40">2 hours ago</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer group">
                        <div className="w-8 h-8 bg-green-500/20 rounded flex items-center justify-center text-green-400 font-bold text-xs group-hover:bg-green-500/30 transition-colors">X</div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium">Q3_Budget.xlsx</span>
                            <span className="text-[10px] text-white/40">Yesterday</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="h-14 bg-[#151515]/90 border-t border-white/5 flex items-center justify-between px-8 shrink-0 relative">
                <div className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center shadow-inner">
                        <User size={16} className="text-white" />
                    </div>
                    <div className="text-xs font-medium">Guest User</div>
                </div>
                
                <div className="relative">
                    {showPowerMenu && (
                        <div className="absolute bottom-12 right-0 w-48 bg-[#1f1f1f] border border-white/10 rounded-xl shadow-2xl p-1.5 flex flex-col gap-1 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200 mb-2">
                             <button onClick={() => onPowerAction('sleep')} className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg text-left text-xs text-white/90">
                                <Moon size={14} /> Sleep
                            </button>
                            <button onClick={() => onPowerAction('shutdown')} className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg text-left text-xs text-white/90">
                                <Power size={14} /> Shut down
                            </button>
                            <button onClick={() => onPowerAction('restart')} className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg text-left text-xs text-white/90">
                                <RotateCcw size={14} /> Restart
                            </button>
                             <div className="h-px bg-white/10 my-0.5" />
                             <button onClick={() => onPowerAction('reset')} className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg text-left text-xs text-white/90">
                                <LogOut size={14} /> Reset PC
                            </button>
                        </div>
                    )}
                    <button 
                        onClick={(e) => { e.stopPropagation(); setShowPowerMenu(!showPowerMenu); }}
                        className={`p-2 rounded-lg transition-colors ${showPowerMenu ? 'bg-white/10' : 'hover:bg-white/5'}`}
                    >
                        <Power size={18} className="text-white/80" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Taskbar ---
interface TaskbarProps {
    apps: AppConfig[];
    openApps: { [id: string]: boolean };
    activeApp: string | null;
    onLaunch: (appId: AppID) => void;
    onStartToggle: () => void;
    startOpen: boolean;
}

export const Taskbar: React.FC<TaskbarProps> = ({ 
    apps, openApps, activeApp, onLaunch, onStartToggle, startOpen 
}) => {
    return (
        <div 
            className="pointer-events-auto absolute bottom-2 left-0 right-0 h-12 flex justify-center items-end z-40 mb-1"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="h-12 bg-[#1a1a1a]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex items-center px-2 gap-1 relative">
                
                {/* Start Button */}
                <button 
                    onClick={onStartToggle}
                    className={`p-2 rounded-lg transition-all duration-300 ${startOpen ? 'bg-white/10' : 'hover:bg-white/5'}`}
                >
                    <Grid size={24} className={`text-blue-400 transition-transform duration-300 ${startOpen ? 'scale-110 rotate-90' : ''}`} />
                </button>

                <div className="w-[1px] h-6 bg-white/10 mx-1"></div>

                {/* App Icons */}
                {apps.map((app) => {
                    const isRunning = openApps[app.id];
                    const isActive = activeApp === app.id;

                    return (
                        <button
                            key={app.id}
                            onClick={() => onLaunch(app.id)}
                            className={`group relative p-2 rounded-lg transition-all duration-200 ${
                                isActive && !startOpen ? 'bg-white/10' : 'hover:bg-white/5'
                            } active:scale-95`}
                        >
                            <div className={`w-8 h-8 ${app.color} rounded-lg flex items-center justify-center shadow-sm group-hover:-translate-y-1 transition-transform duration-300`}>
                                <app.icon size={20} className="text-white drop-shadow-md" />
                            </div>
                            
                            {/* Running Indicator */}
                            <div className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 rounded-full transition-all duration-300 ${
                                isRunning 
                                    ? isActive && !startOpen ? 'w-4 h-1 bg-blue-400' : 'w-1.5 h-1.5 bg-white/40' 
                                    : 'w-0 h-0 bg-transparent'
                            }`} />
                            
                            {/* Hover Label */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#2d2d2d] text-white text-[10px] px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl">
                                {app.name}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* System Tray */}
            <div className="absolute right-4 bottom-0 h-12 flex items-center gap-2 bg-[#1a1a1a]/80 backdrop-blur-2xl border border-white/10 rounded-xl px-3 mb-1 shadow-2xl">
                 <button className="hover:bg-white/10 p-1.5 rounded transition-colors text-white/80 hover:text-white">
                    <ChevronUp size={16} />
                 </button>
                 <div className="flex items-center gap-2 px-1 hover:bg-white/10 rounded transition-colors cursor-pointer h-9 text-white/80 hover:text-white">
                    <Wifi size={16} />
                    <Volume2 size={16} />
                    <Battery size={16} />
                 </div>
                 <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
                 <Clock />
                 <div className="w-1 h-8 border-l border-white/20 ml-2"></div>
            </div>
        </div>
    );
};