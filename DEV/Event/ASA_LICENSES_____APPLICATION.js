/*------------------------------------------------------------------------------------------------------/
| Program		: ASA;LICENSES!~!~!APPLICATION.js
| Event			: Event Script
|
| Usage			: 
| Notes			:
| Created by	: AWARRAD 
| Created at	: 08/12/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
if (!appMatch("Licenses/Banquet/*/Application")) {
	var businessType = getAppSpecific("What is the type of business conducted at the establishment?");
	if (businessType != null && businessType != "") {
		var lookupResult = lookup("ABC_LIC_FEE_LOOKUP", businessType);
		if (lookupResult != null && lookupResult != "") {
			var items = lookupResult.split("|");
			if (items.length == 2) {
				var feeSchedule = items[0];
				var feeCode = items[1];
				addFee(feeCode, feeSchedule, "FINAL", "1", "Y");
			}
		}
	}
}

//Populate ASI Field with Todays Date
var asiField = "Locality Notice Date";
var today = new Date();
var vtoday = today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();
result = editAppSpecific(asiField, vtoday, capId);
