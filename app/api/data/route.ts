import { getSheetData, getSheetLastUpdate, getSpreadsheetId } from '@/lib/sheet/google-sheets';
import {
  mapSheetData,
  mapSheetDataRefugee,
  mapSheetDataHelipad,
  mapSheetDataKondisiJalan,
} from '@/utils/dataMapper';

// Force dynamic rendering - always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const spreadsheetId = getSpreadsheetId();
    // Fetch data from Google Sheets
    const [lastUpdate, data, poskoData, helipadData, jalanPutusData] = await Promise.all([
      getSheetLastUpdate(spreadsheetId),
      getSheetData('KECAMATAN!A5:P', spreadsheetId),
      getSheetData("'POSKO PENGUNGSIAN'!B4:E", spreadsheetId),
      getSheetData("'TITIK-LOKASI-HELIDROP'!A3:F", spreadsheetId),
      getSheetData("'TITIK JALAN PUTUS'!A1:H", spreadsheetId),
    ]);

    const totalPosko = mapSheetDataRefugee(poskoData ?? []);
    const helipadLocations = mapSheetDataHelipad(helipadData ?? []);
    const jalanPutusLocations = mapSheetDataKondisiJalan(jalanPutusData ?? []);
    const initialData = mapSheetData(data ?? []);

    return Response.json(
      {
        data: initialData,
        lastUpdate: lastUpdate,
        totalPosko: totalPosko.totalPosko,
        totalHelipadLocations: helipadLocations.length,
        totalTitikJalanPutus: jalanPutusLocations.length,
        timestamp: Date.now(),
        success: true,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      },
    );
  } catch (error) {
    console.error('Error fetching data from API route:', error);
    return Response.json(
      {
        error: 'Failed to fetch data',
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      },
      { status: 500 },
    );
  }
}
