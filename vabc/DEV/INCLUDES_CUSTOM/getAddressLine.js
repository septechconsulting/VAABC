/*------------------------------------------------------------------------------------------------------/
| Program		: getAddressLine.js
|
| Usage			: INCLUDES_CUSTOM function
| Notes			: Get address line from AddressScriptModel object
| Created by	: AWARRAD
| Created at	: 08/09/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
function getAddressLine(addressModel) {
	var addressLine = "";

	if (typeof (addressModel.getAddressLine1()) != "undefined" && addressModel.getAddressLine1() != null && addressModel.getAddressLine1() != "") {
		addressLine = addressModel.getAddressLine1();

		if (typeof (addressModel.getAddressLine2()) != "undefined" && addressModel.getAddressLine2() != null && addressModel.getAddressLine2() != "")
			addressLine += " " + addressModel.getAddressLine2();
	} else {
		if (addressModel.getHouseNumberStart()) {
			addressLine += addressModel.getHouseNumberStart();
		}
		if (addressModel.getStreetDirection()) {
			addressLine += addressModel.getStreetDirection();
		}
		if (addressModel.getStreetName()) {
			addressLine += " " + addressModel.getStreetName();
		}
		if (addressModel.getStreetSuffix()) {
			addressLine += " " + addressModel.getStreetSuffix();
		}
		if (addressModel.getUnitType()) {
			addressLine += " " + addressModel.getUnitType();
		}
		if (addressModel.getUnitStart()) {
			addressLine += " " + addressModel.getUnitStart();
		}
	}

	return addressLine;
}