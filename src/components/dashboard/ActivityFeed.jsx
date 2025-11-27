import React from 'react';
import { Bot } from 'lucide-react';

export default function ActivityFeed({ activity }) {
    return (
        <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Bot className="text-primary" />
                Actividad Reciente de IA
            </h3>
            <div className="space-y-4">
                {activity?.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start p-3 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                        <div>
                            <p className="text-sm text-white">
                                Se generó recomendación para <span className="font-bold text-primary">{item.parcela__nombre}</span>
                            </p>
                            <p className="text-xs text-text-muted mt-1">
                                Sugerencia: {item.especie_sugerida} • Rentabilidad: ${item.rentabilidad_estimada}
                            </p>
                            <p className="text-[10px] text-text-muted/50 mt-1">{new Date(item.fecha_generacion).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
                {!activity?.length && <p className="text-text-muted text-sm">No hay actividad reciente.</p>}
            </div>
        </div>
    );
}
