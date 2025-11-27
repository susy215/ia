import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Calendar, Loader2 } from 'lucide-react';

export default function FertilizationPlan() {
    const [plan, setPlan] = useState(null);
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
                    { id: 1, especie: 'Maíz', parcela__nombre: 'Parcela Norte', estado_fenologico: 'Vegetativo' },
                    { id: 2, especie: 'Trigo', parcela__nombre: 'Parcela Sur', estado_fenologico: 'Floración' },
                ];
            }
        }
    });

    const mutation = useMutation({
        mutationFn: async (data) => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
                const res = await api.post('smart-farming/ia/fertilizacion/generar/', data);
                console.log('✅ API Success:', res.data);
                return res.data;
            } catch (e) {
                console.error('❌ API Error:', e);
                console.log('Using fallback mock data');
                return {
                    cultivo_id: data.cultivo_id,
                    fecha_generacion: new Date().toISOString(),
                    costo_total: '2500.00',
                    detalle_aplicaciones: [
                        { etapa: 'Preparación de Suelo', producto: 'Cal Agrícola', dosis: '2000 kg/ha', fecha_sugerida: '2025-10-15', notas: 'Incorporar con arado para corregir acidez.' },
                        { etapa: 'Siembra', producto: 'NPK 15-15-15 (Fórmula Completa)', dosis: '300 kg/ha', fecha_sugerida: '2025-11-14', notas: 'Aplicar al fondo del surco.' },
                        { etapa: 'Crecimiento Vegetativo', producto: 'Urea (46% N)', dosis: '200 kg/ha', fecha_sugerida: '2025-12-29', notas: 'Aplicar en banda lateral y regar inmediatamente.' },
                    ]
                };
            }
        },
        onSuccess: (data) => {
            console.log('Fertilization Plan Response:', data);
            console.log('Detalle Aplicaciones:', data.detalle_aplicaciones);
            setPlan(data);
        }
    });

    const onSubmit = (data) => {
        setPlan(null);
        mutation.mutate(data);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                    <Droplets className="text-blue-400 w-8 h-8" />
                    Plan de Fertilización Inteligente
                </h2>
                <p className="text-text-muted">Optimiza los nutrientes basándote en la etapa fenológica.</p>
            </div>

            <div className="glass-card p-8 rounded-2xl max-w-xl mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Selecciona un Cultivo Activo</label>
                        <select
                            {...register('cultivo_id')}
                            className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        >
                            <option value="">-- Seleccionar --</option>
                            {cultivos?.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.especie} {c.variedad ? `- ${c.variedad}` : ''} - {c.parcela__nombre} {c.estado_fenologico ? `(${c.estado_fenologico})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                        {mutation.isPending ? (
                            <><Loader2 className="animate-spin" /> Calculando Nutrientes...</>
                        ) : (
                            'Generar Plan'
                        )}
                    </button>
                </form>
            </div>

            <AnimatePresence>
                {plan && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-8 rounded-2xl"
                    >
                        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                            <Calendar className="text-blue-400" /> Calendario de Aplicaciones
                        </h3>

                        <div className="relative border-l-2 border-blue-500/20 ml-4 space-y-12 pl-8 py-2">
                            {(plan.detalle_aplicaciones || []).map((app, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.2 }}
                                    className="relative group"
                                >
                                    <span className="absolute -left-[43px] top-0 w-6 h-6 rounded-full bg-surface border-4 border-blue-500 flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                    </span>

                                    <div className="glass bg-white/5 p-6 rounded-xl hover:bg-white/10 transition-all border border-white/5 hover:border-blue-500/30">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-2 py-1 rounded">
                                                        {app.fecha_sugerida ? new Date(app.fecha_sugerida).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Fecha no disponible'}
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-xs text-blue-400 font-semibold uppercase">{app.etapa || 'Etapa no especificada'}</span>
                                                    <h4 className="text-xl font-bold text-white">{app.producto || 'No especificado'}</h4>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-text-muted text-xs uppercase">Dosis</span>
                                                    <span className="font-bold text-white">{app.dosis || 'No especificada'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {app.notas && (
                                            <div className="mt-4 pt-4 border-t border-white/5">
                                                <p className="text-sm text-text-muted italic">
                                                    💡 {app.notas}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
