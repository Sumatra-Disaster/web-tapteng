'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Download, Share, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect iOS
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(iOS);

    // Check if app is already installed
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');
    setIsStandalone(standalone);

    if (standalone) {
      setIsInstalled(true);
      return;
    }

    // For iOS, show manual install instructions after a delay
    if (iOS && !standalone) {
      // Check localStorage to see if user has dismissed (expires after 7 days)
      // Note: In incognito mode, localStorage might not be available or is cleared
      try {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed) {
          const dismissedTime = parseInt(dismissed, 10);
          const daysSinceDismissal = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
          if (daysSinceDismissal < 7) {
            return; // Still within dismissal period
          } else {
            // Clear old dismissal
            localStorage.removeItem('pwa-install-dismissed');
          }
        }
      } catch {
        // localStorage might not be available in strict private browsing
        // Continue to show the prompt anyway
        console.log('localStorage not available, showing prompt anyway');
      }
      // Show after 3 seconds
      setTimeout(() => {
        setShowInstallButton(true);
      }, 3000);
    }

    // Listen for the beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt (Android/Chrome)
      await deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsInstalled(true);
        setShowInstallButton(false);
      } else {
        console.log('User dismissed the install prompt');
      }

      // Clear the deferredPrompt
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
    // Remember dismissal for 7 days (won't persist in incognito mode)
    try {
      localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    } catch {
      // localStorage might not be available in strict private browsing
      // That's okay, the prompt will show again next time
      console.log('Could not save dismissal to localStorage');
    }
  };

  // Don't show if already installed
  if (isInstalled || isStandalone) {
    return null;
  }

  // Show install button if available
  if (!showInstallButton) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4">
      <div className="mx-auto max-w-sm rounded-lg border bg-background p-4 shadow-lg">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {isIOS ? (
                <Share className="h-5 w-5 text-primary" />
              ) : (
                <Download className="h-5 w-5 text-primary" />
              )}
              <p className="text-sm font-semibold">Install Aplikasi</p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Tutup"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {isIOS
              ? 'Ketuk tombol Share, lalu pilih "Tambahkan ke Layar Utama" untuk menginstall aplikasi.'
              : 'Pasang aplikasi untuk akses lebih cepat dan pengalaman yang lebih baik'}
          </p>
          {!isIOS && (
            <div className="flex gap-2">
              <Button onClick={handleInstallClick} className="flex-1" size="sm">
                Install Sekarang
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDismiss}>
                Nanti
              </Button>
            </div>
          )}
          {isIOS && (
            <Button variant="ghost" size="sm" onClick={handleDismiss} className="w-full">
              Tutup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
