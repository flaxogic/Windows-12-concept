import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  Bot, Folder, Chrome, Settings, Image as ImageIcon, 
  FileText, Calculator, Grid, Globe, Wifi, User, Check, ArrowRight, Lock, UploadCloud,
  HardDrive, Download, Music, Video
} from 'lucide-react';
import { AppID, WindowState, AppConfig, SystemState, PowerAction, FileSystem, VirtualFile } from './types';
import { Window } from './components/Window';
import { Taskbar, StartMenu } from './components/SystemComponents';
import { CopilotApp } from './apps/Copilot';
import { 
  ExplorerApp, BrowserApp, SettingsApp, 
  CalculatorApp, NotepadApp, PhotosApp, UploadApp 
} from './apps/SystemApps';

// --- App Definitions ---
const APPS: AppConfig[] = [
  { 
    id: AppID.COPILOT, 
    name: 'Copilot', 
    icon: Bot, 
    component: CopilotApp, 
    defaultWidth: 400, 
    defaultHeight: 600,
    color: 'bg-gradient-to-br from-blue-600 to-cyan-500' 
  },
  { 
    id: AppID.EXPLORER, 
    name: 'File Explorer', 
    icon: Folder, 
    component: ExplorerApp, 
    defaultWidth: 800, 
    defaultHeight: 500,
    color: 'bg-gradient-to-br from-yellow-500 to-orange-400'
  },
  { 
    id: AppID.BROWSER, 
    name: 'Edge Browser', 
    icon: Chrome, 
    component: BrowserApp, 
    defaultWidth: 900, 
    defaultHeight: 600,
    color: 'bg-gradient-to-br from-blue-400 to-blue-600'
  },
  { 
    id: AppID.SETTINGS, 
    name: 'Settings', 
    icon: Settings, 
    component: SettingsApp, 
    defaultWidth: 800, 
    defaultHeight: 550,
    color: 'bg-gradient-to-br from-gray-500 to-gray-600'
  },
  {
    id: AppID.PHOTOS,
    name: 'Photos',
    icon: ImageIcon,
    component: PhotosApp,
    defaultWidth: 700,
    defaultHeight: 500,
    color: 'bg-gradient-to-br from-purple-500 to-pink-500'
  },
  {
    id: AppID.NOTEPAD,
    name: 'Notepad',
    icon: FileText,
    component: NotepadApp,
    defaultWidth: 600,
    defaultHeight: 400,
    color: 'bg-gradient-to-br from-gray-800 to-black'
  },
  {
      id: AppID.CALCULATOR,
      name: 'Calculator',
      icon: Calculator,
      component: CalculatorApp,
      defaultWidth: 320,
      defaultHeight: 480,
      color: 'bg-gradient-to-br from-orange-400 to-red-500'
  },
  {
      id: AppID.UPLOAD,
      name: 'Upload',
      icon: UploadCloud,
      component: UploadApp,
      defaultWidth: 500,
      defaultHeight: 400,
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600'
  }
];

