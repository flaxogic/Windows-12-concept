import React, { useState, useRef, useEffect } from 'react';
import { 
  Folder, HardDrive, Search, ArrowLeft, ArrowRight, RotateCw, 
  Home, Star, MoreHorizontal, Settings, Monitor, Volume2, 
  Battery, Wifi, Image as ImageIcon, Music, Video, Download,
  Globe, Lock, FileText, ChevronRight, Plus, Minus, X, Divide, 
  Moon, Sun, Smartphone, Palette, User, Bell, UploadCloud, CheckCircle, File, Trash2, Wallpaper
} from 'lucide-react';
import { FileSystem, VirtualFile } from '../types';

// --- Shared Components ---
const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button 
        onClick={onChange}
        className={`w-11 h-6 rounded-full relative transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
    >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

const Slider = ({ value, onChange, icon: Icon }: { value: number, onChange: (val: number) => void, icon?: any }) => (
    <div className="flex items-center gap-3 w-full">
        {Icon && <Icon size={16} className="text-gray-500" />}
        <input 
            type="range" 
            min="0" 
            max="100" 
            value={value} 
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <span className="text-xs text-gray-500 w-8 text-right">{value}%</span>
    </div>
);

interface ExplorerProps {
    fileSystem: FileSystem;
    setFileSystem: React.Dispatch<React.SetStateAction<FileSystem>>;
    onWallpaperChange?: (url: string) => void;
}

// --- File Explorer (Functional) ---
export const ExplorerApp: React.FC<ExplorerProps> = ({ fileSystem, setFileSystem, onWallpaperChange }) => {
  const [currentPath, setCurrentPath] = useState<string[]>(['This PC']);
  const [history, setHistory] = useState<string[][]>([['This PC']]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, file: VirtualFile} | null>(null);

  const currentFolder = currentPath[currentPath.length - 1];
  const items = fileSystem[currentFolder] || [];

  useEffect(() => {
      const handleClick = () => setContextMenu(null);
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
  }, []);

  const navigate = (folderName: string) => {
    if (fileSystem[folderName]) {
      const newPath = [...currentPath, folderName];
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newPath);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setCurrentPath(newPath);
    }
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
    }
  };

  const goUp = () => {
      if (currentPath.length > 1) {
          const newPath = currentPath.slice(0, -1);
          const newHistory = history.slice(0, historyIndex + 1);
          newHistory.push(newPath);
          setHistory(newHistory);
          setHistoryIndex(newHistory.length - 1);
          setCurrentPath(newPath);
      }
  };

  const handleContextMenu = (e: React.MouseEvent, file: VirtualFile) => {
      e.preventDefault();
      e.stopPropagation();
      setContextMenu({ x: e.clientX, y: e.clientY, file });
  };

  const handleDelete = (file: VirtualFile) => {
      setFileSystem(prev => ({
          ...prev,
          [currentFolder]: prev[currentFolder].filter(f => f.id !== file.id)
      }));
  };

  return (
    <div className="flex flex-col h-full bg-[#191919] text-white relative">
      {/* Ribbon */}
      <div className="h-12 border-b border-white/10 flex items-center px-4 gap-4 bg-[#202020] shrink-0">
        <div className="flex gap-2 text-white/60">
            <button onClick={goBack} disabled={historyIndex === 0} className="disabled:opacity-30 hover:bg-white/10 p-1 rounded transition-colors"><ArrowLeft size={16} /></button>
            <button onClick={goForward} disabled={historyIndex === history.length - 1} className="disabled:opacity-30 hover:bg-white/10 p-1 rounded transition-colors"><ArrowRight size={16} /></button>
            <button onClick={goUp} disabled={currentPath.length === 1} className="disabled:opacity-30 hover:bg-white/10 p-1 rounded transition-colors"><ArrowLeft size={16} className="rotate-90" /></button>
        </div>
        <div className="flex-1 bg-white/5 rounded px-3 py-1.5 text-sm border border-white/10 flex items-center gap-2 overflow-hidden">
            <Monitor size={14} className="text-blue-400 shrink-0"/>
            <div className="flex items-center text-xs text-white/80 truncate">
               {currentPath.map((p, i) => (
                   <React.Fragment key={i}>
                       {i > 0 && <ChevronRight size={12} className="mx-1 text-white/40" />}
                       <span className="cursor-pointer hover:bg-white/10 px-1 rounded" onClick={() => navigate(p)}>{p}</span>
                   </React.Fragment>
               ))}
            </div>
        </div>
        <div className="w-48 bg-white/5 rounded px-3 py-1.5 text-sm border border-white/10 flex items-center">
            <Search size={14} className="text-white/40 mr-2"/>
            <input className="bg-transparent border-none outline-none text-xs w-full placeholder-white/30" placeholder={`Search ${currentFolder}`} />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-[#1e1e1e] border-r border-white/5 p-2 space-y-1 text-sm hidden md:block overflow-y-auto">
            <div onClick={() => { setCurrentPath(['This PC']); setHistory([...history, ['This PC']]); setHistoryIndex(history.length); }} className="p-2 hover:bg-white/5 rounded cursor-pointer flex items-center gap-2 text-white/90"><Home size={16} className="text-blue-400" /> Home</div>
            <div className="my-2 h-px bg-white/10"></div>
            <div className="px-2 py-1 text-xs text-white/40 font-semibold uppercase">Quick Access</div>
            <div onClick={() => navigate('Documents')} className="p-2 hover:bg-white/5 rounded cursor-pointer flex items-center gap-2 text-white/80"><Folder size={16} className="text-yellow-500"/> Documents</div>
            <div onClick={() => navigate('Downloads')} className="p-2 hover:bg-white/5 rounded cursor-pointer flex items-center gap-2 text-white/80"><Download size={16} className="text-green-500"/> Downloads</div>
            <div onClick={() => navigate('Pictures')} className="p-2 hover:bg-white/5 rounded cursor-pointer flex items-center gap-2 text-white/80"><ImageIcon size={16} className="text-purple-500"/> Pictures</div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-[#191919] p-4 overflow-y-auto" onContextMenu={(e) => e.preventDefault()}>
            <h3 className="text-sm font-semibold mb-4">{currentFolder}</h3>
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/30 pb-20">
                    <Folder size={48} className="mb-2 opacity-50"/>
                    <span className="text-sm">This folder is empty.</span>
                </div>
            ) : (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                    {items.map((item: VirtualFile, i: number) => (
                        <div 
                            key={i} 
                            onClick={() => item.type !== 'file' && navigate(item.name)}
                            onContextMenu={(e) => handleContextMenu(e, item)}
                            className={`flex flex-col items-center gap-2 p-2 hover:bg-white/5 rounded cursor-pointer group ${item.type === 'file' ? 'opacity-80' : ''}`}
                        >
                            {item.url && item.type === 'file' ? (
                                <div className="w-12 h-12 rounded overflow-hidden shadow-lg">
                                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <item.icon size={48} className={`${item.color} group-hover:scale-105 transition-transform duration-200 drop-shadow-lg`} />
                            )}
                            <span className="text-xs text-center truncate w-full px-1">{item.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="h-6 bg-[#202020] border-t border-white/5 flex items-center px-4 text-xs text-white/40 shrink-0">
        {items.length} items
      </div>

      {/* Context Menu */}
      {contextMenu && (
          <div 
            className="fixed w-48 bg-[#2d2d2d] border border-white/10 rounded-lg shadow-2xl py-1 z-[100] animate-in fade-in zoom-in-95 duration-100"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(e) => e.stopPropagation()}
          >
              <div className="px-3 py-1.5 text-xs text-white/50 border-b border-white/5 mb-1 truncate">{contextMenu.file.name}</div>
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 flex items-center gap-2 text-white/90">
                  <Folder size={14} /> Open
              </button>
              {contextMenu.file.url && onWallpaperChange && (
                  <button 
                    onClick={() => { onWallpaperChange(contextMenu.file.url!); setContextMenu(null); }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 flex items-center gap-2 text-white/90"
                  >
                      <Wallpaper size={14} /> Set as desktop background
                  </button>
              )}
              <div className="h-px bg-white/10 my-1"></div>
              <button 
                onClick={() => { handleDelete(contextMenu.file); setContextMenu(null); }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-red-500/20 text-red-400 flex items-center gap-2"
              >
                  <Trash2 size={14} /> Delete
              </button>
          </div>
      )}
    </div>
  );
};

// --- Browser (Functional) ---
export const BrowserApp: React.FC = () => {
    const [url, setUrl] = useState('https://www.wikipedia.org/');
    const [inputUrl, setInputUrl] = useState('https://www.wikipedia.org/');
    const [isLoading, setIsLoading] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const navigate = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        let target = inputUrl;
        if (!target.includes('.') && !target.includes('://')) {
             target = `https://www.google.com/search?q=${encodeURIComponent(target)}`;
        } else if (!target.startsWith('http')) {
            target = 'https://' + target;
        }
        setUrl(target);
        setIsLoading(true);
    };

    return (
        <div className="flex flex-col h-full bg-white text-gray-900">
            {/* Top Bar */}
            <div className="h-10 bg-[#f3f3f3] flex items-center px-2 gap-2 border-b border-gray-300 shrink-0">
                <div className="flex gap-1 text-gray-500">
                    <button className="p-1 hover:bg-gray-200 rounded-full transition-colors"><ArrowLeft size={16}/></button>
                    <button className="p-1 hover:bg-gray-200 rounded-full transition-colors"><ArrowRight size={16}/></button>
                    <button onClick={() => { setIsLoading(true); const u = url; setUrl(''); setTimeout(() => setUrl(u), 10); }} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><RotateCw size={16} className={isLoading ? 'animate-spin' : ''}/></button>
                </div>
                <form onSubmit={navigate} className="flex-1 bg-white rounded-full border border-gray-200 h-8 flex items-center px-3 text-sm shadow-sm focus-within:ring-2 focus-within:ring-blue-500/50 transition-shadow">
                    <Lock size={12} className="text-green-600 mr-2"/>
                    <input 
                        className="flex-1 outline-none text-gray-700 bg-transparent" 
                        value={inputUrl} 
                        onChange={(e) => setInputUrl(e.target.value)}
                        onFocus={(e) => e.target.select()}
                    />
                    <Star size={14} className="text-gray-400 cursor-pointer hover:text-yellow-400"/>
                </form>
                <div className="flex gap-2 text-gray-600">
                    <MoreHorizontal size={20} className="cursor-pointer hover:bg-gray-200 rounded p-0.5" />
                </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 bg-white relative">
               {isLoading && (
                   <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                       <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                   </div>
               )}
               <iframe 
                   ref={iframeRef}
                   src={url} 
                   className="w-full h-full border-none"
                   title="Browser"
                   sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                   onLoad={() => setIsLoading(false)}
                   onError={() => setIsLoading(false)}
               />
               <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex items-center justify-center bg-gray-5 -z-10">
                   <div className="text-center text-gray-400">
                       <Globe size={48} className="mx-auto mb-2 opacity-50"/>
                       <p>Connecting...</p>
                   </div>
               </div>
            </div>
        </div>
    );
}

