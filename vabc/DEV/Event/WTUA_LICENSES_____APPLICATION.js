/*------------------------------------------------------------------------------------------------------/
| Program		: WTUA;LICENSES!*!~!APPLICATION.js
| Event			: Event Script
|
| Usage			: 
| Notes			:
| Created by	: AWARRAD 
| Created at	: 09/02/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
if (balanceDue != 0) {
	if (wfTask.toUpperCase() == "AGENT REVIEW") {
		if (wfStatus.toUpperCase() == "APPROVED" || wfStatus.toUpperCase() == "APPROVED WITH RESTRICTIONS") {
			updateTask("Application Status", "Pending Fee Payment", "", "");
		}
	}
}
