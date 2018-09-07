/*------------------------------------------------------------------------------------------------------/
| Program		: WTUA;Licenses!Industry!~!Application.js
| Event			: Event Script
|
| Notes			: schedule inspection based on a workflow task/status
| Created by	: Yazan Barghouth - SMS: PRJAUT-2018-00850
| Created at	: 09/05/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/

if (wfTask == "Notification" && wfStatus == "Ok to Proceed") {
	scheduleInspection("Site Visit", 30);
}