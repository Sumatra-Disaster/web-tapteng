export interface DisasterData {
  id: string;
  no: number | null;
  kecamatan: string;
  jumlah_penduduk: number;
  meninggal: number;
  luka: number;
  hilang: number;
  belum_ter_evakuasi: number;
  pengungsi_di_luar_pandan: number;
  terdampak: number;
  rumah_rusak_ringan: number;
  rumah_rusak_sedang: number;
  rumah_rusak_berat: number;
  rumah_rusak_hancur_terbawa_arus: number;
  sekolah_rusak_ringan: number;
  sekolah_rusak_sedang: number;
  sekolah_rusak_berat: number;
}

export interface DeceasedData {
  id: string;
  no: number | null;
  name: string;
  jenis_kelamin: string;
  umur: string;
  keterangan: string;
  alamat: string;
  kecamatan: string;
  description: string;
}

export interface EvacueeData {
  id: string;
  name: string;
  location: string;
}

export interface HelipadLocationData {
  id: string;
  no: number | null;
  kecamatan: string;
  desa: string;
  latitude: string;
  longitude: string;
  keterangan: string;
}

export interface TitikJalanPutusData {
  id: string;
  no: number | null; // Overall serial number
  kecamatan: string;
  noKecamatan: number | null; // Incident serial number within sub-district
  namaJalan: string;
  statusJalan: string;
  keterangan: string; // Description of damage
  kondisiTerkini: string; // Current condition
  keteranganTambahan: string; // Additional remarks
}

export type SheetValues = (string | null | undefined)[][];
