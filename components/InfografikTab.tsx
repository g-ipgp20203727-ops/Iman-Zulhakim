
import React, { useMemo, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { Users } from 'lucide-react';
import { Teacher } from '../types';

interface InfografikTabProps {
  data: Teacher[];
}

const InfografikTab: React.FC<InfografikTabProps> = ({ data }) => {
  const [activeFilter, setActiveFilter] = useState<'Semua' | string>('Semua');

  // Prepare filtered data based on Gred (optional deeper filter)
  const chartData = useMemo(() => {
    const filtered = activeFilter === 'Semua' ? data : data.filter(t => t.Gred === activeFilter);

    // Gred Counts
    const gredCount: Record<string, number> = {};
    data.forEach(t => {
      if (t.Gred) gredCount[t.Gred] = (gredCount[t.Gred] || 0) + 1;
    });
    const gredChart = Object.entries(gredCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Bidang Counts
    const bidangCount: Record<string, number> = {};
    filtered.forEach(t => {
      if (t.Pengkhususan) bidangCount[t.Pengkhususan] = (bidangCount[t.Pengkhususan] || 0) + 1;
    });
    const bidangChart = Object.entries(bidangCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10

    return { gredChart, bidangChart };
  }, [data, activeFilter]);

  const gredList = useMemo(() => 
    ['Semua', ...Array.from(new Set(data.map(t => t.Gred))).filter(Boolean).sort()], 
    [data]
  );

  const colors = ['#8B0000', '#DAA520', '#C0C0C0', '#CD7F32', '#A52A2A', '#D2691E'];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Analisis Data Guru</h2>
          <p className="text-gray-500 text-sm">Visualisasi taburan gred dan pengkhususan tenaga pengajar.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-600">Fokus Gred:</label>
          <select 
            className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-yellow-500"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            {gredList.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gred Chart */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-700 mb-6 flex items-center">
            <span className="w-2 h-8 bg-red-700 rounded-full mr-3"></span>
            Bilangan Guru Mengikut Gred
          </h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData.gredChart}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#475569' }} 
                  width={60}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                  {chartData.gredChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Specialization Chart */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-700 mb-6 flex items-center">
            <span className="w-2 h-8 bg-yellow-500 rounded-full mr-3"></span>
            Taburan Pengkhususan {activeFilter !== 'Semua' ? `(${activeFilter})` : '(Top 10)'}
          </h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData.bidangChart}
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 10, fontWeight: 500, fill: '#475569' }} 
                  width={120}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                  {chartData.bidangChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#DAA520' : '#8B0000'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100 flex items-start space-x-4">
        <div className="p-3 bg-yellow-500 rounded-2xl text-white shadow-sm">
          {/* Fixed: Added Users import to fix 'Cannot find name Users' error */}
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-yellow-900">Statistik Keseluruhan</h4>
          <p className="text-yellow-800 text-sm opacity-80">
            Terdapat seramai <span className="font-bold text-lg">{data.length}</span> orang guru berdaftar di SK Klang Gate pada masa kini.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfografikTab;
