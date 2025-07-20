
'use client';

import { Bar, BarChart, Line, LineChart, Pie, PieChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useMemo } from 'react';

interface DynamicChartProps {
  chartType: 'bar' | 'line' | 'pie';
  chartData: string;
  chartConfig: string;
}

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

export function DynamicChart({ chartType, chartData, chartConfig }: DynamicChartProps) {
    const data = useMemo(() => {
        try {
            return JSON.parse(chartData);
        } catch (e) {
            console.error("Failed to parse chart data:", e);
            return [];
        }
    }, [chartData]);

    const config = useMemo(() => {
        try {
            return JSON.parse(chartConfig);
        } catch (e) {
            console.error("Failed to parse chart config:", e);
            return null;
        }
    }, [chartConfig]);

    if (!data || !config) {
        return (
            <div className="flex h-full w-full items-center justify-center text-sm text-destructive">
                Error: Could not render chart. Invalid data or configuration provided by AI.
            </div>
        );
    }
    
    return (
        <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' && (
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={config.x_axis_key} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => typeof value === 'number' ? value.toLocaleString() : ''} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                        }}
                    />
                    <Legend />
                    {config.y_axis_keys.map((key: string, index: number) => (
                         <Bar key={key} dataKey={key} fill={`hsl(var(--primary), ${1 - index*0.3})`} radius={[4, 4, 0, 0]} />
                    ))}
                </BarChart>
            )}
            {chartType === 'line' && (
                <LineChart data={data}>
                     <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={config.x_axis_key} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => typeof value === 'number' ? value.toLocaleString() : ''} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                        }}
                    />
                    <Legend />
                     {config.y_axis_keys.map((key: string, index: number) => (
                        <Line key={key} type="monotone" dataKey={key} stroke={`hsl(var(--primary), ${1 - index*0.3})`} />
                    ))}
                </LineChart>
            )}
            {chartType === 'pie' && (
                <PieChart>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                        }}
                    />
                    <Legend />
                    <Pie data={data} dataKey={config.y_axis_keys[0]} nameKey={config.label_key} cx="50%" cy="50%" outerRadius={100} label>
                         {data.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            )}
        </ResponsiveContainer>
    );
}

