/*------------------------------------------------------------------------------------------------------/
| Program		: getPropertyAddress.js
|
| Usage			: INCLUDES_CUSTOM function
| Notes			: Get record primary address
| Created by	: AWARRAD
| Created at	: 08/09/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
function getPropertyAddress() { // optional capId
	var itemCap = capId;
	if (arguments.length > 0)
		itemCap = arguments[0]; // use cap ID specified in args

	var address = null;
	var capAddResult = aa.address.getAddressByCapId(itemCap);
	if (capAddResult.getSuccess()) {
		var fcapAddressObj = capAddResult.getOutput();
		if (fcapAddressObj != null && fcapAddressObj.length > 0) {
			if (fcapAddressObj.length == 1) {
				address = fcapAddressObj[0];
			} else {
				for ( var i in fcapAddressObj) {
					if (fcapAddressObj[i].getPrimaryFlag() == "Y")
						address = fcapAddressObj[i];
				}
			}

			if (address == null) // If the record have many addresses but none is primary
				address = fcapAddressObj[0];

			return address;

		} else {
			return null;
		}
	} else {
		logDebug("**ERROR: Failed to get Address object: " + capAddResult.getErrorType() + ":" + capAddResult.getErrorMessage());
		return null;
	}
}