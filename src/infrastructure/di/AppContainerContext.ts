import { createContext } from 'react';
import type { AppContainer } from './appContainer';

export const AppContainerContext = createContext<AppContainer | null>(null);
