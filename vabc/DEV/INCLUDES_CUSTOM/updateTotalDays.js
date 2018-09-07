/*------------------------------------------------------------------------------------------------------/
| Program		: updateTotalDays.js
|
| Usage			: INCLUDES_CUSTOM function
| Notes			: Update Custom Field 'Total Days' with total number of table 'DAY AND TIME INFORMATION' Rows
| Created by	: AWARRAD - SMS: PRJAUT-2018-00670
| Created at	: 06/10/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
function updateTotalDays() {
    var dayTimeInfoTable = loadASITable("DAY AND TIME INFORMATION");
    if (dayTimeInfoTable)
        if (AInfo['License Fee Waiver'] == 'No')
            editAppSpecific("Total Days", dayTimeInfoTable.length);
}
