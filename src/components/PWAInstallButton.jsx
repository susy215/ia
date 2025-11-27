import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Check, Sparkles } from 'lucide-react';

const PWAInstallButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isInstalling, setIsInstalling] = useState(false);
    const [showBanner, setShowBanner] = useState(true);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true) {
            setIsInstalled(true);
            setShowBanner(false);
            return;
        }

        // Check if user dismissed the banner
        const dismissed = localStorage.getItem('pwa-banner-dismissed');
        if (dismissed === 'true') {
            setShowBanner(false);
        }

        // Listen for the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        // Listen for successful installation
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setShowBanner(false);
            localStorage.setItem('pwa-installed', 'true');
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            setIsInstalling(true);

            // Show the install prompt
            deferredPrompt.prompt();

            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                setIsInstalled(true);
                setShowBanner(false);
                localStorage.setItem('pwa-installed', 'true');
            }

            setDeferredPrompt(null);
            setIsInstalling(false);
        } else {
            // Fallback: Show instructions for manual installation
            showInstallInstructions();
        }
    };

    const showInstallInstructions = () => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);

        let message = '';
        if (isIOS) {
            message = 'Para instalar:\n1. Toca el botón "Compartir" 📤\n2. Selecciona "Agregar a pantalla de inicio"';
        } else if (isAndroid) {
            message = 'Para instalar:\n1. Toca el menú (⋮)\n2. Selecciona "Instalar aplicación"';
        } else {
            message = 'Para instalar:\n1. Haz clic en el icono de instalación en la barra de direcciones\n2. O usa el menú del navegador';
        }

        alert(message);
    };

    const handleDismiss = () => {
        setShowBanner(false);
        localStorage.setItem('pwa-banner-dismissed', 'true');
    };

    // Don't show if already installed
    if (isInstalled) {
        return null;
    }

    // Don't show if dismissed
    if (!showBanner) {
        return null;
    }

    return (
        <>
            {/* Mobile Bottom Banner - Always visible until dismissed */}
            <div className="fixed bottom-20 left-0 right-0 z-50 md:hidden animate-slide-up">
                <div className="mx-4 mb-4 relative">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>

                    {/* Main card */}
                    <div className="relative bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl shadow-2xl overflow-hidden">
                        <div className="relative p-4">
                            {/* Sparkle decoration */}
                            <div className="absolute top-2 left-2 text-white/30">
                                <Sparkles className="w-4 h-4" />
                            </div>

                            {/* Close button */}
                            <button
                                onClick={handleDismiss}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
                                aria-label="Cerrar"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>

                            <div className="flex items-center gap-4 mt-2">
                                {/* Icon */}
                                <div className="flex-shrink-0 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform">
                                    <Smartphone className="w-9 h-9 text-emerald-600" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                                        Instalar SmartCoop
                                        <Sparkles className="w-4 h-4" />
                                    </h3>
                                    <p className="text-white/95 text-sm leading-tight">
                                        Acceso rápido y funciona sin conexión
                                    </p>
                                </div>
                            </div>

                            {/* Install Button */}
                            <button
                                onClick={handleInstallClick}
                                disabled={isInstalling}
                                className="mt-4 w-full bg-white text-emerald-600 font-bold py-3.5 px-4 rounded-xl hover:bg-gray-50 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isInstalling ? (
                                    <>
                                        <div className="w-5 h-5 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                                        <span>Instalando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-5 h-5" />
                                        <span>Instalar Aplicación</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Floating Button - Always visible until dismissed */}
            <div className="hidden md:block fixed bottom-8 right-8 z-50">
                <div className="relative group">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity animate-pulse"></div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full right-0 mb-4 w-72 bg-slate-800 text-white p-4 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform group-hover:translate-y-0 translate-y-2">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                <Smartphone className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-base mb-1 flex items-center gap-2">
                                    Instalar SmartCoop
                                    <Sparkles className="w-3 h-3 text-emerald-400" />
                                </h4>
                                <p className="text-sm text-gray-300 leading-snug">
                                    Instala la app para acceso rápido desde tu escritorio y funcionalidad offline
                                </p>
                            </div>
                        </div>
                        {/* Arrow */}
                        <div className="absolute bottom-0 right-8 transform translate-y-1/2 rotate-45 w-3 h-3 bg-slate-800"></div>
                    </div>

                    {/* Main Button */}
                    <button
                        onClick={handleInstallClick}
                        disabled={isInstalling}
                        className="relative bg-gradient-to-r from-emerald-500 to-cyan-500 text-white p-5 rounded-full shadow-2xl hover:shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group-hover:rotate-12"
                        aria-label="Instalar aplicación"
                    >
                        {isInstalling ? (
                            <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Download className="w-7 h-7 drop-shadow-lg" />
                        )}

                        {/* Pulse animation ring */}
                        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20"></span>

                        {/* Badge */}
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-bounce">
                            !
                        </div>
                    </button>

                    {/* Dismiss button for desktop */}
                    <button
                        onClick={handleDismiss}
                        className="absolute -top-2 -left-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 hover:scale-110 transition-all duration-200 z-10"
                        aria-label="Cerrar"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </>
    );
};

export default PWAInstallButton;
