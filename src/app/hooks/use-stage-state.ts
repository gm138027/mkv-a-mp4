import { useReducer } from 'react';
import { stageReducer, type StageState } from '@/app/state';

const initialState: StageState = {
  videos: [],
  activeStage: 'upload',
};

export const useStageState = () => {
  const [state, dispatch] = useReducer(stageReducer, initialState);
  return { state, dispatch };
};
