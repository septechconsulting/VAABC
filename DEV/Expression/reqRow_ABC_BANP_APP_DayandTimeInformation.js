/*------------------------------------------------------------------------------------------------------/
| Program		: reqRow_ABC_BANP_APP_DayandTimeInformation.js
| Event			: Expression
|
| Usage			: onSubmit
| Notes			: make sure there is at least 1 row in ASIT 'DAY AND TIME INFORMATION'
| Created by	: Yazan Barghouth - SMS: PRJAUT-2018-01039
| Created at	: 09/04/2018
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

try {
	var servProvCode = expression.getValue("$$servProvCode$$").value;
	var asitForm = expression.getValue("ASIT::DAY AND TIME INFORMATION::FORM");

	if (expression.getTotalRowCount() == 1) {
		asitForm.message = "Please enter at least 1 event date";
		asitForm.blockSubmit = true;
		expression.setReturn(asitForm);
	}
} catch (ex) {
	asitForm.message = "Error: " + ex;
	asitForm.blockSubmit = true;
	expression.setReturn(asitForm);
}
