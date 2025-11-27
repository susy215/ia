import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sprout, Droplets, Scale, Leaf, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const navItems = [
    { icon: LayoutDashboard, label: 'AI Hub', path: '/' },
    { icon: Sprout, label: 'Siembra IA', path: '/smart-farming/recommendation' },
    { icon: Droplets, label: 'Fertilización', path: '/smart-farming/fertilization' },
    { icon: Scale, label: 'Cosecha', path: '/smart-farming/harvest' },
    { icon: FileText, label: 'Reportes', path: '/reports' },
];

export default function Sidebar() {
    return (
        <aside className="w-64 glass border-r border-white/10 flex flex-col z-20">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                    <Leaf className="text-white w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    SmartCoop
                </h1>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-primary/20 text-white shadow-lg shadow-primary/10"
                                    : "text-text-muted hover:bg-white/5 hover:text-white"
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute inset-0 bg-primary/10 rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon className={cn("w-5 h-5 relative z-10", isActive ? "text-accent" : "group-hover:text-accent transition-colors")} />
                                <span className="font-medium relative z-10">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4">
                <div className="glass-card p-4 rounded-xl">
                    <p className="text-xs text-text-muted mb-2">Estado del Sistema</p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-medium text-emerald-400">Online</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
