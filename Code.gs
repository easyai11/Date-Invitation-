const SHEET_NAME = "Date Answers";

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  sheet.appendRow([
    data.answer || "",
    data.food || "",
    data.date || "",
    data.time || "",
    data.message || "",
    new Date()
  ]);
  return ContentService.createTextOutput(JSON.stringify({success:true}))
    .setMimeType(ContentService.MimeType.JSON);
}
