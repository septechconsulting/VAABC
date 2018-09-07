/*------------------------------------------------------------------------------------------------------/
| Program		: ABC_RTLRS_RN_REQUIRED_FIELDS.js
| Event			: Expression
|
| Usage			: 
| Notes			: Retail-Restaurant info
| Created by	: AWarrad - SMS: PRJAUT-2018-00855
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

// CATERER SALES INFO
var catererSalesInfo = {};
catererSalesInfo.catererEstimatedSalesFigures = expression.getValue("ASI::CATERER SALES INFO::Caterer Estimated Sales Figures");
catererSalesInfo.catererSalesInfoMonth = expression.getValue("ASI::CATERER SALES INFO::Caterer Sales Info for Month of");
catererSalesInfo.catererSalesInfoYear = expression.getValue("ASI::CATERER SALES INFO::Caterer Sales Info for Year of");
catererSalesInfo.catererSalesInfoDays = expression.getValue("ASI::CATERER SALES INFO::Caterer Sales Info for Number of Days");
catererSalesInfo.totalSales = expression.getValue("ASI::CATERER SALES INFO::Total Food and Nonalcoholic beverages sales");

// RESTAURANT SALES INFO
var restaurantSalesInfo = {};
restaurantSalesInfo.restaurantEstimatedSalesFigures = expression.getValue("ASI::RESTAURANT SALES INFO::Restaurant Estimated Sales Figures");
restaurantSalesInfo.restaurantSalesInfoMonth = expression.getValue("ASI::RESTAURANT SALES INFO::Restaurant Sales Info for Month of");
restaurantSalesInfo.restaurantSalesInfoYear = expression.getValue("ASI::RESTAURANT SALES INFO::Restaurant Sales Info for Year of");
restaurantSalesInfo.restaurantSalesInfoDays = expression.getValue("ASI::RESTAURANT SALES INFO::Restaurant Sales Info for Number of Days");
restaurantSalesInfo.entreesSales = expression.getValue("ASI::RESTAURANT SALES INFO::Sales of Entrees (full meals)");
restaurantSalesInfo.otherPreparedFoodSales = expression.getValue("ASI::RESTAURANT SALES INFO::Sales of Other Prepared Food");
restaurantSalesInfo.nonalcoholicBeveragesSales = expression.getValue("ASI::RESTAURANT SALES INFO::Sales of Nonalcoholic beverages");
restaurantSalesInfo.toGoFoodSales = expression.getValue("ASI::RESTAURANT SALES INFO::Sales of Prepared Food Sold To Go");

// RESTAURANT INFO
var restaurantInfo = {};
restaurantInfo.availableBarSeats = expression.getValue("ASI::RESTAURANT INFO::How many seats are available at the bar?");
restaurantInfo.availableDiningSeats = expression.getValue("ASI::RESTAURANT INFO::How many seats are available for sit-down dining?");
restaurantInfo.availableDiningRooms = expression.getValue("ASI::RESTAURANT INFO::How many addt'l dining rooms are available besides the main dining room area");
restaurantInfo.IsOutsideSeatingAvailable = expression.getValue("ASI::RESTAURANT INFO::Is outside seating available?");
restaurantInfo.outsideTablesCount = expression.getValue("ASI::RESTAURANT INFO::How many tables are located outside?");
restaurantInfo.outsideDiningAvailableSeats = expression.getValue("ASI::RESTAURANT INFO::How many seats are available for outside dining?");
restaurantInfo.description = expression.getValue("ASI::RESTAURANT INFO::Provide a description of the barrier surrounding the outside area");
restaurantInfo.availableSeatsDescription = expression.getValue("ASI::RESTAURANT INFO::Which range best describes the total number of seats available?");

var totalRowCount = expression.getTotalRowCount();

function showAndRequireCatererSalesInfo(hide, require) {
	for ( var key in catererSalesInfo) {
		catererSalesInfo[key].hidden = hide;
		expression.setReturn(catererSalesInfo[key]);

		catererSalesInfo[key].required = require;
		expression.setReturn(catererSalesInfo[key]);
	}
}

function showAndRequireRestaurantSalesInfo(hide, require) {
	for ( var key in restaurantSalesInfo) {
		restaurantSalesInfo[key].hidden = hide;
		expression.setReturn(restaurantSalesInfo[key]);

		restaurantSalesInfo[key].required = require;
		expression.setReturn(restaurantSalesInfo[key]);
	}
}

function showAndRequireRestaurantInfo(hide, require) {
	for ( var key in restaurantInfo) {
		restaurantInfo[key].hidden = hide;
		expression.setReturn(restaurantInfo[key]);

		restaurantInfo[key].required = require;
		expression.setReturn(restaurantInfo[key]);
	}
}

// Hide all 
showAndRequireCatererSalesInfo(true, false);
showAndRequireRestaurantSalesInfo(true, false);
showAndRequireRestaurantInfo(true, false);

if (businessType.value != null && (businessType.value.equals(String("Caterer")) || businessType.value.equals(String("Caterer Limited")))) {
	// Caterer or Caterer Limited
	showAndRequireCatererSalesInfo(false, true);
} else if (businessType.value != null
		&& (businessType.value.equals(String("Restaurant")) || businessType.value.equals(String("Restaurant Limited")) || businessType.value
				.equals(String("Restaurant on Government Property")))) {
	//Restaurant, Restaurant Limited or Restaurant on Government Property
	showAndRequireRestaurantSalesInfo(false, true);
	showAndRequireRestaurantInfo(false, true);
} else if (businessType.value != null && businessType.value.equals(String("Restaurant with Caterer"))) {
	// Restaurant with Caterer
	showAndRequireCatererSalesInfo(false, true);
	showAndRequireRestaurantSalesInfo(false, true);
	showAndRequireRestaurantInfo(false, true);
}