/*------------------------------------------------------------------------------------------------------/
| Program		: ASB;LICENSES!BANQUET!~!APPLICATION.js
| Event			: Event Script
|
| Usage			: 
| Notes			:
| Created by	: AWARRAD 
| Created at	: 08/12/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
loadASITables();
if (AInfo["Nonprofit Donation"] == "Yes") {
	if (typeof DONATIONINFORMATION == "undefined" || DONATIONINFORMATION == null || DONATIONINFORMATION.length == 0) {
		showMessage = true;
		cancel = true;
		comment("Please enter at least one row in Donation Information Table before you proceed");
	}
}