// --- Initial File System ---
const INITIAL_FILE_SYSTEM: FileSystem = {
    'This PC': [
      { id: '1', name: 'Documents', icon: Folder, color: 'text-yellow-500', type: 'folder' },
      { id: '2', name: 'Pictures', icon: ImageIcon, color: 'text-purple-500', type: 'folder' },
      { id: '3', name: 'Downloads', icon: Download, color: 'text-green-500', type: 'folder' },
      { id: '4', name: 'Music', icon: Music, color: 'text-pink-500', type: 'folder' },
      { id: '5', name: 'Videos', icon: Video, color: 'text-orange-500', type: 'folder' },
      { id: '6', name: 'Local Disk (C:)', icon: HardDrive, color: 'text-gray-400', type: 'drive' },
    ],
    'Documents': [
      { id: 'd1', name: 'Project_Alpha_Specs.docx', icon: FileText, color: 'text-blue-400', type: 'file', size: '24 KB' },
      { id: 'd2', name: 'Budget_Q3.xlsx', icon: FileText, color: 'text-green-400', type: 'file', size: '12 KB' },
      { id: 'd3', name: 'Notes.txt', icon: FileText, color: 'text-gray-400', type: 'file', size: '1 KB' },
    ],
    'Pictures': [
      { id: 'p1', name: 'Vacation_2023.jpg', icon: ImageIcon, color: 'text-purple-400', type: 'file', size: '2.4 MB', url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop" },
      { id: 'p2', name: 'Design_Mockup.png', icon: ImageIcon, color: 'text-purple-400', type: 'file', size: '1.1 MB', url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop" },
    ],
    'Downloads': [
      { id: 'dl1', name: 'installer.exe', icon: HardDrive, color: 'text-gray-400', type: 'file', size: '45 MB' },
    ],
    'Music': [],
    'Videos': [],
    'Local Disk (C:)': [
       { id: 'c1', name: 'Windows', icon: Folder, color: 'text-yellow-500', type: 'folder' },
       { id: 'c2', name: 'Program Files', icon: Folder, color: 'text-yellow-500', type: 'folder' },
       { id: 'c3', name: 'Users', icon: Folder, color: 'text-yellow-500', type: 'folder' },
    ]
};

// --- Login Screen ---
const LoginScreen = ({ 
    username, 
    onLogin 
}: { 
    username: string, 
    onLogin: (password: string) => boolean 
}) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleLogin = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsLoggingIn(true);
        setError(false);
        
        // Simulate network delay
        setTimeout(() => {
            if (onLogin(password)) {
                // Success handled by parent state change
            } else {
                setError(true);
                setIsLoggingIn(false);
                setPassword('');
            }
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center text-white bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl"></div>
            
            <div className="relative flex flex-col items-center animate-in zoom-in-95 duration-500">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 p-1 mb-6 shadow-2xl">
                    <div className="w-full h-full rounded-full bg-black/20 flex items-center justify-center backdrop-blur-sm border-2 border-white/20">
                         <User size={64} className="text-white drop-shadow-md" />
                    </div>
                </div>
                
                <h2 className="text-3xl font-medium mb-8 text-white drop-shadow-lg">{username}</h2>
                
                <form onSubmit={handleLogin} className="w-64 space-y-4">
                     <div className="relative group">
                         <input 
                            type="password" 
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(false); }}
                            placeholder="Password"
                            className={`w-full bg-black/30 backdrop-blur-md border ${error ? 'border-red-500' : 'border-white/20 group-hover:border-white/40 group-focus-within:border-white/60'} rounded-lg py-2.5 px-4 outline-none transition-all placeholder-white/40 shadow-inner`}
                            autoFocus
                            disabled={isLoggingIn}
                         />
                         <button 
                            type="submit"
                            disabled={isLoggingIn || !password}
                            className="absolute right-1.5 top-1.5 p-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-colors disabled:opacity-0"
                         >
                            {isLoggingIn ? (
                                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <ArrowRight size={16} />
                            )}
                         </button>
                     </div>
                     {error && (
                         <div className="text-sm text-red-300 text-center bg-red-500/20 py-1 rounded border border-red-500/30 animate-in fade-in slide-in-from-top-2">
                             Incorrect password. Please try again.
                         </div>
                     )}
                </form>
                
                <div className="mt-8 text-sm text-white/50 hover:text-white/80 cursor-pointer transition-colors">
                    Forgot my password
                </div>
            </div>
            
            <div className="absolute bottom-8 right-8 flex gap-4 text-white/60">
                <Wifi size={24} className="hover:text-white cursor-pointer transition-colors" />
                <div className="hover:text-white cursor-pointer transition-colors">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div className="hover:text-white cursor-pointer transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
                </div>
            </div>
        </div>
    );
};

