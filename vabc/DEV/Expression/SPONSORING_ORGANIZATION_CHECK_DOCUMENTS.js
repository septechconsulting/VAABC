/*------------------------------------------------------------------------------------------------------/
| Program		: SPONSORING_ORGANIZATION_CHECK_DOCUMENTS.js
| Event			: Expression
|
| Usage			: 
| Notes			: Display message for ACA and back office user, when Contact Type is "Sponsoring Organization" and Tax Exempt = No
| Created by	: AWARRAD - SMS: PRJAUT-2018-00733
| Created at	: 07/31/2018
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
var variable0 = expression.getValue("CAP::capType");
var variable1 = expression.getValue("CONTACTTPLFORM::ABC_C_SPOINF::NON PROFIT INFO::Tax Exempt");

var totalRowCount = expression.getTotalRowCount();
if (variable0.value != null) {
	var recordType = variable0.value.split("/");
	if (recordType[0].equalsIgnoreCase("Licenses") && recordType[3].equalsIgnoreCase("Application")) {
		if (variable1.value != null
				&& (variable1.value.equalsIgnoreCase('NO') || variable1.value.equalsIgnoreCase('N') || variable1.value.equalsIgnoreCase('UNCHECKED')
						|| variable1.value.equalsIgnoreCase('UNSELECTED') || variable1.value.equalsIgnoreCase('FALSE') || variable1.value.equalsIgnoreCase('OFF'))) {
			variable1.message = "Check the types of documents you have: Charter with the State Corporation Commission and By-laws or articles that list the organization's stated purpose";
			expression.setReturn(variable1);
		}else{
			variable1.message = "";
			expression.setReturn(variable1);
		}
	}
}
