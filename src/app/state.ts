export type StageKey = 'upload' | 'list' | 'progress' | 'download';

export type UploadState = 'idle' | 'ready' | 'reading' | 'processing' | 'completed' | 'failed';

export interface VideoItem {
  id: string;
  taskId?: string;  // ✅ 任务 ID（用于字幕探测）
  name: string;
  sizeMb: number;
  state: UploadState;
  message?: string;
  progress?: number;
  downloadUrl?: string | null;
}

export interface StageState {
  videos: VideoItem[];
  activeStage: StageKey;
}

export type StageAction =
  | { type: 'RESET' }
  | { type: 'SET_STAGE'; stage: StageKey }
  | { type: 'ADD_VIDEO'; video: VideoItem }
  | { type: 'UPDATE_VIDEO'; id: string; patch: Partial<VideoItem> }
  | { type: 'REMOVE_VIDEO'; id: string }
  | { type: 'SET_PROGRESS'; id: string; progress: number };

export const stageReducer = (state: StageState, action: StageAction): StageState => {
  switch (action.type) {
    case 'RESET':
      return {
        videos: [],
        activeStage: 'upload',
      };
    case 'SET_STAGE':
      return {
        ...state,
        activeStage: action.stage,
      };
    case 'ADD_VIDEO':
      return {
        ...state,
        videos: [...state.videos, action.video],
      };
    case 'UPDATE_VIDEO':
      return {
        ...state,
        videos: state.videos.map((video) =>
          video.id === action.id
            ? {
                ...video,
                ...action.patch,
              }
            : video
        ),
      };
    case 'REMOVE_VIDEO':
      return {
        ...state,
        videos: state.videos.filter((video) => video.id !== action.id),
      };
    case 'SET_PROGRESS':
      return {
        ...state,
        videos: state.videos.map((video) =>
          video.id === action.id
            ? {
                ...video,
                progress: action.progress,
              }
            : video
        ),
      };
    default:
      return state;
  }
};
