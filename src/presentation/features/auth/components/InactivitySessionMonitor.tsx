import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppContainer } from '../../../../infrastructure/di/useAppContainer';
import { useAuth } from '../context/useAuth';

const INACTIVITY_MS = 60 * 60 * 1000;
const CHECK_INTERVAL_MS = 30 * 1000;
const ACTIVITY_THROTTLE_MS = 2_000;

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
  'click',
  'mousemove',
];

export const InactivitySessionMonitor = () => {
  const { isAuthenticated, logout } = useAuth();
  const { session } = useAppContainer();
  const navigate = useNavigate();
  const lastRecordedInteraction = useRef(0);

  const checkExpired = useCallback(() => {
    if (!session.getToken() && !session.getRefreshToken()) return;

    const last = session.getLastActivityAt();
    if (last === null) {
      session.touchActivity();
      return;
    }

    if (Date.now() - last > INACTIVITY_MS) {
      logout();
      toast.info('Sesión cerrada por inactividad (más de 1 hora sin uso).');
      navigate('/login', { replace: true });
    }
  }, [logout, navigate, session]);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (session.getLastActivityAt() === null) {
      session.touchActivity();
    }

    checkExpired();

    const onActivity = () => {
      const now = Date.now();
      if (now - lastRecordedInteraction.current < ACTIVITY_THROTTLE_MS) return;
      lastRecordedInteraction.current = now;
      session.touchActivity();
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') checkExpired();
    };

    const intervalId = window.setInterval(checkExpired, CHECK_INTERVAL_MS);

    for (const ev of ACTIVITY_EVENTS) {
      window.addEventListener(ev, onActivity, { passive: true });
    }
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearInterval(intervalId);
      for (const ev of ACTIVITY_EVENTS) {
        window.removeEventListener(ev, onActivity);
      }
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [isAuthenticated, checkExpired, session]);

  return null;
};
