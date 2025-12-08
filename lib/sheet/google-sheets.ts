import { google, sheets_v4 } from 'googleapis';

type SheetValues = sheets_v4.Schema$ValueRange['values'];

/**
 * Get the spreadsheet ID from environment variables.
 * Validates at runtime when called.
 * Throws an error if GOOGLE_SHEETS_DB_ID is not set.
 */
export function getSpreadsheetId(): string {
  const spreadsheetId = process.env.GOOGLE_SHEETS_DB_ID;

  if (!spreadsheetId) {
    throw new Error(
      'Missing GOOGLE_SHEETS_DB_ID environment variable. Please set it in your .env.local file.',
    );
  }

  return spreadsheetId;
}

async function getAuth() {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error('Missing Google Sheets environment variables.');
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey.replace(/\\n/g, '\n'),
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets.readonly',
      'https://www.googleapis.com/auth/drive.readonly',
    ],
  });
}

export async function getSheetData(range: string, spreadsheetId: string): Promise<SheetValues> {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    console.error('Missing Google Sheets environment variables.');

    return [];
  }

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,

      key: privateKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range,
    });

    return (response.data.values || []) as SheetValues;
  } catch (error) {
    console.error('Error fetching sheet data:', error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Get the last modified time of a Google Sheet
 * Returns the date in the format expected by the component: [[null, "date string"]]
 * Note: Google Drive's modifiedTime may not update immediately when cells are edited.
 * It typically updates when the file metadata changes or after a short delay.
 */
export async function getSheetLastUpdate(spreadsheetId: string): Promise<SheetValues> {
  if (!spreadsheetId) {
    return [];
  }

  try {
    const auth = await getAuth();
    const drive = google.drive({ version: 'v3', auth });

    // Fetch with supportsAllDrives to ensure we get the latest data
    const response = await drive.files.get({
      fileId: spreadsheetId,
      fields: 'modifiedTime',
      supportsAllDrives: true,
    });

    if (response.data.modifiedTime) {
      const modifiedDate = new Date(response.data.modifiedTime);

      // Format the date for Indonesian locale with consistent timezone handling
      // Use Intl.DateTimeFormat for more reliable cross-environment behavior
      // Google Drive returns modifiedTime in ISO 8601 format (UTC)
      const formatter = new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta',
      });

      const formattedDate = formatter.format(modifiedDate);

      // Return in the format expected by the component: [[null, "date string"]]
      return [[null, formattedDate]];
    }

    return [];
  } catch (error) {
    console.error(
      'Error fetching sheet last update:',
      error instanceof Error ? error.message : error,
    );
    return [];
  }
}
