-- Create disaster data table
CREATE TABLE IF NOT EXISTS disaster_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  no INTEGER NOT NULL,
  kecamatan TEXT NOT NULL,
  jumlah_penduduk INTEGER NOT NULL,
  meninggal INTEGER DEFAULT 0,
  luka INTEGER DEFAULT 0,
  hilang INTEGER DEFAULT 0,
  pengungsi_di_luar_pandan INTEGER DEFAULT 0,
  terdampak INTEGER DEFAULT 0,
  rumah_rusak_ringan INTEGER DEFAULT 0,
  rumah_rusak_sedang INTEGER DEFAULT 0,
  rumah_rusak_berat INTEGER DEFAULT 0,
  sekolah_rusak_ringan INTEGER DEFAULT 0,
  sekolah_rusak_sedang INTEGER DEFAULT 0,
  sekolah_rusak_berat INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_disaster_data_kecamatan ON disaster_data(kecamatan);
CREATE INDEX IF NOT EXISTS idx_disaster_data_created_at ON disaster_data(created_at DESC);

-- Insert sample data from the image
INSERT INTO disaster_data (no, kecamatan, jumlah_penduduk, meninggal, luka, hilang, pengungsi_di_luar_pandan, terdampak, rumah_rusak_ringan, rumah_rusak_sedang, rumah_rusak_berat, sekolah_rusak_ringan, sekolah_rusak_sedang, sekolah_rusak_berat) VALUES
(1, 'PANDAN', 67081, 11, 2, 8, 1010, 67081, 0, 0, 0, 0, 0, 1),
(2, 'TURKA', 16124, 26, 505, 34, 0, 16124, 0, 0, 0, 0, 0, 14),
(3, 'BADIRI', 29875, 1, 0, 12, 0, 29875, 0, 0, 0, 0, 0, 7),
(4, 'SARUDIK', 25144, 0, 0, 0, 0, 22630, 0, 0, 0, 0, 0, 0),
(5, 'TAPIAN NAULI', 21970, 0, 0, 0, 0, 17576, 0, 0, 0, 0, 0, 1),
(6, 'PINANGSORI', 27638, 0, 0, 0, 0, 8291, 0, 0, 0, 0, 0, 0),
(7, 'SIBABANGUN', 19829, 0, 0, 0, 0, 7932, 0, 0, 0, 0, 0, 0),
(8, 'SUKABANGUN', 4380, 0, 0, 0, 0, 3604, 0, 0, 0, 0, 0, 0),
(9, 'PASARIBU TOBING', 8232, 0, 0, 0, 0, 2058, 0, 0, 0, 0, 0, 4),
(10, 'SOSORGADONG', 16046, 0, 0, 0, 0, 6418, 0, 0, 0, 0, 0, 0),
(11, 'KOLANG', 22857, 0, 0, 0, 0, 20661, 0, 0, 0, 0, 0, 0),
(12, 'SORKAM', 18110, 0, 0, 0, 0, 16299, 0, 0, 0, 0, 0, 0),
(13, 'BARUS', 18779, 2, 0, 0, 0, 18779, 0, 0, 0, 0, 0, 0),
(14, 'BARUS UTARA', 6312, 0, 0, 0, 0, 2656, 0, 0, 0, 0, 0, 0),
(15, 'MANDUAMAS', 25317, 0, 0, 0, 0, 15190, 0, 0, 0, 0, 0, 0),
(16, 'ANDAM DEWI', 17652, 0, 0, 0, 0, 10691, 0, 0, 0, 0, 0, 0),
(17, 'LUMUT', 13844, 0, 0, 0, 0, 10383, 0, 0, 0, 0, 0, 0),
(18, 'SIRANDORUNG', 18610, 0, 0, 0, 0, 13027, 0, 0, 0, 0, 0, 8),
(19, 'SITAHUIS', 6478, 15, 0, 19, 0, 1943, 0, 0, 0, 0, 0, 0),
(20, 'SORKAM BARAT', 19526, 0, 1, 0, 0, 3905, 0, 0, 0, 0, 0, 0)
ON CONFLICT DO NOTHING;
