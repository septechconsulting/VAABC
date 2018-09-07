/*------------------------------------------------------------------------------------------------------/
| Program		: PARTICIPATING_MANUFACTURERS_MUST_ENTER_ROW.js
| Event			: Expression
|
| Usage			: 
| Notes			: validate Manufacturer Event Application. If custom field �Does the hosting organization have a list of all participating breweries, wineries or distilleries?� is �Yes� then require the applicant to enter at least one manufacturer in Custom Table 'PARTICIPATING MANUFACTURERS'
| Created by	: AWARRAD - SMS: PRJAUT-2018-00666
| Created at	: 07/30/2018
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
var variable0 = expression.getValue("ASIT::PARTICIPATING MANUFACTURERS::FORM");
var variable1 = expression.getValue("ASI::EVENT DOCUMENTATION::List of Participating Facilities");

var totalRowCount = expression.getTotalRowCount() - 1;

if ((variable1.value != null && (variable1.value.equalsIgnoreCase('YES') || variable1.value.equalsIgnoreCase('Y') || variable1.value.equalsIgnoreCase('CHECKED')
		|| variable1.value.equalsIgnoreCase('SELECTED') || variable1.value.equalsIgnoreCase('TRUE') || variable1.value.equalsIgnoreCase('ON')))) {
	if (totalRowCount < 1) {
		variable0.blockSubmit = true;
		expression.setReturn(variable0);

		variable0.message = "Please enter Participating Manufacturers";
		expression.setReturn(variable0);
	}
}
