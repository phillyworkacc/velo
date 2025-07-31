'use client'
import { CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

type ChartProps = {
   data: any;
   yDataKey: string;
   xDataKey: string;
   width: number;
   height: number;
}

export default function Chart({ data, yDataKey, xDataKey, width, height }: ChartProps) {
   return (
      <ResponsiveContainer width={width} height={height}>
         <AreaChart width={width} height={height} data={data} margin={{ left: -60, right: 10 }}>
            <defs>
               <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="currentColor" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
               </linearGradient>
            </defs>

            <Area 
               type="monotone" 
               dataKey={yDataKey} 
               stroke="#2054FF" 
               fill="#7d9bff49" 
               strokeWidth={1} 
               dot={false} />

            <XAxis dataKey={xDataKey} padding={{ left: 15 }} tick={{ fontSize: '0.9rem' }} />
            <YAxis dataKey={yDataKey} tick={false} tickLine />
            
            <CartesianGrid verticalValues={data.flatMap((dt: any) => dt.amount)} />
            
            <Tooltip cursor={{
               strokeWidth: 0.5,
               stroke: "#e6e6e6ff"
            }} />
         </AreaChart>
      </ResponsiveContainer>
   )
}

export function CustomPieChart ({ data, colors, width }: { data: any[], colors: string[], width: number }) {
   return (
      <div className="text-s w-full">
         <ResponsiveContainer className='text-xxxs w-full' height={300}>
            <PieChart width={width} height={width}>
               <Pie
                  data={data} nameKey="name" dataKey="value"
                  cx="28%" cy="50%"
                  width={width} height={width}
                  outerRadius={120} innerRadius={40}
               >
                  {data.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
               </Pie>
               <Tooltip />
               <Legend layout="horizontal" verticalAlign="bottom" align="left" />
            </PieChart>
         </ResponsiveContainer>
      </div>
   );
}