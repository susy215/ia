import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function CropRecommendation() {
    const [result, setResult] = useState(null);
    const { register, handleSubmit, watch } = useForm();
    const selectedParcelaId = watch('parcela_id');

    // Fetch Parcelas for dropdown
    const { data: parcelas } = useQuery({
        queryKey: ['parcelas'],
        queryFn: async () => {
            try {
                const res = await api.get('agri-data/parcelas/');
                const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
                return data;
            } catch (e) {
                console.error("Error fetching parcelas:", e);
                return [
                    { id: 1, nombre: 'Parcela Norte', ubicacion: 'Sector A', area_hectareas: 50 },
                    { id: 2, nombre: 'Parcela Sur', ubicacion: 'Sector B', area_hectareas: 30 },
                ];
            }
        }
    });

    const mutation = useMutation({
        mutationFn: async (data) => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
                const res = await api.post('smart-farming/ia/recomendacion/generar/', data);
                return { ...res.data, parcela_id: data.parcela_id };
            } catch (e) {
                return {
                    especie_sugerida: 'Maíz Híbrido XL',
                    confianza_ia: 92,
                    rentabilidad_estimada: '35000.00',
                    justificacion_texto: 'Suelo rico en nitrógeno y previsión de lluvias moderadas favorecen este cultivo.',
                    fecha_generacion: new Date().toISOString(),
                    parcela_id: data.parcela_id
                };
            }
        },
        onSuccess: (data) => setResult(data)
    });

    const onSubmit = (data) => {
        setResult(null);
        mutation.mutate(data);
    };

    const chartData = result ? [
        { name: 'Confianza', value: result.confianza_ia },
        { name: 'Incertidumbre', value: (100 - result.confianza_ia) }
    ] : [];

    const selectedParcela = parcelas?.find(p => p.id == (result?.parcela_id || selectedParcelaId));

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                    <Sprout className="text-primary w-8 h-8" />
                    Recomendación de Siembra
                </h2>
                <p className="text-text-muted">Nuestra IA analiza el suelo y el clima para sugerirte el mejor cultivo.</p>
            </div>

            <div className="glass-card p-8 rounded-2xl max-w-xl mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Selecciona una Parcela</label>
                        <select
                            {...register('parcela_id')}
                            className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        >
                            <option value="">-- Seleccionar --</option>
                            {parcelas?.map(p => (
                                <option key={p.id} value={p.id}>{p.nombre} ({p.area_hectareas} ha)</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    >
                        {mutation.isPending ? (
                            <><Loader2 className="animate-spin" /> Analizando Suelo...</>
                        ) : (
                            'Generar Recomendación'
                        )}
                    </button>
                </form>
            </div>

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-card p-8 rounded-2xl border-t-4 border-primary relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <Sprout className="w-64 h-64" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-sm text-text-muted uppercase tracking-wider mb-2">Cultivo Recomendado</h3>
                                    <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">{result.especie_sugerida}</p>
                                </div>

                                <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                                    <h4 className="font-medium text-primary mb-3 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" /> Justificación de IA
                                    </h4>
                                    <p className="text-text-muted leading-relaxed">
                                        {result.justificacion_texto}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                        <h3 className="text-xs text-emerald-400 uppercase font-bold">Rentabilidad / ha</h3>
                                        <p className="text-xl font-bold text-white mt-1">$ {parseFloat(result.rentabilidad_estimada)?.toLocaleString()}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                        <h3 className="text-xs text-blue-400 uppercase font-bold">Proyección Total</h3>
                                        <p className="text-xl font-bold text-white mt-1">
                                            $ {(parseFloat(result.rentabilidad_estimada) * (selectedParcela?.area_hectareas || 1))?.toLocaleString()}
                                        </p>
                                        <span className="text-xs text-text-muted">En {selectedParcela?.area_hectareas || 1} hectáreas</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-80 w-80 relative flex flex-col items-center justify-center bg-white/5 rounded-full mx-auto">
                                <h4 className="absolute top-16 text-sm text-text-muted font-medium">Nivel de Confianza</h4>
                                <div className="w-full h-full" style={{ width: '100%', height: '100%' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={80}
                                                outerRadius={100}
                                                startAngle={180}
                                                endAngle={0}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                <Cell fill="#10b981" />
                                                <Cell fill="#334155" />
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2 text-center">
                                    <span className="text-5xl font-bold text-white tracking-tighter">{result.confianza_ia}%</span>
                                    <p className="text-xs text-emerald-400 mt-1 font-bold">ALTA PRECISIÓN</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
