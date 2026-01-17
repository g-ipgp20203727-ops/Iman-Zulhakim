
import React from 'react';
import { FORM_URL } from '../constants';

const TambahGuruTab: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden min-h-[800px]">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Daftar Guru Baru</h2>
            <p className="text-gray-500 text-sm">Sila lengkapkan butiran berikut untuk pendaftaran pangkalan data.</p>
          </div>
          <div className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
            Sistem Aktif
          </div>
        </div>
        
        <div className="relative w-full h-[700px]">
          <iframe 
            src={FORM_URL}
            width="100%" 
            height="100%" 
            frameBorder="0" 
            marginHeight={0} 
            marginWidth={0} 
            title="Borang Tambah Guru SK Klang Gate"
            className="absolute inset-0"
          >
            Memuatkan borang...
          </iframe>
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-400 text-sm max-w-md">
        Pendaftaran ini akan dikemaskini secara automatik dalam pangkalan data utama selepas pengesahan pentadbir.
      </div>
    </div>
  );
};

export default TambahGuruTab;
