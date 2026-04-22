import { useContext } from 'react';
import { AppContainerContext } from './AppContainerContext';

export const useAppContainer = () => {
  const ctx = useContext(AppContainerContext);
  if (!ctx) {
    throw new Error('AppContainerProvider no está configurado');
  }
  return ctx;
};
