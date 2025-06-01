import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const auth = new google.auth.GoogleAuth({
  keyFile: "onyx-silo-455922-i2-e6697cb7fda0.json", // Path to your service account JSON file
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const appendToEventSheet = async (spreadsheetId, sheetName, rowData) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  // Check if sheet exists
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const sheetExists = spreadsheet.data.sheets.some(
    (sheet) => sheet.properties.title === sheetName
  );

  if (!sheetExists) {
    // Create new sheet
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetName,
              },
            },
          },
        ],
      },
    });

    // Add headers
    const headers = [
      "Name", "Email", "RollNumber", "Phone", "College",
      "Department", "Section", "Semester", "Event", "RegisteredAt"
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [headers],
      },
    });
  }

  // Append registration data
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [rowData],
    },
  });
};
