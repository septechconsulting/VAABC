/*------------------------------------------------------------------------------------------------------/
| Program		: getCapRefContact.js
|
| Usage			: INCLUDES_CUSTOM function
| Notes			: Get specific type reference contact for a cap
| Created by	: AWARRAD
| Created at	: 08/16/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
function getCapRefContact(cType) { // optional capId
	var itemCap = capId;
	if (arguments.length > 1)
		itemCap = arguments[1]; // use cap ID specified in args

	var capContactResult = aa.people.getCapContactByCapID(itemCap);
	if (capContactResult.getSuccess()) {
		var capContactArray = capContactResult.getOutput();
		for ( var c in capContactArray) {
			if ((capContactArray[c].getPeople().contactType).toUpperCase() == cType.toUpperCase()) {
				var refContactNbr = capContactArray[c].getCapContactModel().getRefContactNumber();
				if (refContactNbr != null && refContactNbr != "") {
					return capContactArray[c];
				}

			}
		}
	}
	return null;
}