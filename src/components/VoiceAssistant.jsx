import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Volume2, Sparkles, ChevronRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function VoiceAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');
    const [commandHistory, setCommandHistory] = useState([]);
    const recognitionRef = useRef(null);
    const navigate = useNavigate();

    // Get API URL from environment variable
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true; // Enable interim results
            recognitionRef.current.lang = 'es-ES';
            recognitionRef.current.maxAlternatives = 3;

            recognitionRef.current.onresult = (event) => {
                let interim = '';
                let final = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        final += transcript;
                    } else {
                        interim += transcript;
                    }
                }

                setInterimTranscript(interim);

                if (final) {
                    const text = final.toLowerCase().trim();
                    setTranscript(text);
                    setInterimTranscript('');
                    processCommand(text);
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);

                let errorMessage = '';
                switch (event.error) {
                    case 'no-speech':
                        errorMessage = 'No detecté ningún sonido. Intenta de nuevo.';
                        break;
                    case 'audio-capture':
                        errorMessage = 'No se pudo acceder al micrófono.';
                        break;
                    case 'not-allowed':
                        errorMessage = 'Permiso de micrófono denegado.';
                        break;
                    default:
                        errorMessage = 'Error al procesar el audio.';
                }

                setError(errorMessage);
                setTimeout(() => setError(''), 3000);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
                setInterimTranscript('');
            };
        }

        // Load command history from localStorage
        const savedHistory = localStorage.getItem('voice-command-history');
        if (savedHistory) {
            setCommandHistory(JSON.parse(savedHistory));
        }
    }, []);

    const processCommand = (text) => {
        let responseText = '';
        let action = null;
        let commandMatched = false;

        // Navigation commands
        if (text.match(/\b(ir a|abrir|mostrar|ver)\s*(inicio|dashboard|principal|home)\b/i)) {
            responseText = 'Navegando al dashboard principal';
            action = () => navigate('/');
            commandMatched = true;
        }
        else if (text.match(/\b(ir a|abrir|mostrar|ver)\s*(recomendación|recomendaciones|siembra|cultivo|sembrar)\b/i)) {
            responseText = 'Abriendo recomendación de cultivos';
            action = () => navigate('/smart-farming/recommendation');
            commandMatched = true;
        }
        else if (text.match(/\b(ir a|abrir|mostrar|ver)\s*(fertilización|fertilizante|fertilizar|plan de fertilización)\b/i)) {
            responseText = 'Abriendo plan de fertilización inteligente';
            action = () => navigate('/smart-farming/fertilization');
            commandMatched = true;
        }
        else if (text.match(/\b(ir a|abrir|mostrar|ver)\s*(cosecha|estimación|estimar cosecha|producción)\b/i)) {
            responseText = 'Abriendo estimación de cosecha';
            action = () => navigate('/smart-farming/harvest');
            commandMatched = true;
        }
        else if (text.match(/\b(ir a|abrir|mostrar|ver)\s*(reporte|reportes|informes)\b/i)) {
            responseText = 'Abriendo sección de reportes';
            action = () => navigate('/reports');
            commandMatched = true;
        }
        // Export commands
        else if (text.match(/\b(exportar|descargar|generar)\s*(reporte)?\s*(gerencial|general)\s*(en)?\s*(excel|xlsx)\b/i)) {
            responseText = 'Generando reporte gerencial en Excel';
            action = () => downloadReport('gerencial');
            commandMatched = true;
        }
        else if (text.match(/\b(exportar|descargar|generar)\s*(reporte)?\s*(gerencial|general)?\s*(en)?\s*pdf\b/i)) {
            responseText = 'Generando reporte gerencial en PDF';
            action = () => downloadReport('gerencial-pdf');
            commandMatched = true;
        }
        else if (text.match(/\b(exportar|descargar|generar)\s*(reporte de)?\s*préstamos?\b/i)) {
            responseText = 'Generando reporte de préstamos';
            action = () => downloadReport('prestamos');
            commandMatched = true;
        }
        else if (text.match(/\b(exportar|descargar|generar)\s*(reporte de)?\s*alertas?\b/i)) {
            responseText = 'Generando reporte de alertas de riesgo';
            action = () => downloadReport('alertas');
            commandMatched = true;
        }
        // Help command
        else if (text.match(/\b(ayuda|comandos|qué puedo decir|opciones)\b/i)) {
            responseText = 'Puedes pedirme que navegue a diferentes secciones o que exporte reportes. Revisa la lista de comandos disponibles.';
            commandMatched = true;
        }
        // Default
        else {
            responseText = 'No reconocí ese comando. Intenta: "ir a inicio", "abrir reportes", o "exportar excel"';
        }

        setResponse(responseText);
        speak(responseText);

        // Save to history
        if (commandMatched) {
            const newHistory = [
                { text, response: responseText, timestamp: new Date().toISOString() },
                ...commandHistory.slice(0, 4) // Keep last 5 commands
            ];
            setCommandHistory(newHistory);
            localStorage.setItem('voice-command-history', JSON.stringify(newHistory));
        }

        if (action) {
            setTimeout(action, 1500);
        }
    };

    const downloadReport = async (type) => {
        const baseUrl = `${API_URL}/finanzas/reportes/`;
        const urls = {
            'gerencial': {
                url: `${baseUrl}gerencial/`,
                filename: `Reporte_Gerencial_${new Date().toISOString().slice(0, 10)}.xlsx`
            },
            'gerencial-pdf': {
                url: `${baseUrl}gerencial-pdf/`,
                filename: `Reporte_Gerencial_${new Date().toISOString().slice(0, 10)}.pdf`
            },
            'prestamos': {
                url: `${baseUrl}prestamos-csv/`,
                filename: `Prestamos_${new Date().toISOString().slice(0, 10)}.csv`
            },
            'alertas': {
                url: `${baseUrl}alertas-csv/`,
                filename: `Alertas_Riesgo_${new Date().toISOString().slice(0, 10)}.csv`
            }
        };

        const { url, filename } = urls[type];
        try {
            const response = await fetch(url, { method: 'GET' });
            if (!response.ok) throw new Error('Error en la descarga');
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Error:', error);
            setError('Error al descargar el reporte');
            speak('Hubo un error al descargar el reporte');
            setTimeout(() => setError(''), 3000);
        }
    };

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-ES';
            utterance.rate = 1.1;
            utterance.pitch = 1;
            utterance.volume = 1;

            window.speechSynthesis.speak(utterance);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            setTranscript('');
            setInterimTranscript('');
            setResponse('');
            setError('');

            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (error) {
                console.error('Error starting recognition:', error);
                setError('Error al iniciar el reconocimiento de voz');
            }
        }
    };

    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        return null;
    }

    return (
        <>
            {/* Floating Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-20 md:bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full shadow-lg shadow-emerald-500/50 flex items-center justify-center text-white relative overflow-hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={isListening ? { scale: [1, 1.15, 1] } : {}}
                transition={isListening ? { repeat: Infinity, duration: 1.5 } : {}}
            >
                {/* Animated rings when listening */}
                {isListening && (
                    <>
                        <motion.div
                            className="absolute inset-0 rounded-full bg-emerald-400"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        />
                        <motion.div
                            className="absolute inset-0 rounded-full bg-cyan-400"
                            animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                        />
                    </>
                )}

                <Mic className={`w-6 h-6 relative z-10 ${isListening ? 'animate-pulse' : ''}`} />

                {/* Notification badge if there's history */}
                {commandHistory.length > 0 && !isOpen && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900"></div>
                )}
            </motion.button>

            {/* Voice Assistant Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-36 md:bottom-24 right-6 z-50 w-[calc(100vw-2rem)] max-w-md glass-card rounded-2xl p-5 shadow-2xl border border-emerald-500/20"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <div className="relative">
                                    <Mic className="w-5 h-5 text-emerald-400" />
                                    {isListening && (
                                        <Sparkles className="w-3 h-3 text-cyan-400 absolute -top-1 -right-1 animate-pulse" />
                                    )}
                                </div>
                                Asistente de Voz
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-text-muted hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {/* Mic Button */}
                            <button
                                onClick={toggleListening}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all relative overflow-hidden ${isListening
                                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/50'
                                        : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-white shadow-lg shadow-emerald-500/30'
                                    }`}
                            >
                                {isListening && (
                                    <motion.div
                                        className="absolute inset-0 bg-white/20"
                                        animate={{ x: ['-100%', '100%'] }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                                    />
                                )}

                                {isListening ? (
                                    <>
                                        <MicOff className="w-5 h-5 animate-pulse relative z-10" />
                                        <span className="relative z-10">Escuchando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Mic className="w-5 h-5" />
                                        <span>Presiona para hablar</span>
                                    </>
                                )}
                            </button>

                            {/* Interim Transcript (while speaking) */}
                            {interimTranscript && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-cyan-500/10 rounded-xl p-3 border border-cyan-500/30"
                                >
                                    <p className="text-xs text-cyan-400 mb-1 font-semibold flex items-center gap-1">
                                        <Volume2 className="w-3 h-3 animate-pulse" />
                                        Detectando...
                                    </p>
                                    <p className="text-sm text-white/80 italic">{interimTranscript}</p>
                                </motion.div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-500/10 rounded-xl p-3 border border-red-500/30"
                                >
                                    <p className="text-xs text-red-400 mb-1 font-semibold flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        Error
                                    </p>
                                    <p className="text-sm text-red-300">{error}</p>
                                </motion.div>
                            )}

                            {/* Transcript */}
                            {transcript && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/5 rounded-xl p-3 border border-white/10"
                                >
                                    <p className="text-xs text-emerald-400 mb-1 font-semibold uppercase tracking-wider">
                                        Escuché:
                                    </p>
                                    <p className="text-sm text-white">{transcript}</p>
                                </motion.div>
                            )}

                            {/* Response */}
                            {response && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl p-3 border border-emerald-500/30"
                                >
                                    <p className="text-xs text-emerald-400 mb-1 font-semibold uppercase tracking-wider flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" />
                                        Respuesta:
                                    </p>
                                    <p className="text-sm text-white">{response}</p>
                                </motion.div>
                            )}

                            {/* Command History */}
                            {commandHistory.length > 0 && !transcript && (
                                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                    <p className="text-xs text-cyan-400 mb-2 font-semibold uppercase tracking-wider">
                                        Comandos recientes:
                                    </p>
                                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                                        {commandHistory.slice(0, 3).map((cmd, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-xs">
                                                <ChevronRight className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                                                <span className="text-text-muted flex-1 line-clamp-1">{cmd.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Help - Comandos disponibles */}
                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                <p className="text-xs text-emerald-400 mb-2 font-semibold uppercase tracking-wider">
                                    Ejemplos de comandos:
                                </p>
                                <div className="grid grid-cols-2 gap-1.5 text-xs text-text-muted">
                                    <div className="flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                                        <span>Ir a inicio</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                                        <span>Abrir reportes</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                                        <span>Ver fertilización</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                                        <span>Exportar Excel</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                                        <span>Descargar PDF</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                                        <span>Ver cosecha</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
