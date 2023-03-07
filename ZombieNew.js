// URL do kopii poniższego pliku
var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1xquibFinq1TI7tbh75X1JB9xNq5G7NTfX4oqPQ3W0s8/edit?usp=sharing';

// Liczba kliknięć, poniżej której produkty uznawane są za martwe +20 (arkusz dostosowany do 30 kliknięć)
var THRESHOLD = '50';
// Tutaj możemy zmienić "metrics.impressions < 100" - produkt, ma mniej niż 100 wyświetleń oraz "metrics.conversions = 0" - liczba konwersji =0 
// Czyli obecny warunek, który wybiera produkty do excela to - < 30kliknięć && < 100wyświetleń && 0konwersji
var FILTER_ALL = 'metrics.clicks < ' + THRESHOLD + ' AND metrics.impressions < 100 AND metrics.conversions = 0' ;

var USE_CAMPAIGN_FILTER = true;
// 
// nazwa kampanii w miejsce "YOUR_CAMPAIGN_NAME"
// VVVVVVVVVVVVVVVVVVVVVV
var FILTER_CAMPAIGN_NAME = ' AND campaign.name LIKE "YOUR_CAMPAIGN_NAME" ';

var TIME_DURATION = 'LAST_30_DAYS';

// Ilość przetwarzanych produktów
var COUNT_LIMIT = '25000';

function main() {
  Logger.log('Wszystkich oznaczonych produktów LABEL_LOW z warunku FILTER_ALL');
	getFilteredShoppingProducts(FILTER_ALL, 'ALL');
}

function getFilteredShoppingProducts(filters, ReportName) {

	if (USE_CAMPAIGN_FILTER) {
		filters = filters + FILTER_CAMPAIGN_NAME
	}
	var query = 'SELECT segments.product_item_id, ' +
		'metrics.clicks, campaign.name' +
		' FROM shopping_performance_view WHERE ' + filters +
		' AND segments.product_item_id != "undefined"' +
		' AND segments.date DURING ' + TIME_DURATION +
		' ORDER BY metrics.clicks DESC LIMIT ' + COUNT_LIMIT;
  
	var report = AdsApp.report(query);
    // Czyszczenie
    var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
	var sheet = spreadsheet.getSheetByName('ALL');
	var lastRow = sheet.getMaxRows();
	sheet.getRange('A2:B' + lastRow).clearContent();
  // Raportowanie
    report.exportToSheet(SpreadsheetApp.openByUrl(SPREADSHEET_URL).getSheetByName(ReportName));
}
