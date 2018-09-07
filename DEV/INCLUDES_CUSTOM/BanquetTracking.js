/*------------------------------------------------------------------------------------------------------/
| Program		: BanquetTracking.js
|
| Usage			: INCLUDES_CUSTOM functions
| Notes			: Banquet tracking implementation (PRJAUT-2018-00671)
| Created by	: AWARRAD
| Created at	: 08/16/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/

function doBanquetTracking() {
	if (isTrackableRecord()) {
		var parents = getParents("Licenses/Banquet/Tracking/NA");
		if (parents == null || parents.length == 0) {

			var trackingRefContact = getTrackingRefContact();
			if (trackingRefContact != null) {

				// Get or create tracking record
				var trCapId = getTrackingRecord(trackingRefContact.getCapContactModel());
				if (trCapId == null) {
					trCapId = createParentTrackingRecord("Licenses", "Banquet", "Tracking", "NA", "");
				} else {
					var result = aa.cap.createAppHierarchy(trCapId, capId);
					if (result.getSuccess()) {
						logDebug("**INFO: Tracking application successfully linked");
					} else {
						logDebug("**WARN: Could not link tracking parent");
						return false;
					}
				}

				var appTypeString = cap.getCapType().toString();
				if (!willExceedMaxEvents(appTypeString, getIncrement(), trCapId)) {
					updateTrackingRecord(appTypeString, getIncrement(), trCapId);
				} else {
					logDebug("**INFO: Max count of events will be exceeded, process will be canceled");
					return "cancel";
				}
			}
		} else {
			logDebug("**INFO:Record#" + capId + " is already tracked.");
			return true;
		}
	} else {
		logDebug("**INFO: Record#" + capId + " is not trackable.");
		return true;
	}
}

function createParentTrackingRecord(grp, typ, stype, cat, desc) {
	var appCreateResult = aa.cap.createApp(grp, typ, stype, cat, desc);
	logDebug("creating cap " + grp + "/" + typ + "/" + stype + "/" + cat);
	if (appCreateResult.getSuccess()) {
		var newId = appCreateResult.getOutput();

		logDebug("cap " + grp + "/" + typ + "/" + stype + "/" + cat + " created successfully ");
		capModel = aa.cap.newCapScriptModel().getOutput();
		capDetailModel = capModel.getCapModel().getCapDetailModel();

		capDetailModel.setCapID(newId);

		aa.cap.createCapDetail(capDetailModel);

		var newObj = aa.cap.getCap(newId).getOutput(); //Cap object

		var result = aa.cap.createAppHierarchy(newId, capId);

		if (result.getSuccess())
			logDebug("Parent application successfully linked");
		else
			logDebug("Could not link applications");

		// Copy ref contact
		var refCont = getTrackingRefContact();
		var refContModel = refCont.getCapContactModel();
		refContModel.setCapID(newId);
		aa.people.createCapContact(refContModel);

		return newId;
	} else {
		logDebug("**ERROR: adding parent App: " + appCreateResult.getErrorMessage());
	}
}

function getTrackingRefContact() {
	var refApplicant = getCapRefContact("Applicant");
	var trackingRefContact = refApplicant;
	if (refApplicant != null) {
		if (appMatch("Licenses/Banquet/Tasting/Application")) {
			// For 'Licenses/Banquet/Tasting/Application'
			// If the person is representing an organization, count the max against the organization.
			// Otherwise, the count goes against the individual.
			var tm = refApplicant.getPeople().getTemplate();
			if (tm) {
				if (getContactAppSpecific("Are you applying on behalf of a group or company", tm) == "Y") {
					var refSponOrg = getCapRefContact("Sponsoring Organization");
					if (refSponOrg != null) {
						trackingRefContact = refSponOrg;
					}
				}
			}
		}

		return trackingRefContact;
	} else {
		logDebug("**WARN: Record#" + capId + " does not have a reference applicant!");
		return null;
	}
}

function getTrackingRefContact4ACA() {
	var refApplicant = getCapRefContact4ACA("Applicant");
	var trackingRefContact = refApplicant;
	if (refApplicant != null) {
		if (appMatch("Licenses/Banquet/Tasting/Application")) {
			// For 'Licenses/Banquet/Tasting/Application'
			// If the person is representing an organization, count the max against the organization.
			// Otherwise, the count goes against the individual.
			var tm = refApplicant.getPeople().getTemplate();
			if (tm) {
				if (getContactAppSpecific("Are you applying on behalf of a group or company", tm) == "Y") {
					var refSponOrg = getCapRefContact4ACA("Sponsoring Organization");
					if (refSponOrg != null) {
						trackingRefContact = refSponOrg;
					}
				}
			}
		}

		return trackingRefContact;
	} else {
		logDebug("**WARN: Record#" + capId + " does not have a reference applicant!");
		return null;
	}
}

function getTrackingRecord(refContactModel) {
	var trackCapTypeModel = aa.cap.getCapTypeModel().getOutput();
	trackCapTypeModel.setGroup("Licenses");
	trackCapTypeModel.setType("Banquet");
	trackCapTypeModel.setSubType("Tracking");
	trackCapTypeModel.setCategory("NA");

	var trackCapModel = aa.cap.getCapModel().getOutput();
	trackCapModel.setCapType(trackCapTypeModel);
	trackCapModel.setCapContactModel(refContactModel);

	var capIDListOutput = aa.cap.getCapIDListByCapModel(trackCapModel).getOutput();

	if (capIDListOutput != null && capIDListOutput.length > 0) {
		for ( var i in capIDListOutput) {
			var trCapId = capIDListOutput[i].getCapID();
			var capIdArr = trCapId.toString().split('-');
			trCapId = aa.cap.getCapID(capIdArr[0], capIdArr[1], capIdArr[2]).getOutput();

			var trCap = aa.cap.getCap(trCapId).getOutput();
			var fileYear = trCap.getFileDate().getYear();
			var currentYear = (new Date()).getFullYear();
			if (fileYear.toString() == currentYear.toString()) {
				logDebug("**INFO: A tracking record were found for the ref contact. CapId = " + trCapId);
				return trCapId;
			}
		}
	}

	logDebug("**INFO: No tracking record were found for the ref contact.");
	return null;
}

function isTrackableRecord() {
	var trackable = false;
	if (appMatch("Licenses/Banquet/Tasting/Application") || appMatch("Licenses/Banquet/Manufacturer Event/Application")
			|| appMatch("Licenses/Banquet/Banquet Mixed Beverage Club/Application")) {
		trackable = true;
	} else if (appMatch("Licenses/Banquet/Banquet Special Event/Application") || appMatch("Licenses/Banquet/Banquet Mixed Beverage/Application")) {
		if (getAppSpecific("Wine Off Premises") == "Yes") {
			trackable = true;
		}
	}

	return trackable;
}

function willExceedMaxEvents(eType, increment, trCapId) {
	var stdMaxTableName = "BANQUET_RECORD_MAX_EVENTS";
	var max = parseInt(lookup(stdMaxTableName, eType));
	var trackerInfoTable = loadASITable("TRACKER INFO", trCapId);

	if (trackerInfoTable) {
		for ( var rowIndex in trackerInfoTable) {
			var thisRow = trackerInfoTable[rowIndex];
			if (thisRow["Event Type"].fieldValue.toUpperCase() == eType.toUpperCase()) {
				var count = parseInt(thisRow["Total Number of Events"].fieldValue);
				return (count + increment) > max;
			}
		}
	}
	return false;
}

function updateTrackingRecord(eType, increment, trCapId) {
	var updated = false;
	var trackerInfoTable = loadASITable("TRACKER INFO", trCapId);
	if (!trackerInfoTable)
		trackerInfoTable = new Array();

	for ( var rowIndex in trackerInfoTable) {
		var thisRow = trackerInfoTable[rowIndex];
		if (thisRow["Event Type"].fieldValue.toUpperCase() == eType.toUpperCase()) {
			var count = parseInt(thisRow["Total Number of Events"].fieldValue);
			thisRow["Total Number of Events"] = new asiTableValObj("Total Number of Events", (count + increment).toString(), "N");
			updated = true;
			break;
		}
	}

	if (!updated) {
		var eventRow = new Array();
		eventRow["Event Type"] = new asiTableValObj("Event Type", eType, "N");
		eventRow["Total Number of Events"] = new asiTableValObj("Total Number of Events", increment.toString(), "N");
		trackerInfoTable.push(eventRow);
	}

	removeASITable("TRACKER INFO", trCapId);
	addASITable("TRACKER INFO", trackerInfoTable, trCapId);
}

function getIncrement() {
	var increment = 1;
	if (appMatch("Licenses/Banquet/Manufacturer Event/Application")) {
		var coApplicantArray = new Array();
		var participatingManufacturersTable = loadASITable("PARTICIPATING MANUFACTURERS");
		if (participatingManufacturersTable) {
			for ( var rowIndex in participatingManufacturersTable) {
				var thisRow = participatingManufacturersTable[rowIndex];
				if (thisRow["Is this Manufacturer a Participant or a Co-Applicant?"].fieldValue == "Co-Applicant") {
					coApplicantArray.push(thisRow);
				}
			}
		}
		if (coApplicantArray.length > 0)
			increment = parseInt(coApplicantArray.length);

	}

	return increment;
}

function isApprovable() {
	var trackingRefContact = getTrackingRefContact();
	if (trackingRefContact != null) {
		var trCapId = getTrackingRecord(trackingRefContact.getCapContactModel());
		if (trCapId == null) {
			return true;
		} else {
			var appTypeString = cap.getCapType().toString();
			return !willExceedMaxEvents(appTypeString, getIncrement(), trCapId);
		}
	}
}