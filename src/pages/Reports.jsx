import React, { useState } from 'react';
import { FileText, Download, Loader2, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Reports() {
    const [isDownloading, setIsDownloading] = useState(false);

    const descargarArchivo = async (url, nombreArchivo) => {
        setIsDownloading(true);
        try {
            const response = await fetch(url, { method: 'GET' });
            if (!response.ok) throw new Error('Error en la descarga');

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = nombreArchivo;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Error:', error);
            alert('No se pudo descargar el archivo.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDownload = (type) => {
        if (type === 'gerencial') {
            descargarArchivo('http://localhost:8000/api/finanzas/reportes/gerencial/', `Reporte_Gerencial_${new Date().toISOString().slice(0, 10)}.xlsx`);
        } else if (type === 'prestamos') {
            descargarArchivo('http://localhost:8000/api/finanzas/reportes/prestamos-csv/', `Prestamos_${new Date().toISOString().slice(0, 10)}.csv`);
        } else if (type === 'alertas') {
            descargarArchivo('http://localhost:8000/api/finanzas/reportes/alertas-csv/', `Alertas_Riesgo_${new Date().toISOString().slice(0, 10)}.csv`);
        } else if (type === 'gerencial-pdf') {
            descargarArchivo('http://localhost:8000/api/finanzas/reportes/gerencial-pdf/', `Reporte_Gerencial_${new Date().toISOString().slice(0, 10)}.pdf`);
        }
    };

    const reports = [
        {
            id: 'gerencial',
            title: 'Reporte Gerencial',
            description: 'Resumen completo de KPIs, alertas de riesgo y actividad financiera (Excel).',
            icon: FileSpreadsheet,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20'
        },
        {
            id: 'gerencial-pdf',
            title: 'Reporte Gerencial (PDF)',
            description: 'Documento PDF profesional listo para imprimir y presentar.',
            icon: FileText,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20'
        },
        {
            id: 'prestamos',
            title: 'Reporte de Préstamos',
            description: 'Listado detallado de todos los préstamos registrados en el sistema (CSV).',
            icon: FileText,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        {
            id: 'alertas',
            title: 'Alertas de Riesgo',
            description: 'Exportación de alertas climáticas y recomendaciones activas (CSV).',
            icon: AlertCircle,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20'
        }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                    <FileText className="text-primary w-8 h-8" />
                    Reportes Inteligentes
                </h2>
                <p className="text-text-muted">Genera y exporta información clave para tu cooperativa.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.map((report) => (
                    <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`glass-card p-8 rounded-2xl border ${report.border} relative overflow-hidden group`}
                    >
                        <div className={`absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-500`}>
                            <report.icon className="w-32 h-32" />
                        </div>

                        <div className="relative z-10">
                            <div className={`w-12 h-12 rounded-xl ${report.bg} flex items-center justify-center mb-6`}>
                                <report.icon className={`w-6 h-6 ${report.color}`} />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{report.title}</h3>
                            <p className="text-text-muted mb-8 h-12">{report.description}</p>

                            <button
                                onClick={(e) => { e.preventDefault(); handleDownload(report.id); }}
                                disabled={report.disabled || isDownloading}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${report.disabled
                                    ? 'bg-white/5 text-text-muted cursor-not-allowed'
                                    : 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 shadow-lg shadow-primary/20'
                                    }`}
                            >
                                {isDownloading && report.id === 'gerencial' ? (
                                    <><Loader2 className="animate-spin w-5 h-5" /> Generando Excel...</>
                                ) : report.disabled ? (
                                    <><AlertCircle className="w-5 h-5" /> Próximamente</>
                                ) : (
                                    <><Download className="w-5 h-5" /> Exportar Excel</>
                                )}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
