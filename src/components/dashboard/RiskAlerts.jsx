import React from 'react';
import { AlertOctagon } from 'lucide-react';

export default function RiskAlerts({ alerts }) {
    return (
        <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <AlertOctagon className="text-amber-500" />
                    Alertas de Cultivo
                </h3>
                <button className="text-sm text-primary hover:text-primary/80">Ver todas</button>
            </div>
            <div className="p-0">
                {!alerts?.length ? (
                    <div className="p-6 text-center text-text-muted">Sin alertas activas.</div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-text-muted">
                            <tr>
                                <th className="p-4 font-medium">Cultivo</th>
                                <th className="p-4 font-medium">Parcela</th>
                                <th className="p-4 font-medium">Recomendación</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {alerts.map((alert, idx) => (
                                <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                            <span className="text-white font-medium">{alert.cultivo__especie}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-text-muted">{alert.cultivo__parcela__nombre}</td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                            <AlertOctagon className="w-3 h-3" />
                                            {alert.accion_recomendada}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
