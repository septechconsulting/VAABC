/*------------------------------------------------------------------------------------------------------/
| Program		: appMatchArray.js
|
| Usage			: INCLUDES_CUSTOM function
| Notes			: 
| Created by	: AWARRAD
| Created at	: 08/15/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
function appMatchArray(recordTypesArray) {
	for (a in recordTypesArray) {
		var recTypeToMatch = recordTypesArray[a];
		if (appMatch(recTypeToMatch)) {
			return true;
		}
	}
	return false;
}
