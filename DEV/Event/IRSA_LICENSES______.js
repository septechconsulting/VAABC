/*------------------------------------------------------------------------------------------------------/
| Program		: IRSA;LICENSES!~!~!~.js
| Event			: Event Script
|
| Usage			: 
| Notes			:
| Created by	: AWARRAD 
| Created at	: 09/06/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
if (appTypeArray[3].toUpperCase() == "APPLICATION" || appTypeArray[3].toUpperCase() == "RENEWAL") {
	if (inspResult.toUpperCase() == "DEFERRED") {
		var inspector = inspObj.getInspector();
		var result = aa.inspection.getInspectionType(inspGroup, "");
		if (result.getSuccess()) {
			var inspections = result.getOutput();
			for ( var i in inspections) {
				var iType = inspections[i].getType();
				if (iType.toUpperCase().indexOf("FOLLOW") != -1) {
					var schedRes = aa.inspection.scheduleInspection(capId, inspector, aa.date.parseDate(dateAdd(null, 30)), null, iType, "");
					if (schedRes.getSuccess()) {
						logDebug("Successfully scheduled inspection : " + iType + " for " + dateAdd(null, 30));
						var iId = schedRes.getOutput();
						assignInspection(iId, inspector.getUserID());
					} else {
						logDebug("**ERROR: adding scheduling inspection (" + iType + "): " + schedRes.getErrorMessage());
					}
					break;
				}
			}
		} else {
			logDebug("**ERROR: Getting inspection type(Group Code: " + inspGroup + "): " + editResult.getErrorMessage());
		}
	}
}
