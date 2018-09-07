/*------------------------------------------------------------------------------------------------------/
| Program		: getCapRefContact4ACA.js
|
| Usage			: INCLUDES_CUSTOM function
| Notes			: Get specific type reference contact for a cap for ACA
| Created by	: AWARRAD
| Created at	: 08/16/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
function getCapRefContact4ACA(cType) {
	var capContactArray = new Array();

	if (cap.getContactsGroup().size() > 0) {
		var capContactAddArray = cap.getContactsGroup().toArray();
		for (ccaa in capContactAddArray)
			capContactArray.push(capContactAddArray[ccaa]);

		for ( var cIndex in capContactArray) {
			var cContact = capContactArray[cIndex];
			var peopleModel = cContact.getPeople();
			if ((peopleModel.contactType).toUpperCase() == cType.toUpperCase()) {
				var refContactNbr = cContact.getRefContactNumber();
				if (refContactNbr != null && refContactNbr != "") {
					return cContact;
				}
			}
		}
	}
	return null;
}
