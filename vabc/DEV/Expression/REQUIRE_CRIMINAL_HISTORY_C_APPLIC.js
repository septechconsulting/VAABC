/*------------------------------------------------------------------------------------------------------/
| Program		: REQUIRE_CRIMINAL_HISTORY_C_APPLIC.js
| Event			: Expression
|
| Usage			: 
| Notes			: The applicants of the license application record types are required to answer questions pertaining to alcohol offenses and populate the criminal offenses table if they answered yes to any of the questions.
| Created by	: AWARRAD - SMS: PRJAUT-2018-00667
| Created at	: 07/08/2018
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

var servProvCode = expression.getValue("$$servProvCode$$").value;
var variable0 = expression.getValue("CONTACTTPLTABLE::ABC_C_APPLIC::CRIMINAL OFFENSES::FORM");
var variable1 = expression.getValue("CONTACTTPLFORM::ABC_C_APPLIC::BACKGROUND INFORMATION::Have you been convicted of any alcohol related offenses including DUI");
var variable2 = expression.getValue("CONTACTTPLFORM::ABC_C_APPLIC::BACKGROUND INFORMATION::Have you been convicted of any other criminal offense");
var variable3 = expression.getValue("CONTACTTPLTABLE::ABC_C_APPLIC::CRIMINAL OFFENSES::Date of Offense");
var totalRowCount = expression.getTotalRowCount() - 1;

if ((variable1.value != null && (variable1.value.equalsIgnoreCase('YES') || variable1.value.equalsIgnoreCase('Y') || variable1.value.equalsIgnoreCase('CHECKED') || variable1.value.equalsIgnoreCase('SELECTED') || variable1.value.equalsIgnoreCase('TRUE') || variable1.value.equalsIgnoreCase('ON'))) || (variable2.value != null && (variable2.value.equalsIgnoreCase('YES') || variable2.value.equalsIgnoreCase('Y') || variable2.value.equalsIgnoreCase('CHECKED') || variable2.value.equalsIgnoreCase('SELECTED') || variable2.value.equalsIgnoreCase('TRUE') || variable2.value.equalsIgnoreCase('ON')))) {
    if (totalRowCount < 1) {
        variable0.blockSubmit = true;
        expression.setReturn(variable0);

        variable0.message = "Require at least 1 row in CRIMINAL OFFENSES";
        expression.setReturn(variable0);
    }
}


