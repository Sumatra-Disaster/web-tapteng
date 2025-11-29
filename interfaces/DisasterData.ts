export interface DisasterData {
  id: string;
  no: number | null;
  kecamatan: string;
  jumlah_penduduk: number;
  meninggal: number;
  luka: number;
  hilang: number;
  pengungsi_di_luar_pandan: number;
  terdampak: number;
  rumah_rusak_ringan: number;
  rumah_rusak_sedang: number;
  rumah_rusak_berat: number;
  sekolah_rusak_ringan: number;
  sekolah_rusak_sedang: number;
  sekolah_rusak_berat: number;
}

export interface DeceasedData {
  id: string;
  no: number | null;
  name: string;
  umur: string;
  alamat: string;
  description: string;
}

export type SheetValues = (string | null | undefined)[][];
