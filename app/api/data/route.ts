import { getSheetData, getSheetLastUpdate } from '@/lib/sheet/google-sheets';
import { mapSheetData, mapSheetDataRefugee } from '@/utils/dataMapper';

// Force dynamic rendering - always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const spreadsheetId = '11lz-JRqZm7nRt1Ya4ARFPFv4MoMEn72G2ChoaBsewaI';

  try {
    // Fetch data from Google Sheets
    const [lastUpdate, data, poskoData] = await Promise.all([
      getSheetLastUpdate(spreadsheetId),
      getSheetData('KECAMATAN!A5:O', spreadsheetId),
      getSheetData("'POSKO PENGUNGSIAN'!B4:E", spreadsheetId),
    ]);

    const totalPosko = mapSheetDataRefugee(poskoData ?? []);
    const initialData = mapSheetData(data ?? []);

    return Response.json(
      {
        data: initialData,
        lastUpdate: lastUpdate,
        totalPosko: totalPosko.totalPosko,
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
