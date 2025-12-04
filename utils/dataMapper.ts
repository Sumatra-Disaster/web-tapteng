import {
  DeceasedData,
  DisasterData,
  EvacueeData,
  HelipadLocationData,
  SheetValues,
} from '../interfaces/DisasterData';

const cleanNumber = (value: string | null | undefined): number => {
  if (typeof value === 'string') {
    const cleaned = value.replace(/\s+/g, '').replace(/,/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

export function mapSheetData(sheetData: SheetValues): DisasterData[] {
  if (!sheetData || sheetData.length < 3) {
    return [];
  }

  const dataRows = sheetData.slice(1);

  return dataRows
    .map((row, index): DisasterData | null => {
      if (row.length < 2 || !row[1]) {
        return null;
      }

      const kecamatan = String(row[1]).trim();
      if (kecamatan === '' || kecamatan.toUpperCase() === 'TOTAL') {
        return null;
      }

      if (!row[2]) {
        return null;
      }

      return {
        id: (index + 1).toString(),
        no: cleanNumber(row[0]) || null,
        kecamatan: kecamatan,
        jumlah_penduduk: cleanNumber(row[2]),
        meninggal: cleanNumber(row[3]),
        luka: cleanNumber(row[4]),
        hilang: cleanNumber(row[5]),
        belum_ter_evakuasi: cleanNumber(row[6]),
        pengungsi_di_luar_pandan: cleanNumber(row[7]),
        terdampak: cleanNumber(row[8]),
        rumah_rusak_ringan: cleanNumber(row[9]),
        rumah_rusak_sedang: cleanNumber(row[10]),
        rumah_rusak_berat: cleanNumber(row[11]),
        sekolah_rusak_ringan: cleanNumber(row[12]),
        sekolah_rusak_sedang: cleanNumber(row[13]),
        sekolah_rusak_berat: cleanNumber(row[14]),
      };
    })
    .filter((record): record is DisasterData => record !== null);
}

export function mapSheetDataDeceased(sheetData: SheetValues): DeceasedData[] {
  if (!sheetData || sheetData.length < 3) {
    return [];
  }

  const dataRows = sheetData.slice(1);

  return dataRows
    .map((row, index): DeceasedData | null => {
      if (row.length < 2 || !row[1]) {
        return null;
      }

      const name = String(row[1]).trim();
      if (name === '' || name.toUpperCase() === 'TOTAL') {
        return null;
      }

      if (!row[2]) {
        return null;
      }

      return {
        id: (index + 1).toString(),
        no: cleanNumber(row[0]) || null,
        name: name,
        umur: String(row[2]).trim(),
        alamat: String(row[3]).trim(),
        description: String(row[4]).trim(),
      };
    })
    .filter((record): record is DeceasedData => record !== null);
}

export function mapSheetDataRefugee(sheetData: SheetValues): {
  post: any[];
  total: number;
  totalPosko: number;
} {
  const post: any[] = [];
  let currentKecamatan = '';
  let total = 0;
  let totalPosko = 0;

  for (const row of sheetData) {
    const [kecamatanCol, noCol, namaCol, jumlahCol] = row;

    if (kecamatanCol && kecamatanCol.trim() !== '') {
      currentKecamatan = kecamatanCol.trim();
      post.push({
        kecamatan: currentKecamatan,
        posko: [],
      });
    }

    if (!currentKecamatan) continue;

    const nama = (namaCol as string | undefined)?.trim() ?? '';
    const no = Number(noCol);
    const jumlah = (jumlahCol as string | undefined)?.trim() ?? 'Belum diketahui';

    if (nama.toLowerCase() === 'total' || no === 0) {
      continue;
    }

    if (nama.toLowerCase() !== 'total') {
      totalPosko += 1;
    }

    const poskoItem = { no, nama, jumlah };
    post[post.length - 1].posko.push(poskoItem);

    const parsed = parseInt(jumlah);
    if (!isNaN(parsed)) {
      total += parsed;
    }
  }

  return { post, total, totalPosko };
}

export function mapSheetDataEvacuee(sheetData: SheetValues, location: string): EvacueeData[] {
  if (!sheetData || sheetData.length === 0) {
    return [];
  }

  return sheetData
    .map((row, index): EvacueeData | null => {
      if (!row[0]) {
        return null;
      }

      const name = String(row[0]).trim();
      if (name === '') {
        return null;
      }

      return {
        // Include location in the id so it's unique even when merging multiple tabs
        id: `${location}-${index + 1}`,
        name,
        location,
      };
    })
    .filter((record): record is EvacueeData => record !== null);
}

export function mapSheetDataHelipad(sheetData: SheetValues): HelipadLocationData[] {
  if (!sheetData || sheetData.length < 3) {
    return [];
  }

  // Skip header rows (first 2 rows) and process data
  const dataRows = sheetData.slice(2);

  let currentKecamatan = '';

  return dataRows
    .map((row, index): HelipadLocationData | null => {
      // Skip NO column (row[0]), start from KECAMATAN (row[1])
      const kecamatanValue = row[1];
      const desaValue = row[2];
      const latitudeValue = row[3];
      const longitudeValue = row[4];
      const keteranganValue = row[5];

      // Update current KECAMATAN if it exists
      if (kecamatanValue && String(kecamatanValue).trim() !== '') {
        currentKecamatan = String(kecamatanValue).trim();
      }

      // Validate required fields
      if (!desaValue || String(desaValue).trim() === '') {
        return null;
      }

      const desa = String(desaValue).trim();
      const latitude = latitudeValue ? String(latitudeValue).trim() : '';
      const longitude = longitudeValue ? String(longitudeValue).trim() : '';
      const keterangan = keteranganValue ? String(keteranganValue).trim() : '';

      return {
        id: `helipad-${index + 1}`,
        no: null, // Will be generated automatically in the component
        kecamatan: currentKecamatan || '',
        desa,
        latitude,
        longitude,
        keterangan,
      };
    })
    .filter((record): record is HelipadLocationData => record !== null);
}
