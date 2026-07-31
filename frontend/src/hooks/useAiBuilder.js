import { useContext } from 'react';
import { AiBuilderContext } from '../context/AiBuilderContext';

export const useAiBuilder = () => useContext(AiBuilderContext);
