/*------------------------------------------------------------------------------------------------------/
| Program		: ABC_RTLR_AP_REQUIRED_FIELDS.js
| Event			: Expression
|
| Usage			: 
| Notes			: Retail-Specialty Required Fields
| Created by	: AWarrad - SMS: PRJAUT-2018-00862
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

var servProvCode = expression.getValue("$$servProvCode$$").value;
var businessType = expression.getValue("ASI::ALCOHOL INFO::What is the type of business conducted at the establishment?");

var availableRooms = expression.getValue("ASI::ROOM INFO::How many guest rooms are available?");
var totalRooms = expression.getValue("ASI::ROOM INFO::What is the total number of rooms?");

var hadOpenPlace = expression.getValue("ASI::ESTABLISHMENT INFO::Has the intended licensee had an open place of business for at least one year?");

var whereWillConsumed = expression.getValue("ASI::ALCOHOL INFO::Where will the alcohol be consumed?");
var beer = expression.getValue("ASI::ALCOHOL INFO::Beer");
var wine = expression.getValue("ASI::ALCOHOL INFO::Wine");

var totalRowCount = expression.getTotalRowCount();

// Bed and Breakfast
if (businessType.value != null && businessType.value.equals(String("Bed and Breakfast"))) {
	availableRooms.hidden = false;
	expression.setReturn(availableRooms);

	totalRooms.hidden = false;
	expression.setReturn(totalRooms);

	availableRooms.required = true;
	expression.setReturn(availableRooms);

	totalRooms.required = true;
	expression.setReturn(totalRooms);
} else {
	availableRooms.hidden = true;
	expression.setReturn(availableRooms);
	totalRooms.hidden = true;
	expression.setReturn(totalRooms);
	availableRooms.required = false;
	expression.setReturn(availableRooms);
	totalRooms.required = false;
	expression.setReturn(totalRooms);
}

// Giftshop
if (businessType.value != null && businessType.value.equals(String("Giftshop"))) {
	hadOpenPlace.hidden = false;
	expression.setReturn(hadOpenPlace);

	hadOpenPlace.required = true;
	expression.setReturn(hadOpenPlace);
} else {
	hadOpenPlace.hidden = true;
	expression.setReturn(hadOpenPlace);

	hadOpenPlace.required = false;
	expression.setReturn(hadOpenPlace);
}

// Historic Beer Museum
if (businessType.value != null && businessType.value.equals(String("Historic Beer Museum"))) {
	whereWillConsumed.value = String("On Premises");
	expression.setReturn(whereWillConsumed);

	whereWillConsumed.readOnly = true;
	expression.setReturn(whereWillConsumed);

	beer.value = "CHECKED";
	expression.setReturn(beer);

	beer.readOnly = true;
	expression.setReturn(beer);

	beer.hidden = false;
	expression.setReturn(beer);

	wine.value = "UNCHECKED";
	expression.setReturn(wine);

	wine.readOnly = true;
	expression.setReturn(wine);
} else {
	whereWillConsumed.readOnly = false;
	expression.setReturn(whereWillConsumed);
	beer.readOnly = false;
	expression.setReturn(beer);
	wine.readOnly = false;
	expression.setReturn(wine);
}