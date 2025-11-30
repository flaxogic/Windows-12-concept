import React from 'react';
import { LucideIcon } from 'lucide-react';

export enum AppID {
  COPILOT = 'copilot',
  EXPLORER = 'explorer',
  BROWSER = 'browser',
  SETTINGS = 'settings',
  NOTEPAD = 'notepad',
  CALCULATOR = 'calculator',
  PHOTOS = 'photos',
  UPLOAD = 'upload'
}

export enum SystemState {
  BOOTING = 'booting',
  SETUP = 'setup',
  LOGIN = 'login',
  DESKTOP = 'desktop',
  SHUTDOWN = 'shutdown'
}

export type PowerAction = 'sleep' | 'shutdown' | 'restart' | 'reset';

export interface WindowState {
  id: string;
  appId: AppID;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface AppConfig {
  id: AppID;
  name: string;
  icon: LucideIcon;
  component: React.ComponentType<any>;
  defaultWidth: number;
  defaultHeight: number;
  color: string;
}

export interface DragPosition {
  x: number;
  y: number;
}

export interface VirtualFile {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'drive';
  icon?: any; // LucideIcon
  color?: string;
  content?: string; // For text files
  url?: string; // For images/media
  size?: string;
  date?: string;
}

export type FileSystem = Record<string, VirtualFile[]>;