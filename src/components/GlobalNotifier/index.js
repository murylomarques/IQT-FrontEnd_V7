import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const POLL_INTERVAL = 5000;

const GlobalNotifier = () => {
  const { user, apiFetch } = useAuth();
  const location = useLocation();

  const initializedRef = useRef(false);
  const lastNotificationIdRef = useRef(0);
  const audioContextRef = useRef(null);
  const audioUnlockedRef = useRef(false);

  const ensureAudioUnlocked = () => {
    if (audioUnlockedRef.current) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new Ctx();
      }

      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      audioUnlockedRef.current = true;
    } catch (error) {
      // sem bloqueio de fluxo
    }
  };

  const playNotificationSound = () => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new Ctx();
      }

      const ctx = audioContextRef.current;

      if (ctx.state === 'suspended') {
        // em alguns navegadores isso depende de gesto do usuario
        return;
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(1320, ctx.currentTime + 0.08);

      gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.22);
    } catch (error) {
      // sem bloqueio de fluxo
    }
  };

  useEffect(() => {
    const unlock = () => ensureAudioUnlocked();
    window.addEventListener('click', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });

    return () => {
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return undefined;

    let mounted = true;

    const pollLatestNotification = async () => {
      try {
        // Se estiver na tela de mensagens, quem cuida dos alerts e refresh e a propria tela.
        if (location.pathname === '/mensagens') return;

        const data = await apiFetch('/api/notifications?limit=1');
        if (!mounted) return;

        const latest = Array.isArray(data) && data.length > 0 ? data[0] : null;
        const latestId = Number(latest?.id || 0);

        if (!initializedRef.current) {
          initializedRef.current = true;
          lastNotificationIdRef.current = latestId;
          return;
        }

        if (latestId > lastNotificationIdRef.current) {
          const title = latest?.title || 'Nova notificacao';
          const body = latest?.body || 'Voce recebeu um novo aviso.';

          toast.info(`${title}: ${body}`);
          playNotificationSound();

          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body });
          }
        }

        lastNotificationIdRef.current = latestId;
      } catch (error) {
        // sem ruido de toast no polling global
      }
    };

    // tenta pedir permissao de notificacao sem interromper fluxo
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    pollLatestNotification();
    const intervalId = window.setInterval(pollLatestNotification, POLL_INTERVAL);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
      initializedRef.current = false;
      lastNotificationIdRef.current = 0;
    };
  }, [user?.id, apiFetch, location.pathname]);

  return null;
};

export default GlobalNotifier;

