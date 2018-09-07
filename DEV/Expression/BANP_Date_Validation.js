/*------------------------------------------------------------------------------------------------------/
| Program		: BANP_Date_Validation.js
| Event			: Expression
|
| Usage			: 
| Notes			: Verifies date occurs in the future, and show message if the date entered is 10 days less than today's date
| Created by	: AWARRAD - SMS: PRJAUT-2018-00657
| Created at	: 06/07/2018
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

var thisDate = expression.getValue("$$today$$");

var totalRowCount = expression.getTotalRowCount();
for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {
    var variable0 = expression.getValue(rowIndex, "ASIT::DAY AND TIME INFORMATION::Date");
    var variable1 = expression.getValue(rowIndex, "ASIT::DAY AND TIME INFORMATION::Ack_NoFeeRefund");
    var variable2 = expression.getValue(rowIndex, "ASIT::DAY AND TIME INFORMATION::Ack_NoGuarantee");
    var variable3 = expression.getValue(rowIndex, "ASIT::DAY AND TIME INFORMATION::FORM");

    if (variable0.getValue() != null || variable0.value != "") {
        var today = new Date(thisDate.getValue());
        var eventDate = new Date(variable0.getValue());
        if (eventDate < today) {
            variable0.message = 'Event date must occurs in the future';
            expression.setReturn(rowIndex, variable0);

            variable3.blockSubmit = true;
            expression.setReturn(rowIndex, variable3);
        } else {
            if (diffDate(thisDate.getValue(), variable0.getValue()) < 10) {
                variable0.message =
                    'You have selected an event date that is less than 10 days from the current date.Virginia ABC cannot guarantee that your application will be processed by the event date.To expedite the processing of your application, please call the Regional Office for where your event will take place.Please note that additional fees may apply for expedited services.';
                expression.setReturn(rowIndex, variable0);

                variable1.hidden = false;
                expression.setReturn(variable1);

                variable2.hidden = false;
                expression.setReturn(variable2);
            } else {
                variable1.hidden = true;
                expression.setReturn(variable1);

                variable2.hidden = true;
                expression.setReturn(variable2);
            }
        }
    }
}