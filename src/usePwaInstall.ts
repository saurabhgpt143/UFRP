import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Check if running in standalone PWA mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('[UFRP PWA] App successfully installed!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPwa = async () => {
    if (!deferredPrompt) {
      // If browser doesn't expose native prompt, inform user or trigger native install hint
      alert('To install UFRP PWA:\n• On Chrome/Edge: Click the Install button in your browser address bar.\n• On iOS Safari: Tap Share -> "Add to Home Screen".');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('[UFRP PWA] User accepted the install prompt');
        setIsInstalled(true);
        setIsInstallable(false);
      } else {
        console.log('[UFRP PWA] User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('[UFRP PWA] Installation error:', err);
    }
  };

  return { isInstallable, isInstalled, installPwa };
}
