
export interface Teacher {
  Nama: string;
  Gred: string;
  Pengkhususan: string;
  Kelulusan: string;
  Gambar: string;
  [key: string]: string; // Support for additional dynamic columns
}

export type TabType = 'Biodata' | 'Infografik' | 'Tambah Guru';
