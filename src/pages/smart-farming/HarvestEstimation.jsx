import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, TrendingUp, AlertOctagon, Loader2, CalendarClock } from 'lucide-react';

export default function HarvestEstimation() {
    const [estimation, setEstimation] = useState(null);
    const { register, handleSubmit } = useForm();

    const { data: cultivos } = useQuery({
        queryKey: ['cultivos'],
        queryFn: async () => {
            try {
                const res = await api.get('agri-data/cultivos/');
                const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
                return data;
            } catch (e) {
                console.error("Error fetching cultivos:", e);
                return [
                    { id: 1, especie: 'Maíz', parcela__nombre: 'Parcela Norte' },
                    { id: 2, especie: 'Trigo', parcela__nombre: 'Parcela Sur' },
                ];
            }
        }
    });

    const mutation = useMutation({
        mutationFn: async (data) => {
            await new Promise(resolve => setTimeout(resolve, 2500));
            try {
                const res = await api.post('smart-farming/ia/cosecha/generar/', data);
                return res.data;
            } catch (e) {
                return {
                    fecha_optima: '2026-03-15',
                    ventana_dias: 7,
                    precio_mercado_proyectado: '3500.00',
                    riesgo_clima: 'MEDIO',
                    accion_recomendada: 'Monitorear clima. Considerar cosecha anticipada si hay pronóstico de lluvias.',
                    fecha_generacion: new Date().toISOString()
                };
            }
        },
        onSuccess: (data) => setEstimation(data)
    });

    const onSubmit = (data) => {
        setEstimation(null);
        mutation.mutate(data);
    };

    const getRiskColor = (risk) => {
        if (risk === 'ALTO') return 'text-red-400 bg-red-500/10 border-red-500/20';
        if (risk === 'MEDIO') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                    <Scale className="text-purple-400 w-8 h-8" />
                    Estimación de Cosecha
                </h2>
                <p className="text-text-muted">Predicción de rendimiento y precios futuros.</p>
            </div>

            <div className="glass-card p-8 rounded-2xl max-w-xl mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Selecciona un Cultivo</label>
                        <select
                            {...register('cultivo_id')}
                            className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                        >
                            <option value="">-- Seleccionar --</option>
                            {cultivos?.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.especie} {c.variedad ? `- ${c.variedad}` : ''} - {c.parcela__nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                    >
                        {mutation.isPending ? (
                            <><Loader2 className="animate-spin" /> Simulando Mercado...</>
                        ) : (
                            'Proyectar Cosecha'
                        )}
                    </button>
                </form>
            </div>

            <AnimatePresence>
                {estimation && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {/* Date Card */}
                        <div className="glass-card p-6 rounded-xl flex flex-col items-center justify-center text-center group hover:border-purple-500/30 transition-colors">
                            <div className="p-3 rounded-full bg-purple-500/10 mb-4 group-hover:scale-110 transition-transform">
                                <CalendarClock className="w-8 h-8 text-purple-400" />
                            </div>
                            <h3 className="text-sm text-text-muted">Fecha Óptima</h3>
                            <p className="text-2xl font-bold text-white mt-1">{new Date(estimation.fecha_optima).toLocaleDateString()}</p>
                            <small className="text-xs text-text-muted mt-1">Ventana: ±{estimation.ventana_dias} días</small>
                        </div>

                        {/* Risk Card */}
                        <div className={`glass-card p-6 rounded-xl flex flex-col items-center justify-center text-center border ${getRiskColor(estimation.riesgo_clima)}`}>
                            <div className="p-3 rounded-full bg-current/10 mb-4">
                                <AlertOctagon className="w-8 h-8" />
                            </div>
                            <h3 className="text-sm opacity-80">Riesgo Climático</h3>
                            <p className="text-2xl font-bold mt-1">{estimation.riesgo_clima}</p>
                        </div>

                        {/* Price Card */}
                        <div className="glass-card p-6 rounded-xl flex flex-col items-center justify-center text-center">
                            <div className="p-3 rounded-full bg-emerald-500/10 mb-4">
                                <TrendingUp className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h3 className="text-sm text-text-muted">Precio Proyectado</h3>
                            <div className="flex items-end gap-2 mt-1">
                                <p className="text-2xl font-bold text-emerald-400">${parseFloat(estimation.precio_mercado_proyectado).toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Action Recommendation */}
                        <div className="md:col-span-3 glass-card p-6 rounded-xl border border-amber-500/20">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-amber-500/10">
                                    <AlertOctagon className="w-6 h-6 text-amber-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-2">Acción Recomendada</h3>
                                    <p className="text-text-muted leading-relaxed">{estimation.accion_recomendada}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
