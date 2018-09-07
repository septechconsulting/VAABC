/*------------------------------------------------------------------------------------------------------/
| Program		: TASTING_DRINK_LIMITS.js
| Event			: Expression
|
| Usage			: 
| Notes			: Restrict user to enter up to four rows to the Sample Details for Tasting Application
| Created by	: AWARRAD - SMS: PRJAUT-2018-00742
| Created at	: 07/25/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
var toPrecision = function(value) {
	var multiplier = 10000;
	return Math.round(value * multiplier) / multiplier;
}
function addDate(iDate, nDays) {
	if (isNaN(nDays)) {
		throw ("Day is a invalid number!");
	}
	return expression.addDate(iDate, parseInt(nDays));
}

function diffDate(iDate1, iDate2) {
	return expression.diffDate(iDate1, iDate2);
}

function parseDate(dateString) {
	return expression.parseDate(dateString);
}

function formatDate(dateString, pattern) {
	if (dateString == null || dateString == '') {
		return '';
	}
	return expression.formatDate(dateString, pattern);
}

var servProvCode = expression.getValue("$$servProvCode$$").value;
var variable0 = expression.getValue("ASIT::SAMPLE DETAILS::FORM");

var totalRowCount = expression.getTotalRowCount();
for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {
	if (totalRowCount > 4) {
		variable0 = expression.getValue(rowIndex, "ASIT::SAMPLE DETAILS::FORM");
		variable0.blockSubmit = true;
		expression.setReturn(rowIndex, variable0);

		variable0.message = "Please enter only a maximum of four rows to the Samples";
		expression.setReturn(rowIndex, variable0);
	}
}
