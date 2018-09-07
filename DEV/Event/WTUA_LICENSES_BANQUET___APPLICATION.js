/*------------------------------------------------------------------------------------------------------/
| Program		: WTUA;LICENSES!BANQUET!~!APPLICATION.js
| Event			: Event Script
|
| Usage			: 
| Notes			:
| Created by	: AWARRAD 
| Created at	: 08/17/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
if (balanceDue == 0) {
	if (wfTask.toUpperCase() == "PRELIMINARY REVIEW" || wfTask.toUpperCase() == "ASAC SAC REVIEW" || wfTask.toUpperCase() == "HEARING") {
		if (wfStatus.toUpperCase() == "APPROVED" || wfStatus.toUpperCase() == "APPROVED WITH RESTRICTIONS") {
			doBanquetTracking();
		}
	}
}
