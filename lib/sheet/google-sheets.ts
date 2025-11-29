import { google, sheets_v4 } from "googleapis";

type SheetValues = sheets_v4.Schema$ValueRange["values"];

export async function getSheetData(
  range: string,
  spreadsheetId: string
): Promise<SheetValues> {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    console.error("Missing Google Sheets environment variables.");

    return [];
  }

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,

      key: privateKey.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range,
    });

    return (response.data.values || []) as SheetValues;
  } catch (error) {
    console.error(
      "Error fetching sheet data:",
      error instanceof Error ? error.message : error
    );
    return [];
  }
}
