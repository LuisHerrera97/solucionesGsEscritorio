import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { createAppContainer } from './appContainer';
import { AppContainerContext } from './AppContainerContext';

export const AppContainerProvider = ({ children }: { children: ReactNode }) => {
  const container = useMemo(() => createAppContainer(), []);
  return <AppContainerContext.Provider value={container}>{children}</AppContainerContext.Provider>;
};
