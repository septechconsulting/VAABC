/*------------------------------------------------------------------------------------------------------/
| Program		: ASA;LICENSES!BANQUET!~!APPLICATION.js
| Event			: Event Script
|
| Usage			: 
| Notes			:
| Created by	: AWARRAD 
| Created at	: 06/10/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
var refApplicant = getCapRefContact("Applicant");
var refSponOrg = getCapRefContact("Sponsoring Organization");
if (refApplicant == null) {
	/* Create a reference applicant if none is found.
	   No need to pass a comparePeopleGeneric function, we already knows that we 
	   don't have a reference applicant and it must be created.
	   Otherwise the system will check at the time of contact creation, and contact will be 
	   referenced if found based on INDIVIDUAL_CONTACT_MATCH_CRITERIA Standard choice
	   */
	createRefContactsFromCapContactsAndLink(capId, [ "Applicant" ], null, false, true, function() {
		return false
	});
}

if (refSponOrg == null) {
	/* Create a reference sponsoring organization if none is found.
	   No need to pass a comparePeopleGeneric function, we already knows that we 
	   don't have a reference sponsoring organization and it must be created.
	   Otherwise the system will check at the time of contact creation, and contact will be 
	   referenced if found based on ORGANIZATION_CONTACT_MATCH_CRITERIA Standard choice
	   */
	createRefContactsFromCapContactsAndLink(capId, [ "Sponsoring Organization" ], null, false, true, function() {
		return false
	});
}

if (isTrackableRecord()) {
	if (!isApprovable()) {
		addStdCondition("License Notifications", "Maximum Event Count");
	}
}

var waiverRequestedTypesArray = [ "Licenses/Banquet/Banquet/Application", "Licenses/Banquet/Mixed Beverage/Application", "Licenses/Banquet/Banquet Mixed Beverage/Application",
		"Licenses/Banquet/Banquet Special Event/Application" ];

if (appMatchArray(waiverRequestedTypesArray)) {
	if (getAppSpecific("License Fee Waiver") == "Yes") {
		createChild("Licenses", "Amendment", "Application", "Waiver", "");
		addStdInheritableCondition("License Notifications", "Waiver Requested");

		var capContactResult = aa.people.getCapContactByCapID(capId);
		if (capContactResult.getSuccess()) {
			var capContactArray = capContactResult.getOutput();
			for ( var c in capContactArray) {
				var refContactNbr = capContactArray[c].getCapContactModel().getRefContactNumber();
				if (refContactNbr != null && refContactNbr != "") {
					addContactStdInheritableCondition(refContactNbr, "License Notifications", "Waiver Requested");
				}
			}
		}
	}
}

updateTotalDays();

updateDonation();

function addStdInheritableCondition(cType, cDesc) // optional cap ID
{
	var itemCap = capId;
	if (arguments.length == 3) {
		itemCap = arguments[2]; // use cap ID specified in args
	}
	if (!aa.capCondition.getStandardConditions) {
		logDebug("addStdCondition function is not available in this version of Accela Automation.");
	} else {
		standardConditions = aa.capCondition.getStandardConditions(cType, cDesc).getOutput();
		for (i = 0; i < standardConditions.length; i++)
		// deactivate strict match for indy
		//if (standardConditions[i].getConditionType().toUpperCase() == cType.toUpperCase() && standardConditions[i].getConditionDesc().toUpperCase() == cDesc.toUpperCase()) //EMSE Dom function does like search, needed for exact match
		{
			standardCondition = standardConditions[i];

			var addCapCondResult = aa.capCondition.addCapCondition(itemCap, standardCondition.getConditionType(), standardCondition.getConditionDesc(), standardCondition
					.getConditionComment(), sysDate, null, sysDate, null, null, standardCondition.getImpactCode(), systemUserObj, systemUserObj, "Applied", currentUserID, "A",
					null, standardCondition.getDisplayConditionNotice(), standardCondition.getIncludeInConditionName(), standardCondition.getIncludeInShortDescription(), "Y",
					standardCondition.getLongDescripton(), standardCondition.getPublicDisplayMessage(), standardCondition.getResolutionAction(), null, null, standardCondition
							.getConditionNbr(), standardCondition.getConditionGroup(), standardCondition.getDisplayNoticeOnACA(), standardCondition.getDisplayNoticeOnACAFee(),
					standardCondition.getPriority(), standardCondition.getConditionOfApproval());

			if (addCapCondResult.getSuccess()) {
				logDebug("Successfully added condition (" + standardCondition.getConditionDesc() + ")");
			} else {
				logDebug("**ERROR: adding condition (" + standardCondition.getConditionDesc() + "): " + addCapCondResult.getErrorMessage());
			}
		}
	}
}

function addContactStdInheritableCondition(contSeqNum, cType, cDesc) {

	var foundCondition = false;
	var javascriptDate = new Date()
	var javautilDate = aa.date.transToJavaUtilDate(javascriptDate.getTime());

	cStatus = "Applied";
	if (arguments.length > 3)
		cStatus = arguments[3]; // use condition status in args

	if (!aa.capCondition.getStandardConditions) {
		logDebug("addAddressStdCondition function is not available in this version of Accela Automation.");
	} else {
		standardConditions = aa.capCondition.getStandardConditions(cType, cDesc).getOutput();
		for (i = 0; i < standardConditions.length; i++)
			if (standardConditions[i].getConditionType().toUpperCase() == cType.toUpperCase() && standardConditions[i].getConditionDesc().toUpperCase() == cDesc.toUpperCase()) //EMSE Dom function does like search, needed for exact match
			{
				standardCondition = standardConditions[i]; // add the last one found

				foundCondition = true;

				var newCondition = aa.commonCondition.getNewCommonConditionModel().getOutput();
				aa.print(newCondition);
				newCondition.setServiceProviderCode(aa.getServiceProviderCode());
				newCondition.setEntityType("CONTACT");
				newCondition.setEntityID(contSeqNum);
				newCondition.setConditionDescription(standardCondition.getConditionDesc());
				newCondition.setConditionGroup(standardCondition.getConditionGroup());
				newCondition.setConditionType(standardCondition.getConditionType());
				newCondition.setConditionComment(standardCondition.getConditionComment());
				newCondition.setImpactCode(standardCondition.getImpactCode());
				newCondition.setConditionStatus(cStatus)
				newCondition.setAuditStatus("A");
				newCondition.setInheritable("Y");
				newCondition.setIssuedByUser(systemUserObj);
				newCondition.setIssuedDate(javautilDate);
				newCondition.setEffectDate(javautilDate);

				newCondition.setAuditID(currentUserID);
				var addContactConditionResult = aa.commonCondition.addCommonCondition(newCondition);

				if (addContactConditionResult.getSuccess()) {
					logDebug("Successfully added reference contact (" + contSeqNum + ") condition: " + cDesc);
				} else {
					logDebug("**ERROR: adding reference contact (" + contSeqNum + ") condition: " + addContactConditionResult.getErrorMessage());
				}
			}
	}
	if (!foundCondition)
		logDebug("**WARNING: couldn't find standard condition for " + cType + " / " + cDesc);
}