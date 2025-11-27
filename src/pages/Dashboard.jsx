import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import KPICards from '../components/dashboard/KPICards';
import RiskAlerts from '../components/dashboard/RiskAlerts';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import LoansChart from '../components/dashboard/LoansChart';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const navigate = useNavigate();
    const [showReportMenu, setShowReportMenu] = React.useState(false);

    const handleDownload = async (type) => {
        setShowReportMenu(false);
        const baseUrl = 'http://localhost:8000/api/finanzas/reportes/';
        let url = '';
        let filename = '';

        switch (type) {
            case 'gerencial':
                url = `${baseUrl}gerencial/`;
                filename = `Reporte_Gerencial_${new Date().toISOString().slice(0, 10)}.xlsx`;
                break;
            case 'gerencial-pdf':
                url = `${baseUrl}gerencial-pdf/`;
                filename = `Reporte_Gerencial_${new Date().toISOString().slice(0, 10)}.pdf`;
                break;
            case 'prestamos':
                url = `${baseUrl}prestamos-csv/`;
                filename = `Prestamos_${new Date().toISOString().slice(0, 10)}.csv`;
                break;
            case 'alertas':
                url = `${baseUrl}alertas-csv/`;
                filename = `Alertas_Riesgo_${new Date().toISOString().slice(0, 10)}.csv`;
                break;
            default:
                return;
        }

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
            alert('No se pudo descargar el archivo.');
        }
    };
    const { data, isLoading, error } = useQuery({
        queryKey: ['dashboard-summary'],
        queryFn: async () => {
            // Mock data for development if API fails or is not ready
            try {
                const res = await api.get('finanzas/dashboard/summary/');
                return res.data;
            } catch (e) {
                console.warn("API failed, using mock data");
                return {
                    kpis: { total_socios: 12, prestamos_activos: 5, dinero_colocado: 45000, alertas_activas: 2 },
                    alertas_riesgo: [
                        { cultivo__especie: 'Maíz', cultivo__parcela__nombre: 'La Paz', accion_recomendada: '⚠️ ALERTA: Probabilidad de heladas' },
                        { cultivo__especie: 'Trigo', cultivo__parcela__nombre: 'San Juan', accion_recomendada: '⚠️ ALERTA: Sequía inminente' }
                    ],
                    actividad_ia: [
                        { parcela__nombre: 'Sector Norte', especie_sugerida: 'Tomate', rentabilidad_estimada: 25000, fecha_generacion: '2023-11-25' },
                        { parcela__nombre: 'Sector Sur', especie_sugerida: 'Lechuga', rentabilidad_estimada: 15000, fecha_generacion: '2023-11-24' }
                    ],
                    distribucion_prestamos: [
                        { estado: 'PENDIENTE', total: 3 },
                        { estado: 'APROBADO', total: 5 }
                    ]
                };
            }
        }
    });

    if (isLoading) return <div className="p-10 text-center text-primary animate-pulse">Cargando AI Hub...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">AI Hub Overview</h2>
                    <p className="text-text-muted">Monitoreo inteligente en tiempo real</p>
                </div>
                <div className="flex gap-2 relative">
                    <div className="relative">
                        <button
                            onClick={() => setShowReportMenu(!showReportMenu)}
                            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg border border-white/10 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            <span>Exportar Reporte</span>
                        </button>

                        {showReportMenu && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-[#0f172a] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                                <div className="p-2 space-y-1">
                                    <button
                                        onClick={() => handleDownload('gerencial')}
                                        className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/5 rounded-lg flex items-center gap-2"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                        Gerencial (Excel)
                                    </button>
                                    <button
                                        onClick={() => handleDownload('gerencial-pdf')}
                                        className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/5 rounded-lg flex items-center gap-2"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                        Gerencial (PDF)
                                    </button>
                                    <button
                                        onClick={() => handleDownload('prestamos')}
                                        className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/5 rounded-lg flex items-center gap-2"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                        Préstamos (CSV)
                                    </button>
                                    <button
                                        onClick={() => handleDownload('alertas')}
                                        className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/5 rounded-lg flex items-center gap-2"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                        Alertas (CSV)
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        + Nuevo Análisis
                    </button>
                </div>
            </div>

            <KPICards kpis={data?.kpis} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <RiskAlerts alerts={data?.alertas_riesgo} />
                    <ActivityFeed activity={data?.actividad_ia} />
                </div>
                <div className="lg:col-span-1">
                    <LoansChart data={data?.distribucion_prestamos} />
                </div>
            </div>
        </div>
    );
}
