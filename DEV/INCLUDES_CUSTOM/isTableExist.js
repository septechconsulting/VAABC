/*------------------------------------------------------------------------------------------------------/
| Program		: updateTotalDays.js
|
| Usage			: INCLUDES_CUSTOM function
| Notes			: Check if a record have an ASI Table
| Created by	: AWARRAD
| Created at	: 08/07/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
function isTableExist(tName) { // optional capId
	var itemCap = capId;
	if (arguments.length > 1)
		itemCap = arguments[1]; // use cap ID specified in args

	var exist = false;
	var gm = aa.appSpecificTableScript.getAppSpecificTableGroupModel(itemCap).getOutput();
	var ta = gm.getTablesArray()
	var tai = ta.iterator();

	while (tai.hasNext()) {
		var tsm = tai.next();
		var tn = tsm.getTableName();
		if (tn == tName) {
			exist = true;
			break;
		}
	}

	return exist;
}