// --- Setup Wizard (OOBE) ---
const SetupWizard = ({ onComplete }: { onComplete: (username: string, pass: string) => void }) => {
    const [step, setStep] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    // Setup State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const nextStep = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            if (step >= 2) {
                onComplete(username || 'User', password);
            } else {
                setStep(s => s + 1);
                setIsTransitioning(false);
            }
        }, 500);
    };

    const steps = [
        {
            icon: Globe,
            title: "Is this the right country or region?",
            content: (
                <div className="h-60 overflow-y-auto bg-white/5 rounded-lg border border-white/10 p-2 space-y-1 custom-scrollbar">
                    {['United States', 'United Kingdom', 'Canada', 'France', 'Germany', 'Japan', 'Australia'].map((c, i) => (
                        <div key={c} className={`p-3 rounded flex items-center justify-between cursor-pointer ${i === 0 ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-white/80'}`}>
                            <span>{c}</span>
                            {i === 0 && <Check size={16} />}
                        </div>
                    ))}
                </div>
            )
        },
        {
            icon: Wifi,
            title: "Let's connect you to a network",
            content: (
                <div className="space-y-2">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                             <Wifi size={20} />
                             <div className="flex flex-col">
                                 <span className="font-medium">Starlink_5G</span>
                                 <span className="text-xs text-white/50">Connected, secured</span>
                             </div>
                        </div>
                        <Check size={16} className="text-green-400" />
                    </div>
                     <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                             <Wifi size={20} />
                             <span className="font-medium">Home_Network</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            icon: User,
            title: "Who's going to use this device?",
            content: (
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Name" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-white/5 border-b-2 border-white/20 focus:border-blue-500 outline-none py-2 px-1 transition-colors text-lg placeholder-white/40" 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 border-b-2 border-white/20 focus:border-blue-500 outline-none py-2 px-1 transition-colors text-lg placeholder-white/40" 
                    />
                </div>
            )
        }
    ];

    const currentStep = steps[step];
    const isStepValid = step !== 2 || (username.trim().length > 0 && password.length > 0);

    return (
        <div className="fixed inset-0 bg-[#000] z-[60] flex items-center justify-center text-white bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl"></div>
            
            <div className={`relative w-[800px] bg-[#1a1a1a]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <div className="p-12 flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
                        <currentStep.icon size={32} />
                    </div>
                    <h2 className="text-3xl font-light mb-8">{currentStep.title}</h2>
                    <div className="w-full max-w-md text-left">
                        {currentStep.content}
                    </div>
                </div>
                
                <div className="h-20 bg-white/5 border-t border-white/10 flex items-center justify-between px-8">
                     <button className="text-sm text-white/60 hover:text-white transition-colors">Accessibility</button>
                     <div className="flex gap-4">
                        {step > 0 && <button className="px-6 py-2 rounded bg-white/10 hover:bg-white/20 transition-colors" onClick={() => setStep(s => s - 1)}>Back</button>}
                        <button 
                            onClick={nextStep} 
                            disabled={!isStepValid}
                            className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-500 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {step === 2 ? 'Finish' : 'Next'} <ArrowRight size={16} />
                        </button>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default function App() {
  const [systemState, setSystemState] = useState<SystemState>(SystemState.BOOTING);
  const [showBootText, setShowBootText] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  
  // File System State
  const [fileSystem, setFileSystem] = useState<FileSystem>(INITIAL_FILE_SYSTEM);

  // User Data State (Initialized from localStorage)
  const [username, setUsername] = useState(() => localStorage.getItem('win12_username') || 'User');
  const [savedPassword, setSavedPassword] = useState(() => localStorage.getItem('win12_password') || '');
  const [isSetupComplete, setIsSetupComplete] = useState(() => !!localStorage.getItem('win12_setup_complete'));

  // Background Image
  const [wallpaperUrl, setWallpaperUrl] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop");

  // Boot Effect
  useEffect(() => {
    if (systemState === SystemState.BOOTING) {
        setWindows([]);
        setStartOpen(false);
        setShowBootText(false);

        // Text fade in
        const textTimer = setTimeout(() => {
            setShowBootText(true);
        }, 500);

        // Complete boot
        const bootTimer = setTimeout(() => {
            // Check persistence to decide next screen
            if (isSetupComplete) {
                setSystemState(SystemState.LOGIN);
            } else {
                setSystemState(SystemState.SETUP);
            }
        }, 6000);

        return () => {
            clearTimeout(textTimer);
            clearTimeout(bootTimer);
        };
    }
  }, [systemState, isSetupComplete]);

  const handleSetupComplete = (name: string, pass: string) => {
      // Save to storage
      localStorage.setItem('win12_username', name);
      localStorage.setItem('win12_password', pass);
      localStorage.setItem('win12_setup_complete', 'true');
      
      // Update state
      setUsername(name);
      setSavedPassword(pass);
      setIsSetupComplete(true);
      
      // Go to desktop (mimicking Windows behavior of auto-login after setup)
      setSystemState(SystemState.DESKTOP);
  };

  const handleLogin = (pass: string) => {
      if (pass === savedPassword) {
          setSystemState(SystemState.DESKTOP);
          return true;
      }
      return false;
  };

  const handlePowerAction = (action: PowerAction) => {
      setStartOpen(false);
      switch(action) {
          case 'sleep':
              alert("Entering Sleep Mode... (Click to wake)");
              break;
          case 'shutdown':
              setSystemState(SystemState.SHUTDOWN);
              break;
          case 'restart':
              setSystemState(SystemState.BOOTING);
              break;
          case 'reset':
              // Clear storage
              localStorage.removeItem('win12_username');
              localStorage.removeItem('win12_password');
              localStorage.removeItem('win12_setup_complete');
              
              // Reset local state
              setUsername('User');
              setSavedPassword('');
              setIsSetupComplete(false);
              
              setSystemState(SystemState.BOOTING);
              break;
      }
  };

  const handleFileUpload = (files: File[], targetFolder: string = 'Downloads') => {
      const newFiles: VirtualFile[] = files.map(f => ({
          id: `f-${Date.now()}-${Math.random()}`,
          name: f.name,
          type: 'file',
          size: (f.size / 1024).toFixed(1) + ' KB',
          icon: f.type.startsWith('image/') ? ImageIcon : FileText,
          color: 'text-blue-400',
          url: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined
      }));

      setFileSystem(prev => ({
          ...prev,
          [targetFolder]: [...(prev[targetFolder] || []), ...newFiles]
      }));
  };

  const focusWindow = useCallback((id: string) => {
    setActiveWindowId(id);
    setWindows(prev => prev.map(w => 
      w.id === id 
        ? { ...w, zIndex: nextZIndex, isMinimized: false } 
        : w
    ));
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const launchApp = useCallback((appId: AppID) => {
    const appConfig = APPS.find(a => a.id === appId);
    if (!appConfig) return;

    // Check if instance already exists
    const existingWindow = windows.find(w => w.appId === appId);
    
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        setWindows(prev => prev.map(w => w.id === existingWindow.id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w));
        setNextZIndex(prev => prev + 1);
        setActiveWindowId(existingWindow.id);
      } else {
        focusWindow(existingWindow.id);
      }
      setStartOpen(false);
      return;
    }

    const newWindow: WindowState = {
      id: `${appId}-${Date.now()}`,
      appId,
      title: appConfig.name,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex,
      position: { 
          x: 100 + (windows.length * 30), 
          y: 80 + (windows.length * 30) 
      },
      size: { width: appConfig.defaultWidth, height: appConfig.defaultHeight }
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
    setNextZIndex(prev => prev + 1);
    setStartOpen(false); // Close start menu on launch
  }, [windows, nextZIndex, focusWindow]);

  const handleTaskbarClick = (appId: AppID) => {
    const existingWindow = windows.find(w => w.appId === appId);
    
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        setWindows(prev => prev.map(w => w.id === existingWindow.id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w));
        setNextZIndex(prev => prev + 1);
        setActiveWindowId(existingWindow.id);
      } else if (activeWindowId === existingWindow.id) {
        minimizeWindow(existingWindow.id);
      } else {
        focusWindow(existingWindow.id);
      }
    } else {
      launchApp(appId);
    }
    setStartOpen(false);
  };

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  }, [activeWindowId]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    if (activeWindowId === id) {
        setActiveWindowId(null);
    }
  }, [activeWindowId]);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    focusWindow(id);
  }, [focusWindow]);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position: { x, y } } : w));
  }, []);

  const resizeWindow = useCallback((id: string, width: number, height: number, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, size: { width, height }, position: { x, y } } : w));
  }, []);

  const openAppsMap = windows.reduce((acc, w) => {
    if (w.isOpen) acc[w.appId] = true;
    return acc;
  }, {} as Record<string, boolean>);

  const handleDesktopClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
          setStartOpen(false);
          setSelectedIcon(null);
      }
  };

  // --- Rendering based on SystemState ---

  if (systemState === SystemState.SHUTDOWN) {
      return (
          <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
              {/* Completely black screen simulating shutdown */}
          </div>
      );
  }

  if (systemState === SystemState.BOOTING) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center text-white cursor-wait select-none">
        <div className={`flex flex-col items-center gap-12 transition-opacity duration-1000 ${showBootText ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative">
             <div className="text-blue-500">
                <Grid size={80} strokeWidth={1.5} />
             </div>
          </div>
          <div className="w-8 h-8 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        
        <div className={`absolute bottom-16 text-center space-y-2 transition-all duration-1000 transform ${showBootText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-xl font-medium tracking-wide">Windows 12 Concept</h1>
            <p className="text-white text-sm font-light">an concept only. Not affiliated with Microsoft.</p>
        </div>
      </div>
    );
  }

  if (systemState === SystemState.SETUP) {
      return <SetupWizard onComplete={handleSetupComplete} />;
  }

  if (systemState === SystemState.LOGIN) {
      return <LoginScreen username={username} onLogin={handleLogin} />;
  }

  return (
    <div 
        className="relative w-screen h-screen overflow-hidden bg-cover bg-center text-white selection:bg-blue-500/30 font-sans animate-in fade-in duration-700 transition-all duration-1000"
        style={{ backgroundImage: `url(${wallpaperUrl})` }}
        onClick={handleDesktopClick}
    >
      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-0">
          {[
              { id: AppID.EXPLORER, name: 'This PC', icon: Folder, color: 'text-blue-200 fill-blue-500/80' },
              { id: AppID.BROWSER, name: 'Edge', icon: Chrome, color: 'text-blue-400 fill-blue-100' },
              { id: AppID.COPILOT, name: 'Copilot', icon: Bot, color: 'text-cyan-400' },
              { id: AppID.NOTEPAD, name: 'Notepad', icon: FileText, color: 'text-gray-200' },
              { id: AppID.SETTINGS, name: 'Settings', icon: Settings, color: 'text-gray-300' },
              { id: AppID.UPLOAD, name: 'Upload', icon: UploadCloud, color: 'text-indigo-300' }
          ].map(app => (
            <div 
                key={app.id}
                onClick={(e) => { e.stopPropagation(); setSelectedIcon(app.id); }}
                onDoubleClick={(e) => { e.stopPropagation(); launchApp(app.id); setSelectedIcon(null); }}
                className={`group flex flex-col items-center gap-1 p-2 w-24 rounded border border-transparent transition-colors cursor-default ${
                    selectedIcon === app.id ? 'bg-white/10 border-white/10 backdrop-blur-sm' : 'hover:bg-white/5 hover:border-white/5'
                }`}
            >
                <app.icon size={32} className={`${app.color} drop-shadow-lg`} />
                <span className={`text-xs text-white text-center drop-shadow-md font-medium text-shadow px-1 rounded ${selectedIcon === app.id ? '' : 'line-clamp-2'}`}>
                    {app.name}
                </span>
            </div>
          ))}
      </div>

      {/* Windows Layer */}
      {windows.map(win => {
        const appConfig = APPS.find(a => a.id === win.appId);
        if (!appConfig) return null;
        const AppComp = appConfig.component;
        
        // Pass necessary props based on app
        const commonProps = {
            username,
            currentWallpaper: wallpaperUrl,
            onWallpaperChange: setWallpaperUrl,
            fileSystem,
            setFileSystem,
            onUpload: handleFileUpload
        };

        return (
          <Window
            key={win.id}
            windowState={win}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onFocus={focusWindow}
            onMove={moveWindow}
            onResize={resizeWindow}
          >
            <AppComp {...commonProps} />
          </Window>
        );
      })}

      {/* UI Overlay Layer - Non-blocking container */}
      <div className="absolute inset-0 pointer-events-none z-50 flex flex-col justify-end">
          <StartMenu 
              isOpen={startOpen} 
              apps={APPS} 
              onLaunch={launchApp} 
              onClose={() => setStartOpen(false)}
              onPowerAction={handlePowerAction}
          />
          <Taskbar 
              apps={APPS} 
              openApps={openAppsMap} 
              activeApp={activeWindowId ? windows.find(w => w.id === activeWindowId)?.appId || null : null}
              onLaunch={handleTaskbarClick}
              onStartToggle={() => setStartOpen(!startOpen)}
              startOpen={startOpen}
          />
      </div>

    </div>
  );
}