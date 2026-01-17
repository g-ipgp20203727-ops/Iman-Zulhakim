
import React, { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import { Search, RotateCcw, UserPlus, BarChart3, Users, X } from 'lucide-react';
import { CSV_URL } from './constants';
import { Teacher, TabType } from './types';
import BiodataTab from './components/BiodataTab';
import InfografikTab from './components/InfografikTab';
import TambahGuruTab from './components/TambahGuruTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Biodata');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(CSV_URL);
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setTeachers(results.data as Teacher[]);
          setLoading(false);
        },
        error: (err: any) => {
          setError(err.message);
          setLoading(false);
        }
      });
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Floating Header */}
      <header className="max-w-7xl mx-auto pt-6 px-4">
        <div className="bg-gradient-to-r from-[#8B0000] via-[#A52A2A] to-[#DAA520] p-8 rounded-[2.5rem] shadow-2xl text-white transform hover:scale-[1.01] transition-transform duration-300">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter drop-shadow-md">
              DATA GURU SK KLANG GATE
            </h1>
            <p className="mt-2 text-gold-100 opacity-90 font-medium tracking-wide">
              Sistem Pengurusan Biodata & Maklumat Guru Professional
            </p>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="max-w-7xl mx-auto mt-8 px-4 flex justify-center">
        <div className="inline-flex p-1 space-x-1 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <TabButton 
            active={activeTab === 'Biodata'} 
            onClick={() => setActiveTab('Biodata')}
            icon={<Users className="w-5 h-5 mr-2" />}
            label="Biodata" 
          />
          <TabButton 
            active={activeTab === 'Infografik'} 
            onClick={() => setActiveTab('Infografik')}
            icon={<BarChart3 className="w-5 h-5 mr-2" />}
            label="Infografik" 
          />
          <TabButton 
            active={activeTab === 'Tambah Guru'} 
            onClick={() => setActiveTab('Tambah Guru')}
            icon={<UserPlus className="w-5 h-5 mr-2" />}
            label="Tambah Guru" 
          />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto mt-8 px-4 min-h-[60vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Memuatkan data guru...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-2xl text-center">
            <h2 className="text-xl font-bold mb-2">Ralat Sambungan</h2>
            <p>{error}</p>
            <button 
              onClick={fetchData} 
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Cuba Lagi
            </button>
          </div>
        ) : (
          <div className="fade-in">
            {activeTab === 'Biodata' && <BiodataTab data={teachers} />}
            {activeTab === 'Infografik' && <InfografikTab data={teachers} />}
            {activeTab === 'Tambah Guru' && <TambahGuruTab />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 py-3 text-center">
        <p className="text-gray-400 font-medium text-sm tracking-widest uppercase">
          SK Klang Gate 2026
        </p>
      </footer>
    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
      active 
        ? 'bg-yellow-500 text-white shadow-md' 
        : 'text-gray-500 hover:bg-gray-50'
    }`}
  >
    {icon}
    {label}
  </button>
);

export default App;
