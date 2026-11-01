export type AspectRatioType = '16:9' | '9:16' | '1:1';
export type VideoDurationType = '5s' | '10s';
export type ResolutionType = '360p' | '720p' | '1080p';

export type VideoFormatType = 'short' | 'story';
export type VideoCategoryType =
  | 'Edukasi'
  | 'Informasi'
  | 'Hiburan'
  | 'Sinematik Fiksi'
  | 'Komersial & Promosi'
  | 'Misteri & Horor'
  | 'Motivasi & Cerita';

export interface CameraSpecs {
  lens: string;
  movement: string;
  lighting: string;
  colorPalette: string;
  fps: string;
}

export interface StoryboardShot {
  shotNumber: number;
  shotType: string;
  description: string;
  cameraMove: string;
  mood: string;
  videoUrl?: string;
  isGenerating?: boolean;
}

export interface DirectorResult {
  title: string;
  directorNotes: string;
  cinematicPrompt: string;
  storyboardShots: StoryboardShot[];
  cameraSpecs: CameraSpecs;
  suggestedVoiceover: string;
  soundDesign: string;
}

export interface BrainstormIdea {
  id: string;
  title: string;
  hook: string;
  angleDescription: string;
  visualMood: string;
  recommendedStyle: string;
}

export interface ScriptOption {
  id: string;
  title: string;
  toneLabel: string;
  hook: string;
  body: string;
  callToAction: string;
  fullVoiceover: string;
  estimatedWordCount: number;
}

export interface StoryboardScene {
  sceneNumber: number;
  shotType: string;
  sceneAction: string;
  voiceoverSegment: string;
  cameraMotion: string;
  cameraSpecs: {
    lens: string;
    lighting: string;
    speed: string;
  };
  masterVideoPrompt: string;
  duration?: string;
  videoUrl?: string;
  videoBase64?: string;
  isGenerating?: boolean;
}

export interface StoryboardPackage {
  title: string;
  overallVision: string;
  scenes: StoryboardScene[];
}

export interface ProjectData {
  version: string;
  projectId: string;
  projectName: string;
  createdAt: number;
  updatedAt: number;
  theme: string;
  format: VideoFormatType;
  category: VideoCategoryType;
  aspectRatio: AspectRatioType;
  sceneCount: number;
  visualStyle: string;
  chosenIdea?: BrainstormIdea | null;
  chosenScript?: ScriptOption | null;
  storyboard?: StoryboardPackage | null;
  currentStep: number;
  renderedVideos?: VideoItem[];
}

export interface VideoItem {
  id: string;
  title: string;
  prompt: string;
  aspectRatio: AspectRatioType;
  duration: VideoDurationType;
  resolution: ResolutionType;
  videoUrl: string;
  thumbnail?: string;
  genre: string;
  createdAt: number;
  directorNotes?: string;
  cameraSpecs?: CameraSpecs;
  soundtrackCues?: string;
  voiceover?: string;
  voiceoverAudioUrl?: string;
  interactionId?: string;
  isCustom?: boolean;
  sceneNumber?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  suggestedPrompt?: string;
}

export interface GenerationSettings {
  aspectRatio: AspectRatioType;
  duration: VideoDurationType;
  resolution: ResolutionType;
  style: string;
  cameraMotion: string;
  genre: string;
}
