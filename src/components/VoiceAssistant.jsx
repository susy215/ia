import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, HelpCircle, Volume2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VoiceAssistant = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [status, setStatus] = useState('idle'); // idle, listening, processing, success, error
    const [isSupported, setIsSupported] = useState(true);
    const [showPanel, setShowPanel] = useState(false);
    const [feedback, setFeedback] = useState('');
    const recognitionRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if speech recognition is supported
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setIsSupported(false);
            return;
        }

        // Initialize speech recognition
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'es-ES';

        recognition.onstart = () => {
            setStatus('listening');
            setIsListening(true);
            setShowPanel(true);
            setFeedback('Escuchando...');
        };

        recognition.onresult = (event) => {
            const current = event.resultIndex;
            const transcriptText = event.results[current][0].transcript;
            setTranscript(transcriptText);

            // If final result, process command
            if (event.results[current].isFinal) {
                processCommand(transcriptText.toLowerCase());
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setStatus('error');
            setIsListening(false);

            if (event.error === 'no-speech') {
                setFeedback('No se detectó voz. Intenta de nuevo.');
            } else if (event.error === 'not-allowed') {
                setFeedback('Permiso de micrófono denegado.');
            } else {
                setFeedback('Error al reconocer voz.');
            }

            setTimeout(() => {
                setStatus('idle');
                setShowPanel(false);
            }, 3000);
        };

        recognition.onend = () => {
            setIsListening(false);
            if (status === 'listening') {
                setStatus('idle');
            }
        };

        recognitionRef.current = recognition;

        // Keyboard shortcut: Ctrl+Shift+V
        const handleKeyPress = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'V') {
                e.preventDefault();
                toggleListening();
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    const processCommand = (command) => {
        setStatus('processing');
        setFeedback('Procesando comando...');

        // Command mapping with fuzzy matching
        const commands = {
            dashboard: ['dashboard', 'inicio', 'principal', 'home'],
            reports: ['reportes', 'reporte', 'informes', 'informe'],
            smartFarming: ['agricultura inteligente', 'agricultura', 'farming', 'cultivos'],
            cropRecommendation: ['recomendación de cultivos', 'recomendar cultivos', 'qué cultivar', 'cultivo'],
            fertilization: ['fertilización', 'fertilizar', 'plan de fertilización', 'abono'],
            harvest: ['cosecha', 'estimación de cosecha', 'estimar cosecha', 'producción'],
            help: ['ayuda', 'ayúdame', 'qué puedes hacer', 'comandos', 'help'],
            close: ['cerrar', 'cancelar', 'salir', 'terminar']
        };

        let matched = false;

        // Check for navigation commands
        if (commands.dashboard.some(cmd => command.includes(cmd))) {
            navigate('/');
            setFeedback('✓ Navegando al Dashboard');
            setStatus('success');
            matched = true;
        } else if (commands.reports.some(cmd => command.includes(cmd))) {
            navigate('/reports');
            setFeedback('✓ Abriendo Reportes');
            setStatus('success');
            matched = true;
        } else if (commands.cropRecommendation.some(cmd => command.includes(cmd))) {
            navigate('/smart-farming/recommendation');
            setFeedback('✓ Abriendo Recomendación de Cultivos');
            setStatus('success');
            matched = true;
        } else if (commands.fertilization.some(cmd => command.includes(cmd))) {
            navigate('/smart-farming/fertilization');
            setFeedback('✓ Abriendo Plan de Fertilización');
            setStatus('success');
            matched = true;
        } else if (commands.harvest.some(cmd => command.includes(cmd))) {
            navigate('/smart-farming/harvest');
            setFeedback('✓ Abriendo Estimación de Cosecha');
            setStatus('success');
            matched = true;
        } else if (commands.help.some(cmd => command.includes(cmd))) {
            showHelp();
            matched = true;
        } else if (commands.close.some(cmd => command.includes(cmd))) {
            closeAssistant();
            matched = true;
        }

        if (!matched) {
            setStatus('error');
            setFeedback('❌ Comando no reconocido. Di "ayuda" para ver comandos disponibles.');
        }

        // Auto-close after success
        if (matched && !commands.help.some(cmd => command.includes(cmd))) {
            setTimeout(() => {
                setShowPanel(false);
                setStatus('idle');
                setTranscript('');
            }, 2000);
        }
    };

    const showHelp = () => {
        setStatus('success');
        setFeedback(`
📋 Comandos disponibles:
• "Ir a dashboard" - Página principal
• "Abrir reportes" - Ver reportes
• "Recomendación de cultivos"
• "Plan de fertilización"
• "Estimación de cosecha"
• "Cerrar" - Cerrar asistente
    `.trim());
    };

    const toggleListening = () => {
        if (!isSupported) {
            alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.');
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            setStatus('idle');
        } else {
            setTranscript('');
            setFeedback('');
            recognitionRef.current?.start();
        }
    };

    const closeAssistant = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        }
        setShowPanel(false);
        setStatus('idle');
        setTranscript('');
        setIsListening(false);
    };

    if (!isSupported) {
        return null; // Don't show if not supported
    }

    const getStatusColor = () => {
        switch (status) {
            case 'listening': return 'from-emerald-500 to-green-400';
            case 'processing': return 'from-amber-500 to-yellow-400';
            case 'success': return 'from-emerald-600 to-green-500';
            case 'error': return 'from-red-500 to-pink-500';
            default: return 'from-emerald-600 to-cyan-500'; // Changed from gray to emerald/cyan
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'listening': return <Mic className="w-6 h-6" />;
            case 'processing': return <Volume2 className="w-6 h-6 animate-pulse" />;
            case 'success': return <Sparkles className="w-6 h-6" />;
            case 'error': return <MicOff className="w-6 h-6" />;
            default: return <Mic className="w-6 h-6" />;
        }
    };

    return (
        <>
            {/* Transcript Panel */}
            {showPanel && (
                <div className="fixed bottom-32 right-4 md:bottom-24 md:right-24 z-40 w-80 md:w-96 animate-slide-up">
                    <div className="glass-card rounded-2xl p-4 shadow-2xl border border-white/10">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getStatusColor()} animate-pulse`}></div>
                                <span className="text-sm font-semibold text-text">Asistente de Voz</span>
                            </div>
                            <button
                                onClick={closeAssistant}
                                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                aria-label="Cerrar"
                            >
                                <X className="w-4 h-4 text-text-muted" />
                            </button>
                        </div>

                        {/* Transcript */}
                        {transcript && (
                            <div className="mb-3 p-3 bg-white/5 rounded-lg">
                                <p className="text-sm text-text-muted mb-1">Escuchado:</p>
                                <p className="text-base text-text font-medium">{transcript}</p>
                            </div>
                        )}

                        {/* Feedback */}
                        {feedback && (
                            <div className={`p-3 rounded-lg ${status === 'error' ? 'bg-red-500/10 border border-red-500/20' :
                                status === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20' :
                                    'bg-white/5'
                                }`}>
                                <p className="text-sm text-text whitespace-pre-line">{feedback}</p>
                            </div>
                        )}

                        {/* Waveform animation when listening */}
                        {status === 'listening' && (
                            <div className="flex items-center justify-center gap-1 mt-3 h-12">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-1 bg-gradient-to-t from-emerald-500 to-green-400 rounded-full animate-waveform"
                                        style={{
                                            animationDelay: `${i * 0.1}s`,
                                            height: '100%'
                                        }}
                                    ></div>
                                ))}
                            </div>
                        )}

                        {/* Help hint */}
                        {status === 'idle' && !transcript && (
                            <div className="mt-3 flex items-start gap-2 text-xs text-text-muted">
                                <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <p>Di "ayuda" para ver comandos disponibles</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Floating Microphone Button */}
            <div className="fixed bottom-8 right-24 md:right-32 z-50">
                <div className="relative group">
                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${getStatusColor()} rounded-full blur-xl opacity-60 transition-opacity ${isListening ? 'animate-pulse opacity-80' : ''
                        }`}></div>

                    {/* Main Button */}
                    <button
                        onClick={toggleListening}
                        className={`relative bg-gradient-to-r ${getStatusColor()} text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group-hover:rotate-12`}
                        aria-label={isListening ? 'Detener grabación' : 'Activar asistente de voz'}
                        title="Asistente de Voz (Ctrl+Shift+V)"
                    >
                        {getStatusIcon()}

                        {/* Pulse ring when listening */}
                        {isListening && (
                            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30"></span>
                        )}

                        {/* Recording indicator */}
                        {isListening && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
                        )}
                    </button>

                    {/* Tooltip */}
                    <div className="absolute bottom-full right-0 mb-3 w-48 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-xs">
                        <p className="font-semibold mb-1">Asistente de Voz</p>
                        <p className="text-gray-300">Click o Ctrl+Shift+V</p>
                        <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VoiceAssistant;
