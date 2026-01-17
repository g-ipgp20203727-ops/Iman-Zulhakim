
import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Teacher } from '../types';
import Modal from './Modal';

interface BiodataTabProps {
  data: Teacher[];
}

const BiodataTab: React.FC<BiodataTabProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGred, setFilterGred] = useState('Semua');
  const [filterBidang, setFilterBidang] = useState('Semua');
  const [pageSize, setPageSize] = useState<number | 'Semua'>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Extract unique filter options
  const gredOptions = useMemo(() => 
    ['Semua', ...Array.from(new Set(data.map(t => t.Gred))).filter(Boolean).sort()], 
    [data]
  );
  
  const bidangOptions = useMemo(() => 
    ['Semua', ...Array.from(new Set(data.map(t => t.Pengkhususan))).filter(Boolean).sort()], 
    [data]
  );

  // Filtering Logic
  const filteredData = useMemo(() => {
    return data.filter(teacher => {
      const matchSearch = teacher.Nama.toLowerCase().includes(searchTerm.toLowerCase());
      const matchGred = filterGred === 'Semua' || teacher.Gred === filterGred;
      const matchBidang = filterBidang === 'Semua' || teacher.Pengkhususan === filterBidang;
      return matchSearch && matchGred && matchBidang;
    });
  }, [data, searchTerm, filterGred, filterBidang]);

  // Pagination Logic
  const totalPages = pageSize === 'Semua' ? 1 : Math.ceil(filteredData.length / Number(pageSize));
  const paginatedData = useMemo(() => {
    if (pageSize === 'Semua') return filteredData;
    const start = (currentPage - 1) * Number(pageSize);
    return filteredData.slice(start, start + Number(pageSize));
  }, [filteredData, currentPage, pageSize]);

  const handleReset = () => {
    setSearchTerm('');
    setFilterGred('Semua');
    setFilterBidang('Semua');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative col-span-1 md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Cari nama guru..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          
          <select 
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-yellow-400 outline-none transition-all cursor-pointer"
            value={filterGred}
            onChange={(e) => {
              setFilterGred(e.target.value);
              setCurrentPage(1);
            }}
          >
            {gredOptions.map(opt => <option key={opt} value={opt}>{opt === 'Semua' ? 'Tapis Gred' : opt}</option>)}
          </select>

          <select 
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-yellow-400 outline-none transition-all cursor-pointer"
            value={filterBidang}
            onChange={(e) => {
              setFilterBidang(e.target.value);
              setCurrentPage(1);
            }}
          >
            {bidangOptions.map(opt => <option key={opt} value={opt}>{opt === 'Semua' ? 'Tapis Pengkhususan' : opt}</option>)}
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-50 pt-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Paparkan</span>
            <select 
              className="px-2 py-1 rounded bg-gray-100 outline-none"
              value={pageSize}
              onChange={(e) => {
                const val = e.target.value;
                setPageSize(val === 'Semua' ? 'Semua' : Number(val));
                setCurrentPage(1);
              }}
            >
              {[10, 20, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}
              <option value="Semua">Semua</option>
            </select>
            <span>baris</span>
          </div>

          <button 
            onClick={handleReset}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-red-600 font-medium text-sm hover:bg-red-50 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Set Semula
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Gred</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Pengkhususan</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Kelulusan</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Gambar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.length > 0 ? paginatedData.map((teacher, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-5">
                  <span className="font-semibold text-gray-800">{teacher.Nama}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium">
                    {teacher.Gred}
                  </span>
                </td>
                <td className="px-6 py-5 text-gray-600">{teacher.Pengkhususan}</td>
                <td className="px-6 py-5 text-gray-600 italic text-sm">{teacher.Kelulusan}</td>
                <td className="px-6 py-5">
                  <div 
                    className="relative w-12 h-12 rounded-lg border-2 border-gray-200 overflow-hidden cursor-pointer group-hover:border-yellow-400 transition-all shadow-sm"
                    onClick={() => setSelectedImage(teacher.Gambar || 'https://picsum.photos/400/500?grayscale')}
                  >
                    <img 
                      src={teacher.Gambar || 'https://picsum.photos/100/100?grayscale'} 
                      alt={teacher.Nama}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://picsum.photos/100/100?grayscale';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Maximize2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-medium">
                  Tiada rekod dijumpai bagi kriteria carian anda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pageSize !== 'Semua' && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <p className="text-sm text-gray-500">
            Menunjukkan {((currentPage - 1) * Number(pageSize)) + 1} hingga {Math.min(currentPage * Number(pageSize), filteredData.length)} daripada {filteredData.length} entri
          </p>
          <div className="flex space-x-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-1">
              {[...Array(totalPages)].map((_, i) => {
                 const page = i + 1;
                 if (totalPages > 5 && Math.abs(page - currentPage) > 2 && page !== 1 && page !== totalPages) {
                   if (Math.abs(page - currentPage) === 3) return <span key={page}>...</span>;
                   return null;
                 }
                 return (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      currentPage === page 
                        ? 'bg-yellow-500 text-white shadow-md' 
                        : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                 );
              })}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <Modal 
          isOpen={!!selectedImage} 
          onClose={() => setSelectedImage(null)}
          content={
            <div className="p-1">
              <img 
                src={selectedImage} 
                alt="Teacher Profile" 
                className="w-full h-auto rounded-2xl max-h-[70vh] object-contain shadow-2xl"
              />
            </div>
          }
        />
      )}
    </div>
  );
};

export default BiodataTab;
