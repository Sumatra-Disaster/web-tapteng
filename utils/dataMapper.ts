import {
  DeceasedData,
  DisasterData,
  SheetValues,
} from "../interfaces/DisasterData";

const cleanNumber = (value: string | null | undefined): number => {
  if (typeof value === "string") {
    const cleaned = value.replace(/\s+/g, "").replace(/,/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

export function mapSheetData(sheetData: SheetValues): DisasterData[] {
  if (!sheetData || sheetData.length < 3) {
    return [];
  }

  const dataRows = sheetData.slice(1, sheetData.length - 2);

  return dataRows
    .map((row, index): DisasterData | null => {
      if (row.length < 2 || !row[1]) {
        return null;
      }

      const kecamatan = String(row[1]).trim();
      if (kecamatan === "") {
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
        pengungsi_di_luar_pandan: cleanNumber(row[6]),
        terdampak: cleanNumber(row[7]),
        rumah_rusak_ringan: cleanNumber(row[8]),
        rumah_rusak_sedang: cleanNumber(row[9]),
        rumah_rusak_berat: cleanNumber(row[10]),
        sekolah_rusak_ringan: cleanNumber(row[11]),
        sekolah_rusak_sedang: cleanNumber(row[12]),
        sekolah_rusak_berat: cleanNumber(row[13]),
      };
    })
    .filter((record): record is DisasterData => record !== null);
}

export function mapSheetDataDeceased(sheetData: SheetValues): DeceasedData[] {
  if (!sheetData || sheetData.length < 3) {
    return [];
  }

  const dataRows = sheetData.slice(1, sheetData.length - 2);

  return dataRows
    .map((row, index): DeceasedData | null => {
      if (row.length < 2 || !row[1]) {
        return null;
      }

      const name = String(row[1]).trim();
      if (name === "") {
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
