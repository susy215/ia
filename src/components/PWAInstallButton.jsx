import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Check } from 'lucide-react';

const PWAInstallButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isInstalling, setIsInstalling] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Listen for the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            setDeferredPrompt(e);
            // Show install button
            setShowInstallPrompt(true);
        };

        // Listen for successful installation
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setShowInstallPrompt(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        setIsInstalling(true);

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            setIsInstalled(true);
        } else {
            console.log('User dismissed the install prompt');
        }

        // Clear the deferredPrompt
        setDeferredPrompt(null);
        setIsInstalling(false);
        setShowInstallPrompt(false);
    };

    const handleDismiss = () => {
        setShowInstallPrompt(false);
        // Store dismissal in localStorage to not show again for a while
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    };

    // Don't show if installed or dismissed recently
    useEffect(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed) {
            const dismissedTime = parseInt(dismissed);
            const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
            if (daysSinceDismissed < 7) {
                setShowInstallPrompt(false);
            }
        }
    }, []);

    if (isInstalled) {
        return null;
    }

    if (!showInstallPrompt) {
        return null;
    }

    return (
        <>
            {/* Mobile Bottom Banner */}
            <div className="fixed bottom-20 left-0 right-0 z-50 md:hidden animate-slide-up">
                <div className="mx-4 mb-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="relative p-4">
                        {/* Close button */}
                        <button
                            onClick={handleDismiss}
                            className="absolute top-2 right-2 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            aria-label="Cerrar"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>

                        <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div className="flex-shrink-0 w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                <Smartphone className="w-8 h-8 text-emerald-600" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-bold text-base mb-1">
                                    Instalar SmartCoop
                                </h3>
                                <p className="text-white/90 text-sm">
                                    Acceso rápido desde tu pantalla de inicio
                                </p>
                            </div>
                        </div>

                        {/* Install Button */}
                        <button
                            onClick={handleInstallClick}
                            disabled={isInstalling}
                            className="mt-4 w-full bg-white text-emerald-600 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isInstalling ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                                    <span>Instalando...</span>
                                </>
                            ) : (
                                <>
                                    <Download className="w-5 h-5" />
                                    <span>Instalar Ahora</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop Floating Button */}
            <div className="hidden md:block fixed bottom-8 right-8 z-50 animate-bounce-slow">
                <div className="relative">
                    {/* Tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 w-64 bg-slate-800 text-white p-4 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="flex items-start gap-3">
                            <Smartphone className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-sm mb-1">Instalar SmartCoop</h4>
                                <p className="text-xs text-gray-300">
                                    Instala la app para acceso rápido y funcionalidad offline
                                </p>
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800"></div>
                    </div>

                    {/* Button */}
                    <button
                        onClick={handleInstallClick}
                        disabled={isInstalling}
                        className="group relative bg-gradient-to-r from-emerald-500 to-cyan-500 text-white p-4 rounded-full shadow-2xl hover:shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Instalar aplicación"
                    >
                        {isInstalling ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Download className="w-6 h-6" />
                        )}

                        {/* Pulse animation ring */}
                        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20"></span>
                    </button>

                    {/* Dismiss button for desktop */}
                    <button
                        onClick={handleDismiss}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                        aria-label="Cerrar"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </>
    );
};

export default PWAInstallButton;
