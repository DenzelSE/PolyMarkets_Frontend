import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const votingData = [
  { date: '24h', yes: 45, no: 55 },
  { date: '3d', yes: 52, no: 48 },
  { date: '7d', yes: 62, no: 38 },
  { date: '14d', yes: 68, no: 32 },
  { date: '30d', yes: 75, no: 25 }
]

export const MarketVotingTrendChart: React.FC = () => {
  return (
    <div className="w-full h-48 pb-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={votingData}
          margin={{ 
            top: 10, 
            right: 20, 
            left: -20, 
            bottom: 0 
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="rgba(255,255,255,0.1)" 
          />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#232a34', 
              border: 'none', 
              borderRadius: '8px' 
            }}
            labelStyle={{ color: 'white' }}
            itemStyle={{ color: 'white' }}
          />
          <Legend 
            iconType="circle"
            formatter={(value) => 
              <span className="text-xs text-white/70">{value}</span>
            }
          />
          <Line 
            type="monotone" 
            dataKey="yes" 
            stroke="#4ade80" 
            strokeWidth={3}
            dot={{ r: 5, fill: '#4ade80', strokeWidth: 0 }}
          />
          <Line 
            type="monotone" 
            dataKey="no" 
            stroke="#f87171" 
            strokeWidth={3}
            dot={{ r: 5, fill: '#f87171', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
