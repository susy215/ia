import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, Zap } from 'lucide-react';

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
            {/* Mobile Bottom Banner - Sleek and elegant design */}
            <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
                <div className="relative">
                    {/* Backdrop blur overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/90 to-transparent backdrop-blur-xl"></div>

                    {/* Content */}
                    <div className="relative px-4 pt-4 pb-6">
                        {/* Decorative top border with gradient */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

                        {/* Main content container */}
                        <div className="relative">
                            {/* Close button - minimal and elegant */}
                            <button
                                onClick={handleDismiss}
                                className="absolute -top-2 right-0 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm border border-white/10"
                                aria-label="Cerrar"
                            >
                                <X className="w-3.5 h-3.5 text-white/60 hover:text-white" />
                            </button>

                            {/* Content flex container */}
                            <div className="flex items-center gap-4 pr-10">
                                {/* Icon with subtle glow */}
                                <div className="relative flex-shrink-0">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 rounded-2xl blur-lg"></div>
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <Smartphone className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                {/* Text content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-white font-bold text-sm">
                                            Instalar SmartCoop
                                        </h3>
                                        <Zap className="w-3.5 h-3.5 text-emerald-400" />
                                    </div>
                                    <p className="text-white/70 text-xs leading-tight">
                                        Acceso instantáneo desde tu pantalla de inicio
                                    </p>
                                </div>
                            </div>

                            {/* Install button - full width, elegant */}
                            <button
                                onClick={handleInstallClick}
                                disabled={isInstalling}
                                className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                            >
                                {/* Shine effect on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

                                {isInstalling ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span className="text-sm">Instalando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        <span className="text-sm">Instalar Aplicación</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Floating Button - Premium design */}
            <div className="hidden md:block fixed bottom-8 right-8 z-50">
                <div className="relative group">
                    {/* Animated gradient glow */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 animate-pulse"></div>

                    {/* Tooltip - sleek design */}
                    <div className="absolute bottom-full right-0 mb-4 w-80 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
                        <div className="bg-slate-800/95 backdrop-blur-xl text-white p-4 rounded-2xl shadow-2xl border border-white/10">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <Smartphone className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-base mb-1 flex items-center gap-2">
                                        Instalar SmartCoop
                                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                    </h4>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        Instala la aplicación para acceso rápido y funcionalidad offline
                                    </p>
                                </div>
                            </div>
                            {/* Arrow */}
                            <div className="absolute bottom-0 right-8 transform translate-y-1/2 rotate-45 w-3 h-3 bg-slate-800/95 border-r border-b border-white/10"></div>
                        </div>
                    </div>

                    {/* Main Button */}
                    <button
                        onClick={handleInstallClick}
                        disabled={isInstalling}
                        className="relative bg-gradient-to-br from-emerald-500 to-cyan-500 text-white p-5 rounded-full shadow-2xl hover:shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Instalar aplicación"
                    >
                        {isInstalling ? (
                            <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Download className="w-7 h-7 drop-shadow-lg" />
                        )}

                        {/* Pulse ring */}
                        <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping"></span>

                        {/* Notification badge */}
                        <div className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                            <Sparkles className="w-3 h-3" />
                        </div>
                    </button>

                    {/* Dismiss button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute -top-2 -left-2 bg-slate-800/90 backdrop-blur-sm text-white p-2 rounded-full shadow-lg hover:bg-slate-700 hover:scale-110 transition-all duration-200 border border-white/10"
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