interface SettingsProps {
    username?: string;
    currentWallpaper?: string;
    onWallpaperChange?: (url: string) => void;
    onUpload?: (files: File[], targetFolder?: string) => void;
}

// --- Settings (Interactive) ---
export const SettingsApp: React.FC<SettingsProps> = ({ 
    username = "Guest User", 
    currentWallpaper, 
    onWallpaperChange,
    onUpload
}) => {
    const [activeTab, setActiveTab] = useState('System');
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // System States
    const [brightness, setBrightness] = useState(85);
    const [nightLight, setNightLight] = useState(false);
    const [batterySaver, setBatterySaver] = useState(false);
    
    // Network States
    const [wifi, setWifi] = useState(true);
    const [bluetooth, setBluetooth] = useState(true);
    const [airplaneMode, setAirplaneMode] = useState(false);

    // Personalization
    const [themeMode, setThemeMode] = useState<'light'|'dark'>('dark');
    const [centerTaskbar, setCenterTaskbar] = useState(true);

    const wallpapers = [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", // Abstract Waves
        "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop", // Mountains
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop", // Snowy Sky
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop", // Yosemite
        "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop", // City
        "https://images.unsplash.com/photo-1534067783865-9a05b6376518?q=80&w=1974&auto=format&fit=crop"  // Minimal
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0 && onUpload && onWallpaperChange) {
            const file = e.target.files[0];
            // Upload to "Pictures"
            onUpload([file], 'Pictures');
            // Set as wallpaper immediately
            const url = URL.createObjectURL(file);
            onWallpaperChange(url);
        }
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'System':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="h-32 bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center px-8 gap-6">
                                <Monitor size={48} className="text-blue-600" />
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Windows 12 Concept</h2>
                                    <p className="text-gray-500 text-sm">Pro Edition • 24H2</p>
                                    <p className="text-gray-400 text-xs mt-1">Licensed to {username}</p>
                                </div>
                            </div>
                        </div>

                        <h3 className="font-semibold text-gray-700 mt-6 mb-2 px-1">Display</h3>
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
                            <div className="p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Sun size={20} className="text-gray-500" />
                                        <span className="text-sm font-medium">Brightness</span>
                                    </div>
                                    <span className="text-sm text-gray-500">{brightness}%</span>
                                </div>
                                <Slider value={brightness} onChange={setBrightness} />
                            </div>
                            <div className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Moon size={20} className="text-gray-500" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">Night light</span>
                                        <span className="text-xs text-gray-500">Use warmer colors to help block blue light</span>
                                    </div>
                                </div>
                                <Toggle checked={nightLight} onChange={() => setNightLight(!nightLight)} />
                            </div>
                        </div>

                         <h3 className="font-semibold text-gray-700 mt-6 mb-2 px-1">Power</h3>
                         <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                             <div className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Battery size={20} className="text-gray-500" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">Battery saver</span>
                                        <span className="text-xs text-gray-500">Extend battery life by limiting background activity</span>
                                    </div>
                                </div>
                                <Toggle checked={batterySaver} onChange={() => setBatterySaver(!batterySaver)} />
                            </div>
                         </div>
                    </div>
                );
            case 'Network':
                 return (
                     <div className="space-y-6 animate-in fade-in duration-300">
                         <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold">Network & internet</h2>
                            <span className="text-sm text-blue-600 hover:underline cursor-pointer">Advanced settings</span>
                         </div>
                         
                         <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
                             <div className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                 <div className="flex items-center gap-4">
                                     <div className="bg-blue-100 p-2 rounded-lg"><Wifi size={24} className="text-blue-600" /></div>
                                     <div>
                                         <div className="font-medium text-sm">Wi-Fi</div>
                                         <div className="text-xs text-gray-500">{wifi ? 'Connected to Starlink_5G' : 'Off'}</div>
                                     </div>
                                 </div>
                                 <Toggle checked={wifi} onChange={() => setWifi(!wifi)} />
                             </div>
                             <div className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                 <div className="flex items-center gap-4">
                                     <div className="bg-indigo-100 p-2 rounded-lg"><Smartphone size={24} className="text-indigo-600" /></div>
                                     <div>
                                         <div className="font-medium text-sm">Bluetooth</div>
                                         <div className="text-xs text-gray-500">{bluetooth ? 'Discoverable as "Desktop-X12"' : 'Off'}</div>
                                     </div>
                                 </div>
                                 <Toggle checked={bluetooth} onChange={() => setBluetooth(!bluetooth)} />
                             </div>
                         </div>
                     </div>
                 );
             case 'Personalization':
                 return (
                     <div className="space-y-6 animate-in fade-in duration-300">
                         <h2 className="text-2xl font-semibold">Personalization</h2>
                         
                         <div className="flex justify-between items-end">
                            <h3 className="text-sm font-medium text-gray-500">Background</h3>
                            <div className="flex gap-2">
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded-md shadow-sm hover:bg-gray-50 transition-colors font-medium text-gray-700"
                                >
                                    Browse photos
                                </button>
                            </div>
                         </div>

                         <div className="grid grid-cols-3 gap-3">
                             {wallpapers.map((wp, i) => (
                                 <div 
                                    key={i}
                                    onClick={() => onWallpaperChange && onWallpaperChange(wp)}
                                    className={`aspect-video rounded-lg cursor-pointer overflow-hidden border-2 transition-all hover:opacity-90 ${currentWallpaper === wp ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-transparent'}`}
                                 >
                                     <img src={wp} alt="Wallpaper" className="w-full h-full object-cover" />
                                 </div>
                             ))}
                         </div>
                         
                         <h3 className="text-sm font-medium text-gray-500 mt-4">Theme</h3>
                         <div className="grid grid-cols-2 gap-4">
                             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-blue-500 transition-colors" onClick={() => setThemeMode('light')}>
                                 <div className="aspect-video bg-gray-100 rounded-lg mb-3 border border-gray-200"></div>
                                 <div className="flex justify-between items-center">
                                     <span className="font-medium text-sm">Light</span>
                                     {themeMode === 'light' && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                                 </div>
                             </div>
                             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-blue-500 transition-colors" onClick={() => setThemeMode('dark')}>
                                 <div className="aspect-video bg-gray-800 rounded-lg mb-3 border border-gray-700"></div>
                                 <div className="flex justify-between items-center">
                                     <span className="font-medium text-sm">Dark</span>
                                     {themeMode === 'dark' && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                                 </div>
                             </div>
                         </div>
                         
                         <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100 mt-4">
                            <div className="p-4 flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                    <div className="bg-purple-100 p-2 rounded-lg"><Palette size={24} className="text-purple-600" /></div>
                                    <span className="font-medium text-sm">Accent Color</span>
                                 </div>
                                 <div className="flex gap-2">
                                     {['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-green-500', 'bg-gray-500'].map(c => (
                                         <button key={c} className={`${c} w-6 h-6 rounded-full hover:scale-110 transition-transform focus:ring-2 ring-offset-2 ring-blue-500`}></button>
                                     ))}
                                 </div>
                             </div>
                             <div className="p-4 flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                     <div className="bg-gray-100 p-2 rounded-lg"><Monitor size={24} className="text-gray-600" /></div>
                                     <div>
                                         <span className="font-medium text-sm block">Taskbar Alignment</span>
                                         <span className="text-xs text-gray-500">Center or Left aligned taskbar icons</span>
                                     </div>
                                 </div>
                                 <div className="bg-gray-100 p-1 rounded-lg flex text-xs">
                                     <button 
                                        className={`px-3 py-1 rounded ${!centerTaskbar ? 'bg-white shadow-sm font-medium' : 'text-gray-500'}`}
                                        onClick={() => setCenterTaskbar(false)}
                                     >
                                         Left
                                     </button>
                                     <button 
                                        className={`px-3 py-1 rounded ${centerTaskbar ? 'bg-white shadow-sm font-medium' : 'text-gray-500'}`}
                                        onClick={() => setCenterTaskbar(true)}
                                     >
                                         Center
                                     </button>
                                 </div>
                             </div>
                         </div>
                     </div>
                 );
            default:
                return <div className="p-10 text-center text-gray-400">Settings for {activeTab} coming soon.</div>;
        }
    };

    return (
        <div className="flex h-full bg-[#f3f3f3] text-gray-900 font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-[#f9f9f9] border-r border-gray-200 p-4 space-y-1 overflow-y-auto shrink-0 flex flex-col">
                <div className="flex items-center gap-3 px-2 py-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 shrink-0 shadow-sm flex items-center justify-center text-white">
                        <User size={24} />
                    </div>
                    <div>
                        <div className="font-semibold text-sm">{username}</div>
                        <div className="text-xs text-gray-500">Local Account</div>
                    </div>
                </div>
                
                <div className="space-y-1 flex-1">
                    {[
                        { name: 'System', icon: Monitor },
                        { name: 'Network', icon: Wifi },
                        { name: 'Personalization', icon: Palette },
                        { name: 'Apps', icon: Search },
                        { name: 'Accounts', icon: User },
                        { name: 'Time & language', icon: Globe },
                    ].map(tab => (
                        <div 
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`px-3 py-2.5 rounded-lg flex items-center gap-3 text-sm cursor-pointer transition-all ${activeTab === tab.name ? 'bg-white shadow-sm text-blue-600 font-medium' : 'hover:bg-gray-200/50 text-gray-600'}`}
                        >
                            <tab.icon size={18} className={activeTab === tab.name ? 'text-blue-500' : 'text-gray-400'}/> {tab.name}
                        </div>
                    ))}
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="px-3 py-2 rounded-lg flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-200/50 text-gray-600">
                        <Settings size={18} className="text-gray-400" /> Windows Update
                    </div>
                </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 p-8 overflow-y-auto bg-[#f3f3f3]">
                <div className="max-w-3xl mx-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

// --- Calculator (Functional) ---
export const CalculatorApp: React.FC = () => {
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');
    const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

    const handleNumber = (num: string) => {
        if (display === '0' || shouldResetDisplay) {
            setDisplay(num);
            setShouldResetDisplay(false);
        } else {
            setDisplay(display + num);
        }
    };

    const handleOperator = (op: string) => {
        setEquation(display + ' ' + op + ' ');
        setShouldResetDisplay(true);
    };

    const handleEqual = () => {
        try {
            // Basic safe evaluation
            const fullEq = equation + display;
            // eslint-disable-next-line no-eval
            const result = eval(fullEq.replace('×', '*').replace('÷', '/'));
            setDisplay(String(result));
            setEquation('');
            setShouldResetDisplay(true);
        } catch (e) {
            setDisplay('Error');
        }
    };

    const handleClear = () => {
        setDisplay('0');
        setEquation('');
    };

    const btnClass = "flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-sm font-medium active:bg-white/20 select-none";
    const opClass = "flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors text-sm font-medium text-white shadow-lg active:scale-95 select-none";

    return (
        <div className="flex flex-col h-full bg-[#202020] text-white p-4">
             <div className="h-24 flex flex-col items-end justify-end mb-4 px-2">
                 <div className="text-white/50 text-xs mb-1 h-4">{equation}</div>
                 <div className="text-4xl font-light tracking-wider">{display}</div>
             </div>
             
             <div className="grid grid-cols-4 gap-2 flex-1">
                 <button onClick={handleClear} className={`${btnClass} text-red-400 bg-white/5 col-span-2`}>AC</button>
                 <button onClick={() => handleClear()} className={`${btnClass} text-white/70 bg-white/5`}>C</button>
                 <button onClick={() => handleOperator('÷')} className={`${btnClass} text-blue-400 bg-white/5`}><Divide size={18}/></button>

                 {[7,8,9].map(n => <button key={n} onClick={() => handleNumber(String(n))} className={`${btnClass} bg-[#2d2d2d]`}>{n}</button>)}
                 <button onClick={() => handleOperator('×')} className={`${btnClass} text-blue-400 bg-white/5`}><X size={18}/></button>

                 {[4,5,6].map(n => <button key={n} onClick={() => handleNumber(String(n))} className={`${btnClass} bg-[#2d2d2d]`}>{n}</button>)}
                 <button onClick={() => handleOperator('-')} className={`${btnClass} text-blue-400 bg-white/5`}><Minus size={18}/></button>

                 {[1,2,3].map(n => <button key={n} onClick={() => handleNumber(String(n))} className={`${btnClass} bg-[#2d2d2d]`}>{n}</button>)}
                 <button onClick={() => handleOperator('+')} className={`${btnClass} text-blue-400 bg-white/5`}><Plus size={18}/></button>

                 <button onClick={() => handleNumber('0')} className={`${btnClass} col-span-2 bg-[#2d2d2d]`}>0</button>
                 <button onClick={() => handleNumber('.')} className={`${btnClass} bg-[#2d2d2d]`}>.</button>
                 <button onClick={handleEqual} className={opClass}>=</button>
             </div>
        </div>
    );
};

// --- Notepad (Functional) ---
export const NotepadApp: React.FC = () => {
    const [text, setText] = useState('Welcome to Windows 12 Concept.\n\nType your notes here...');
    
    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] text-white/90">
            <div className="h-8 flex items-center gap-4 px-4 text-xs text-white/60 bg-[#252525] border-b border-white/5 shrink-0">
                <span className="hover:text-white cursor-pointer">File</span>
                <span className="hover:text-white cursor-pointer">Edit</span>
                <span className="hover:text-white cursor-pointer">View</span>
            </div>
            <textarea 
                className="flex-1 bg-transparent resize-none outline-none p-4 font-mono text-sm leading-relaxed"
                value={text}
                onChange={(e) => setText(e.target.value)}
                spellCheck={false}
            />
            <div className="h-6 bg-[#252525] border-t border-white/5 flex items-center justify-end px-4 text-[10px] text-white/40 shrink-0">
                Ln {text.split('\n').length}, Col {text.length}
            </div>
        </div>
    );
};

