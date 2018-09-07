/*------------------------------------------------------------------------------------------------------/
| Program		: retailHotelInfoHideDisplay_ABC_RTLRH_RN.js
| Event			: Expression
|
| Usage			: onLoad, onChange "What is the type of business conducted at the establishment?"
| Notes			: show/require certain fields based on ASI "What is the type of business conducted at the establishment?"
| Created by	: Yazan Barghouth - SMS: PRJAUT-2018-00813 (US #1, #2 and #3)
| Created at	: 09/04/2018
| Updated by    : Ahmad Warrad - Add implementation for stories #4 and #5
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/

var toPrecision = function (value) {
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

var CATERER_SALES_INFO_FIELDS = [expression.getValue("ASI::CATERER SALES INFO::Caterer Estimated Sales Figures"),
expression.getValue("ASI::CATERER SALES INFO::Caterer Sales Info for Month of"),
expression.getValue("ASI::CATERER SALES INFO::Caterer Sales Info for Year of"),
expression.getValue("ASI::CATERER SALES INFO::Caterer Sales Info for Number of Days"),
expression.getValue("ASI::CATERER SALES INFO::Total Food and Nonalcoholic beverages sales")];

var RESTAURANT_SALES_INFO_FIELDS = [expression.getValue('ASI::RESTAURANT SALES INFO::Restaurant Estimated Sales Figures'),
expression.getValue('ASI::RESTAURANT SALES INFO::Restaurant Sales Info for Month of'),
expression.getValue('ASI::RESTAURANT SALES INFO::Restaurant Sales Info for Year of'),
expression.getValue('ASI::RESTAURANT SALES INFO::Restaurant Sales Info for Number of Days'),
expression.getValue('ASI::RESTAURANT SALES INFO::Sales of Entrees (full meals)'),
expression.getValue('ASI::RESTAURANT SALES INFO::Sales of Other Prepared Food'),
expression.getValue('ASI::RESTAURANT SALES INFO::Sales of Nonalcoholic beverages'),
expression.getValue('ASI::RESTAURANT SALES INFO::Sales of Prepared Food Sold To Go')];

var servProvCode = expression.getValue("$$servProvCode$$").value;
var bznsType = expression.getValue("ASI::ALCOHOL INFO::What is the type of business conducted at the establishment?");

var mealsCount = expression.getValue("ASI::ESTABLISHMENT INFO::How many meals are assembled or prepared per day?");
var licensedAreasDesc = expression.getValue("ASI::ESTABLISHMENT INFO::Describe the areas to be licensed");
var excludedAreasDesc = expression.getValue("ASI::ESTABLISHMENT INFO::Describe any areas excluded from licensing");

try {
    var both = false;

    if (bznsType.value != null && bznsType.value.equals("Hotel with Restaurant with Caterer")) {
        both = true;
        showAndRequire(RESTAURANT_SALES_INFO_FIELDS, true, true);
        showAndRequire(CATERER_SALES_INFO_FIELDS, true, true);
    } else {
        both = false;
        showAndRequire(RESTAURANT_SALES_INFO_FIELDS, false, false);
        showAndRequire(CATERER_SALES_INFO_FIELDS, false, false);
    }

    if (!both) {
        if (bznsType.value != null && bznsType.value.equals("Hotel  with Caterer")) {
            showAndRequire(CATERER_SALES_INFO_FIELDS, true, true);
            showAndRequire(RESTAURANT_SALES_INFO_FIELDS, false, false);
        } else {
            showAndRequire(CATERER_SALES_INFO_FIELDS, false, false);
        }

        if (bznsType.value != null && bznsType.value.equals("Hotel with Restaurant")) {
            showAndRequire(RESTAURANT_SALES_INFO_FIELDS, true, true);
            showAndRequire(CATERER_SALES_INFO_FIELDS, false, false);
        } else {
            showAndRequire(RESTAURANT_SALES_INFO_FIELDS, false, false);
        }
    }//!both

    if ((bznsType.value != null && bznsType.value.equals("Hotel Limited"))) {
        mealsCount.hidden = false;
        mealsCount.required = true;
        expression.setReturn(mealsCount);
    } else {
        mealsCount.hidden = true;
        mealsCount.required = false;
        expression.setReturn(mealsCount);
    }

    if ((bznsType.value != null && (bznsType.value.equals("Resort Complex with Restaurant") || bznsType.value.equals("Resort Complex")))) {
        licensedAreasDesc.hidden = false;
        licensedAreasDesc.required = true;
        expression.setReturn(licensedAreasDesc);

        excludedAreasDesc.hidden = false;
        excludedAreasDesc.required = true;
        expression.setReturn(excludedAreasDesc);
    } else {
        licensedAreasDesc.hidden = true;
        licensedAreasDesc.required = false;
        expression.setReturn(licensedAreasDesc);

        excludedAreasDesc.hidden = true;
        excludedAreasDesc.required = false;
        expression.setReturn(excludedAreasDesc);
    }

} catch (ex) {
    var myForm = expression.getValue("ASI::FORM");
    myForm.message = "Error: " + ex;
    expression.setReturn(myForm);
}



function showAndRequire(fieldNamesArray, makeVisible, makeRequired) {
    for (f in fieldNamesArray) {
        var fld = fieldNamesArray[f];
        fld.hidden = !makeVisible;
        fld.required = makeRequired;
        expression.setReturn(fld);
    }
}