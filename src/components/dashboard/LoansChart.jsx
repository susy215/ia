import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#ef4444']; // Emerald, Cyan, Amber, Red

export default function LoansChart({ data }) {
    if (!data) return null;
    const totalLoans = data.reduce((acc, curr) => acc + curr.total, 0);

    return (
        <div className="glass-card rounded-xl p-6 h-[420px] flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">Cartera de Préstamos</h3>
                <div className="flex flex-col items-end">
                    <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{totalLoans}</span>
                    <span className="text-xs text-text-muted uppercase tracking-wider">Total</span>
                </div>
            </div>
            <div className="flex-1 w-full min-h-0 relative" style={{ minHeight: '320px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius="65%"
                            outerRadius="85%"
                            paddingAngle={3}
                            dataKey="total"
                            nameKey="estado"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    style={{ filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.3))' }}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                borderColor: 'rgba(16, 185, 129, 0.3)',
                                borderRadius: '12px',
                                color: '#f8fafc',
                                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                                padding: '12px'
                            }}
                            itemStyle={{ color: '#10b981', fontWeight: '600' }}
                            formatter={(value) => [`${value} préstamos`, '']}
                            labelStyle={{ color: '#f8fafc', fontWeight: '700', marginBottom: '4px' }}
                        />
                        <Legend
                            verticalAlign="middle"
                            align="right"
                            layout="vertical"
                            iconType="circle"
                            iconSize={10}
                            wrapperStyle={{ paddingLeft: '24px', fontSize: '13px' }}
                            formatter={(value) => <span className="text-gray-300 text-sm font-medium">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
