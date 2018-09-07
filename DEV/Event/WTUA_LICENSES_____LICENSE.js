/*------------------------------------------------------------------------------------------------------/
| Program		: WTUA;LICENSES!*!~!LICENSE.js
| Event			: Event Script
|
| Usage			: 
| Notes			:
| Created by	: AWARRAD 
| Created at	: 09/04/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
if (wfStatus.toUpperCase() == "REVOKED") {
	addStdCondition("License Status", "Revoked License");

	var capContactResult = aa.people.getCapContactByCapID(capId);
	if (capContactResult.getSuccess()) {
		var capContactArray = capContactResult.getOutput();
		for ( var c in capContactArray) {
			var refContactNbr = capContactArray[c].getCapContactModel().getRefContactNumber();
			if (refContactNbr != null && refContactNbr != "") {
				addContactStdCondition(refContactNbr, "License Status", "Revoked License");
			}
		}
	}
}