// --- Photos (Functional) ---
export const PhotosApp: React.FC = () => {
    const photos = [
        "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1682686581854-5e71f58e7e3f?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1707343844152-4d7a86377e68?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1705533513689-53e3067645b9?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1682695794816-7b9da18ed470?q=80&w=400&auto=format&fit=crop"
    ];

    return (
        <div className="flex flex-col h-full bg-[#111] text-white">
            <div className="h-12 flex items-center px-4 bg-[#1a1a1a] border-b border-white/10 shrink-0">
                <span className="font-semibold text-sm">Gallery</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-3 gap-2">
                    {photos.map((src, i) => (
                        <div key={i} className="aspect-square bg-white/5 rounded-lg overflow-hidden hover:opacity-80 transition-opacity cursor-pointer">
                            <img src={src} alt={`Photo ${i}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface UploadProps {
    onUpload?: (files: File[]) => void;
}

// --- Upload App (New) ---
export const UploadApp: React.FC<UploadProps> = ({ onUpload }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<{name: string, size: string, progress: number}[]>([]);
    
    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        
        // Update local UI
        const newFiles = droppedFiles.map((f: File) => ({
            name: f.name,
            size: (f.size / 1024).toFixed(1) + ' KB',
            progress: 0
        }));
        setFiles(prev => [...prev, ...newFiles]);
        
        // Pass to system (Simulated async upload)
        newFiles.forEach((_, i) => {
            const index = files.length + i;
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    // Actual System Upload trigger once "complete"
                    if (onUpload) onUpload([droppedFiles[i]]);
                }
                setFiles(prev => prev.map((f, idx) => idx === index ? { ...f, progress } : f));
            }, 300);
        });
    };

    return (
        <div className="flex flex-col h-full bg-[#191919] text-white p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <UploadCloud size={24} className="text-blue-500"/>
                Upload to PC
            </h2>
            
            <div 
                className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                    <UploadCloud size={32} />
                </div>
                <p className="text-lg font-medium">Drag & Drop files here</p>
                <p className="text-white/50 text-sm mt-1">or click to browse from your computer</p>
                <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    id="file-upload"
                    onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                           // Trigger drop logic manually for click
                           // This is a simplification; ideally we abstract the logic
                           const fakeEvent = { preventDefault: () => {}, dataTransfer: { files: e.target.files } } as any;
                           onDrop(fakeEvent);
                        }
                    }}
                />
                <label htmlFor="file-upload" className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                    Browse Files
                </label>
            </div>
            
            {files.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-sm font-medium text-white/70 mb-2">Recent Uploads</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {files.map((f, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                <File size={20} className="text-blue-400" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="truncate">{f.name}</span>
                                        <span className="text-white/50">{f.size}</span>
                                    </div>
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-500 transition-all duration-300"
                                            style={{ width: `${f.progress}%` }}
                                        />
                                    </div>
                                </div>
                                {f.progress >= 100 && <CheckCircle size={16} className="text-green-500" />}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};