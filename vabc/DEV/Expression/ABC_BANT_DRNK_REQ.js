/*------------------------------------------------------------------------------------------------------/
| Program		: ABC_BANT_DRNK_REQ.js
| Event			: Expression
|
| Usage			: 
| Notes			: Require type of Drink 
| Created by	: AWARRAD - SMS: PRJAUT-2018-00809
| Created at	: 08/06/2018
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
var formVar = expression.getValue("ASI::FORM");

var cashBar = expression.getValue("ASI::CASH BAR SERVING::Cash Bar");
var cbsBeerCash = expression.getValue("ASI::CASH BAR SERVING::Beer_Cash");
var cbsMixedCash = expression.getValue("ASI::CASH BAR SERVING::Mixed_Cash");
var cbsWineCash = expression.getValue("ASI::CASH BAR SERVING::Wine_Cash");

var alcoholCharge = expression.getValue("ASI::BEVERAGE SERVING::Alcohol Charge");
var bsBeerNC = expression.getValue("ASI::BEVERAGE SERVING::Beer_NC");
var bsMixedNC = expression.getValue("ASI::BEVERAGE SERVING::Mixed_NC");
var bsWineNC = expression.getValue("ASI::BEVERAGE SERVING::Wine_NC");

var alcoholIncludedInFee = expression.getValue("ASI::BEVERAGE INCLUDED::Alcohol Included In Fee");
var biBeerIncluded = expression.getValue("ASI::BEVERAGE INCLUDED::Beer_Included");
var biMixedIncluded = expression.getValue("ASI::BEVERAGE INCLUDED::Mixed_Included");
var biWineIncluded = expression.getValue("ASI::BEVERAGE INCLUDED::Wine_Included");

var totalRowCount = expression.getTotalRowCount();
if ((cashBar.value != null && (cashBar.value.equalsIgnoreCase('YES') || cashBar.value.equalsIgnoreCase('Y') || cashBar.value.equalsIgnoreCase('CHECKED')
		|| cashBar.value.equalsIgnoreCase('SELECTED') || cashBar.value.equalsIgnoreCase('TRUE') || cashBar.value.equalsIgnoreCase('ON')))) {
	var cbsBeerCashChecked = !(cbsBeerCash.value.equalsIgnoreCase('NO') || cbsBeerCash.value.equalsIgnoreCase('N') || cbsBeerCash.value.equalsIgnoreCase('UNCHECKED')
			|| cbsBeerCash.value.equalsIgnoreCase('UNSELECTED') || cbsBeerCash.value.equalsIgnoreCase('FALSE') || cbsBeerCash.value.equalsIgnoreCase('OFF'));
	var cbsMixedCashChecked = !(cbsMixedCash.value.equalsIgnoreCase('NO') || cbsMixedCash.value.equalsIgnoreCase('N') || cbsMixedCash.value.equalsIgnoreCase('UNCHECKED')
			|| cbsMixedCash.value.equalsIgnoreCase('UNSELECTED') || cbsMixedCash.value.equalsIgnoreCase('FALSE') || cbsMixedCash.value.equalsIgnoreCase('OFF'));
	var cbsWineCashChecked = !(cbsWineCash.value.equalsIgnoreCase('NO') || cbsWineCash.value.equalsIgnoreCase('N') || cbsWineCash.value.equalsIgnoreCase('UNCHECKED')
			|| cbsWineCash.value.equalsIgnoreCase('UNSELECTED') || cbsWineCash.value.equalsIgnoreCase('FALSE') || cbsWineCash.value.equalsIgnoreCase('OFF'));

	if (!cbsBeerCashChecked && !cbsMixedCashChecked && !cbsWineCashChecked) {
		cashBar.message = "Please check drinks being included in the cash bar";
		expression.setReturn(cashBar);
		formVar.blockSubmit = true;
		expression.setReturn(formVar);
	} else {
		cashBar.message = "";
		expression.setReturn(cashBar);
	}
} else {
	cashBar.message = "";
	expression.setReturn(cashBar);
}

if ((alcoholCharge.value != null && (alcoholCharge.value.equalsIgnoreCase('YES') || alcoholCharge.value.equalsIgnoreCase('Y') || alcoholCharge.value.equalsIgnoreCase('CHECKED')
		|| alcoholCharge.value.equalsIgnoreCase('SELECTED') || alcoholCharge.value.equalsIgnoreCase('TRUE') || alcoholCharge.value.equalsIgnoreCase('ON')))) {
	var bsBeerNCChecked = !(bsBeerNC.value.equalsIgnoreCase('NO') || bsBeerNC.value.equalsIgnoreCase('N') || bsBeerNC.value.equalsIgnoreCase('UNCHECKED')
			|| bsBeerNC.value.equalsIgnoreCase('UNSELECTED') || bsBeerNC.value.equalsIgnoreCase('FALSE') || bsBeerNC.value.equalsIgnoreCase('OFF'));
	var bsMixedNCChecked = !(bsMixedNC.value.equalsIgnoreCase('NO') || bsMixedNC.value.equalsIgnoreCase('N') || bsMixedNC.value.equalsIgnoreCase('UNCHECKED')
			|| bsMixedNC.value.equalsIgnoreCase('UNSELECTED') || bsMixedNC.value.equalsIgnoreCase('FALSE') || bsMixedNC.value.equalsIgnoreCase('OFF'));
	var bsWineNCChecked = !(bsWineNC.value.equalsIgnoreCase('NO') || bsWineNC.value.equalsIgnoreCase('N') || bsWineNC.value.equalsIgnoreCase('UNCHECKED')
			|| bsWineNC.value.equalsIgnoreCase('UNSELECTED') || bsWineNC.value.equalsIgnoreCase('FALSE') || bsWineNC.value.equalsIgnoreCase('OFF'));

	if (!bsBeerNCChecked && !bsMixedNCChecked && !bsWineNCChecked) {
		alcoholCharge.message = "Please check drinks being served at no charge";
		expression.setReturn(alcoholCharge);
		formVar.blockSubmit = true;
		expression.setReturn(formVar);
	} else {
		alcoholCharge.message = "";
		expression.setReturn(alcoholCharge);
	}
} else {
	alcoholCharge.message = "";
	expression.setReturn(alcoholCharge);
}

if ((alcoholIncludedInFee.value != null && (alcoholIncludedInFee.value.equalsIgnoreCase('YES') || alcoholIncludedInFee.value.equalsIgnoreCase('Y')
		|| alcoholIncludedInFee.value.equalsIgnoreCase('CHECKED') || alcoholIncludedInFee.value.equalsIgnoreCase('SELECTED') || alcoholIncludedInFee.value.equalsIgnoreCase('TRUE') || alcoholIncludedInFee.value
		.equalsIgnoreCase('ON')))) {
	var biBeerIncludedChecked = !(biBeerIncluded.value.equalsIgnoreCase('NO') || biBeerIncluded.value.equalsIgnoreCase('N') || biBeerIncluded.value.equalsIgnoreCase('UNCHECKED')
			|| biBeerIncluded.value.equalsIgnoreCase('UNSELECTED') || biBeerIncluded.value.equalsIgnoreCase('FALSE') || biBeerIncluded.value.equalsIgnoreCase('OFF'));
	var biMixedIncludedChecked = !(biMixedIncluded.value.equalsIgnoreCase('NO') || biMixedIncluded.value.equalsIgnoreCase('N')
			|| biMixedIncluded.value.equalsIgnoreCase('UNCHECKED') || biMixedIncluded.value.equalsIgnoreCase('UNSELECTED') || biMixedIncluded.value.equalsIgnoreCase('FALSE') || biMixedIncluded.value
			.equalsIgnoreCase('OFF'));
	var biWineIncludedChecked = !(biWineIncluded.value.equalsIgnoreCase('NO') || biWineIncluded.value.equalsIgnoreCase('N') || biWineIncluded.value.equalsIgnoreCase('UNCHECKED')
			|| biWineIncluded.value.equalsIgnoreCase('UNSELECTED') || biWineIncluded.value.equalsIgnoreCase('FALSE') || biWineIncluded.value.equalsIgnoreCase('OFF'));

	if (!biBeerIncludedChecked && !biMixedIncludedChecked && !biWineIncludedChecked) {
		alcoholIncludedInFee.message = "Please check drinks being included in fee";
		expression.setReturn(alcoholIncludedInFee);
		formVar.blockSubmit = true;
		expression.setReturn(formVar);
	} else {
		alcoholIncludedInFee.message = "";
		expression.setReturn(alcoholIncludedInFee);
	}
} else {
	alcoholIncludedInFee.message = "";
	expression.setReturn(alcoholIncludedInFee);
}
