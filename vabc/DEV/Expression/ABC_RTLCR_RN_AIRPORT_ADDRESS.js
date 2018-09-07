/*------------------------------------------------------------------------------------------------------/
| Program		: ABC_RTLCR_RN_AIRPORT_ADDRESS.js
| Event			: Expression
|
| Usage			: 
| Notes			: Retail-Restaurant info
| Created by	: AWarrad - SMS: PRJAUT-2018-00856
| Created at	: 09/05/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
aa = expression.getScriptRoot();
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

function lookup(stdChoice, stdValue) {
	var strControl = null;
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice, stdValue);

	if (bizDomScriptResult.getSuccess()) {
		var bizDomScriptObj = bizDomScriptResult.getOutput();
		strControl = "" + bizDomScriptObj.getDescription();
	}
	return strControl;
}

var servProvCode = expression.getValue("$$servProvCode$$").value;
var airport = expression.getValue("ASI::AIRPORT LOCATION INFO::Select the Airport that the establishment is located upon/within");
var addressAsi = expression.getValue("ASI::AIRPORT LOCATION INFO::Address");

var totalRowCount = expression.getTotalRowCount();

if (airport.getValue() != null && airport.getValue() != "") {
	var address = lookup("ABC_Airport", airport.getValue());
	if (address != null) {
		addressAsi.value = String(address);
		expression.setReturn(addressAsi);
	}
}