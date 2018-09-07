/*------------------------------------------------------------------------------------------------------/
| Program		: BSEW_Date_Check.js
| Event			: Expression
|
| Usage			: 
| Notes			: Verify all dates are in same month. If not, verify they are consecutive days (IE: May 30, May 31, June 1, etc)
| Created by	: AWARRAD - SMS: PRJAUT-2018-00656
| Created at	: 06/06/2018
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

var totalRowCount = expression.getTotalRowCount();
var firstRowMonth = null;
for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {
	variable0 = expression.getValue(rowIndex, "ASIT::DAY AND TIME INFORMATION::Date");
	variable1 = expression.getValue(rowIndex, "ASIT::DAY AND TIME INFORMATION::FORM");

	if (variable0.getValue() != null || variable0.value != "") {
		var eventDate = new Date(variable0.getValue());
		var month = eventDate.getMonth();
		if (rowIndex == 0) {
			firstRowMonth = month;
			continue;
		}

		if (month != firstRowMonth) {
			if (totalRowCount > 1 && rowIndex != 0) {
				var variable2 = expression.getValue((rowIndex - 1), "ASIT::DAY AND TIME INFORMATION::Date");
				if (variable2.getValue() != null || variable2.value != "") {
					var isConsecutive = diffDate(variable2.getValue(), variable0.getValue()) == 1;
					if (!isConsecutive) {
						variable1.blockSubmit = true;
						expression.setReturn(rowIndex, variable1);

						variable0.message = 'The Date must be consecutive to spill into the next month';
						expression.setReturn(rowIndex, variable0);
					}
				}
			}
		}
	}
}