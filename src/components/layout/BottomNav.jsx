import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sprout, Droplets, Scale, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const navItems = [
    { icon: LayoutDashboard, label: 'Hub', path: '/' },
    { icon: Sprout, label: 'Siembra', path: '/smart-farming/recommendation' },
    { icon: Droplets, label: 'Fertil.', path: '/smart-farming/fertilization' },
    { icon: Scale, label: 'Cosecha', path: '/smart-farming/harvest' },
    { icon: FileText, label: 'Reportes', path: '/reports' },
];

export default function BottomNav() {
    return (
        <nav className="fixed bottom-0 left-0 w-full glass border-t border-white/10 z-50 md:hidden pb-safe">
            <div className="flex justify-around items-center p-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 relative",
                                isActive ? "text-accent" : "text-text-muted hover:text-white"
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeBottomNav"
                                        className="absolute inset-0 bg-primary/10 rounded-xl -z-10"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon className="w-6 h-6" />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
