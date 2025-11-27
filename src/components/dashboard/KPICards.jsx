import React from 'react';
import { Users, Banknote, AlertTriangle, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export default function KPICards({ kpis }) {
    if (!kpis) return null;

    const cards = [
        { label: 'Socios Activos', value: kpis.total_socios, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { label: 'Préstamos Activos', value: kpis.prestamos_activos, icon: Wallet, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        { label: 'Capital Colocado', value: `$${kpis.dinero_colocado?.toLocaleString()}`, icon: Banknote, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        { label: 'Alertas de Riesgo', value: kpis.alertas_activas, icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    ];

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
            {cards.map((card, idx) => (
                <motion.div
                    key={idx}
                    variants={item}
                    className={`glass-card p-6 rounded-xl hover:translate-y-[-4px] transition-all duration-300 border ${card.border} hover:shadow-lg hover:shadow-${card.color.split('-')[1]}-500/10 group`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${card.bg} group-hover:scale-110 transition-transform duration-300`}>
                            <card.icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                        <span className="text-xs font-medium text-text-muted bg-white/5 px-2 py-1 rounded-full border border-white/5">+2.5%</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{card.value}</h3>
                    <p className="text-sm text-text-muted font-medium">{card.label}</p>
                </motion.div>
            ))}
        </motion.div>
    );
}
