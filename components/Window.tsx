import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { WindowState } from '../types';

interface WindowProps {
  windowState: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number, x: number, y: number) => void;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({
  windowState,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  onResize,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState<string | null>(null);
  
  // These refs store the initial state at the start of a drag/resize
  // We use refs instead of state for start positions to avoid stale closures in the effect
  const startPos = useRef({ x: 0, y: 0 });
  const startWindowPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });
  
  const windowRef = useRef<HTMLDivElement>(null);

  // Drag Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowState.isMaximized || (e.target as HTMLElement).closest('button')) return;
    onFocus(windowState.id);
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    startWindowPos.current = { x: windowState.position.x, y: windowState.position.y };
  };

  // Resize Start Logic
  const handleResizeStart = (e: React.MouseEvent, dir: string) => {
    e.stopPropagation();
    e.preventDefault();
    onFocus(windowState.id);
    setIsResizing(true);
    setResizeDir(dir);
    startPos.current = { x: e.clientX, y: e.clientY };
    startSize.current = { width: windowState.size.width, height: windowState.size.height };
    startWindowPos.current = { x: windowState.position.x, y: windowState.position.y };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;
        onMove(windowState.id, startWindowPos.current.x + dx, startWindowPos.current.y + dy);
      }

      if (isResizing && resizeDir) {
        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;
        
        let newWidth = startSize.current.width;
        let newHeight = startSize.current.height;
        let newX = startWindowPos.current.x;
        let newY = startWindowPos.current.y;

        const minWidth = 300;
        const minHeight = 200;

        if (resizeDir.includes('e')) {
          newWidth = Math.max(minWidth, startSize.current.width + dx);
        }
        if (resizeDir.includes('w')) {
          const w = Math.max(minWidth, startSize.current.width - dx);
          // Only update X if width actually changed (not hitting min width)
          if (w !== startSize.current.width) {
              newX = startWindowPos.current.x + (startSize.current.width - w);
              newWidth = w;
          }
        }
        if (resizeDir.includes('s')) {
          newHeight = Math.max(minHeight, startSize.current.height + dy);
        }
        if (resizeDir.includes('n')) {
          const h = Math.max(minHeight, startSize.current.height - dy);
          if (h !== startSize.current.height) {
              newY = startWindowPos.current.y + (startSize.current.height - h);
              newHeight = h;
          }
        }

        onResize(windowState.id, newWidth, newHeight, newX, newY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDir(null);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, resizeDir, onMove, onResize, windowState.id]);

  if (!windowState.isOpen || windowState.isMinimized) return null;

  const style: React.CSSProperties = windowState.isMaximized
    ? {
        top: 0,
        left: 0,
        width: '100vw',
        height: 'calc(100vh - 3rem)', // Leave space for taskbar
        zIndex: windowState.zIndex,
        borderRadius: 0,
      }
    : {
        top: windowState.position.y,
        left: windowState.position.x,
        width: windowState.size.width,
        height: windowState.size.height,
        zIndex: windowState.zIndex,
      };

  return (
    <div
      ref={windowRef}
      className={`fixed flex flex-col bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-75 ${
        windowState.isMaximized ? '' : 'rounded-xl'
      }`}
      style={style}
      onMouseDown={() => onFocus(windowState.id)}
    >
      {/* Resize Handles */}
      {!windowState.isMaximized && (
        <>
          <div className="absolute top-0 left-0 w-full h-1 cursor-n-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'n')} />
          <div className="absolute bottom-0 left-0 w-full h-1 cursor-s-resize z-50" onMouseDown={(e) => handleResizeStart(e, 's')} />
          <div className="absolute top-0 left-0 h-full w-1 cursor-w-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'w')} />
          <div className="absolute top-0 right-0 h-full w-1 cursor-e-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'e')} />
          <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'nw')} />
          <div className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'ne')} />
          <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'sw')} />
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'se')} />
        </>
      )}

      {/* Title Bar */}
      <div
        className="h-10 flex items-center justify-between px-4 bg-white/5 select-none cursor-default shrink-0"
        onMouseDown={handleMouseDown}
        onDoubleClick={() => onMaximize(windowState.id)}
      >
        <div className="text-sm font-medium text-white/90 truncate flex items-center gap-2">
            {windowState.title}
        </div>
        <div className="flex items-center space-x-2 z-50">
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(windowState.id); }}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMaximize(windowState.id); }}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
          >
            {windowState.isMaximized ? <Square size={12} /> : <Maximize2 size={12} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(windowState.id); }}
            className="p-1.5 hover:bg-red-500/80 rounded-full transition-colors text-white/70 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {children}
      </div>
    </div>
  );
};