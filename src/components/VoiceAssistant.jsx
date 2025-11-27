import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function VoiceAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');
    const recognitionRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'es-ES';

            recognitionRef.current.onresult = (event) => {
                const text = event.results[0][0].transcript.toLowerCase();
                setTranscript(text);
                processCommand(text);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const processCommand = (text) => {
        let responseText = '';
        let action = null;

        if (text.includes('inicio') || text.includes('dashboard')) {
            responseText = 'Navegando al dashboard';
            action = () => navigate('/');
        } else if (text.includes('recomendación') || text.includes('siembra')) {
            responseText = 'Abriendo recomendación de siembra';
            action = () => navigate('/smart-farming/recommendation');
        } else if (text.includes('fertilización') || text.includes('fertilizante')) {
            responseText = 'Abriendo plan de fertilización';
            action = () => navigate('/smart-farming/fertilization');
        } else if (text.includes('cosecha') || text.includes('estimación')) {
            responseText = 'Abriendo estimación de cosecha';
            action = () => navigate('/smart-farming/harvest');
        } else if (text.includes('reporte')) {
            responseText = 'Abriendo reportes';
            action = () => navigate('/reports');
        } else if (text.includes('exportar') || text.includes('descargar')) {
            if (text.includes('excel') || text.includes('gerencial')) {
                responseText = 'Generando reporte gerencial en Excel';
                action = () => downloadReport('gerencial');
            } else if (text.includes('pdf')) {
                responseText = 'Generando reporte en PDF';
                action = () => downloadReport('gerencial-pdf');
            } else if (text.includes('préstamo')) {
                responseText = 'Generando reporte de préstamos';
                action = () => downloadReport('prestamos');
            } else if (text.includes('alerta')) {
                responseText = 'Generando reporte de alertas';
                action = () => downloadReport('alertas');
            }
        } else {
            responseText = 'No entendí el comando. Intenta: "ir a inicio", "abrir reportes", "exportar excel"';
        }

        setResponse(responseText);
        speak(responseText);

        if (action) {
            setTimeout(action, 1000);
        }
    };

    const downloadReport = async (type) => {
        const baseUrl = 'http://localhost:8000/api/finanzas/reportes/';
        const urls = {
            'gerencial': { url: `${baseUrl}gerencial/`, filename: `Reporte_Gerencial_${new Date().toISOString().slice(0, 10)}.xlsx` },
            'gerencial-pdf': { url: `${baseUrl}gerencial-pdf/`, filename: `Reporte_Gerencial_${new Date().toISOString().slice(0, 10)}.pdf` },
            'prestamos': { url: `${baseUrl}prestamos-csv/`, filename: `Prestamos_${new Date().toISOString().slice(0, 10)}.csv` },
            'alertas': { url: `${baseUrl}alertas-csv/`, filename: `Alertas_Riesgo_${new Date().toISOString().slice(0, 10)}.csv` }
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
        }
    };

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-ES';
            utterance.rate = 1;
            window.speechSynthesis.speak(utterance);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            setTranscript('');
            setResponse('');
            recognitionRef.current?.start();
            setIsListening(true);
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
                className="fixed bottom-20 md:bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full shadow-lg shadow-emerald-500/50 flex items-center justify-center text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={isListening ? { scale: [1, 1.1, 1] } : {}}
                transition={isListening ? { repeat: Infinity, duration: 1.5 } : {}}
            >
                <Mic className="w-6 h-6" />
            </motion.button>

            {/* Voice Assistant Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-36 md:bottom-24 right-6 z-50 w-80 md:w-96 glass-card rounded-2xl p-6 shadow-2xl border border-emerald-500/20"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Mic className="w-5 h-5 text-emerald-400" />
                                Asistente IA
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Mic Button */}
                            <button
                                onClick={toggleListening}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isListening
                                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/50'
                                    : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-white shadow-lg shadow-emerald-500/30'
                                    }`}
                            >
                                {isListening ? (
                                    <>
                                        <MicOff className="w-5 h-5 animate-pulse" /> Escuchando...
                                    </>
                                ) : (
                                    <>
                                        <Mic className="w-5 h-5" /> Presiona para hablar
                                    </>
                                )}
                            </button>

                            {/* Transcript */}
                            {transcript && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/5 rounded-xl p-4 border border-white/10"
                                >
                                    <p className="text-xs text-emerald-400 mb-1 font-semibold uppercase tracking-wider">Escuché:</p>
                                    <p className="text-sm text-white">{transcript}</p>
                                </motion.div>
                            )}

                            {/* Response */}
                            {response && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl p-4 border border-emerald-500/30"
                                >
                                    <p className="text-xs text-emerald-400 mb-1 font-semibold uppercase tracking-wider">Respuesta:</p>
                                    <p className="text-sm text-white">{response}</p>
                                </motion.div>
                            )}

                            {/* Help */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <p className="text-xs text-emerald-400 mb-2 font-semibold uppercase tracking-wider">Comandos:</p>
                                <div className="grid grid-cols-2 gap-2 text-xs text-text-muted">
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
                                        <span>Exportar Excel</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                                        <span>Descargar PDF</span>
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
