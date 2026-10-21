// Paste into the Google Sheet: Extensions > Apps Script. Set SECRET, then
// Deploy > New deployment > Web app > Execute as: Me, Access: Anyone.
// Copy the web app URL into GOOGLE_SHEET_WEBHOOK_URL, and SECRET into GOOGLE_SHEET_SECRET.
var SECRET = "gsheet_sec_7x9k2m4p8q1v5w3z";

function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  if (d.secret !== SECRET) return out("forbidden"); // the site's server sends it; browsers never see it

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(d.tab) || ss.insertSheet(d.tab);
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var cols = sh.getLastColumn() ? sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0] : [];
    Object.keys(d.row).forEach(function (k) {
      if (cols.indexOf(k) < 0) { cols.push(k); sh.getRange(1, cols.length).setValue(k).setFontWeight("bold"); }
    });

    var line = -1;
    if (d.key) {                       // update-in-place by the first column ("Order Id")
      var ids = sh.getRange(2, 1, Math.max(1, sh.getLastRow() - 1), 1).getValues();
      for (var i = 0; i < ids.length; i++) if (String(ids[i][0]) === d.key) { line = i + 2; break; }
    }
    if (line < 0) line = sh.getLastRow() + 1;

    Object.keys(d.row).forEach(function (k) {
      sh.getRange(line, cols.indexOf(k) + 1).setValue(safe(d.row[k]));
    });
  } finally { lock.releaseLock(); }
  return out("ok");
}

// Visitor text starting with = + - @ would run as a formula (e.g. IMPORTXML
// sending other rows to an outside server). A leading ' keeps it plain text.
function safe(v) { return typeof v === "string" && /^[=+\-@\t\r]/.test(v) ? "'" + v : v; }

function out(s) { return ContentService.createTextOutput(s); }
