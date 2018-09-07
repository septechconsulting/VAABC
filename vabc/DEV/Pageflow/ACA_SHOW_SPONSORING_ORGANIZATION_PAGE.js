/*------------------------------------------------------------------------------------------------------/
| Program		: ACA_SHOW_SPONSORING_ORGANIZATION_PAGE.js
| Event			: OnLoad Page flow script
|
| Usage			: 
| Notes			: 
| Created by	: AWARRAD
| Created at	: 08/08/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
var cap = aa.env.getValue("CapModel");
var appTypeResult = cap.getCapType();
var appTypeString = appTypeResult.toString();
var contact = getContactByType4ACA("Applicant");
if (contact) {
	var tm = contact.getTemplate();
	if (tm) {
		if (getContactCustomFieldValue("Are you applying on behalf of a group or company", tm) != "Y") {
			aa.env.setValue("ReturnData", "{'PageFlow': {'HidePage' : 'Y'}}");
		}
	}
}

function getContactByType4ACA(cType) {
	var capContactArray = new Array();

	if (cap.getContactsGroup().size() > 0) {
		var capContactAddArray = cap.getContactsGroup().toArray();
		for (ccaa in capContactAddArray)
			capContactArray.push(capContactAddArray[ccaa]);

		for ( var cIndex in capContactArray) {
			var cContact = capContactArray[cIndex];
			var peopleModel = cContact.getPeople();
			if ((peopleModel.contactType).toUpperCase() == cType.toUpperCase())
				return peopleModel;
		}
	}
	return false;
}

function getContactCustomFieldValue(fieldName, contactTemplate) {
	if (contactTemplate) {
		var templateGroups = contactTemplate.getTemplateForms();
		var gArray = new Array();
		if (!(templateGroups == null || templateGroups.size() == 0)) {
			var subGroups = templateGroups.get(0).getSubgroups();
			for (var subGroupIndex = 0; subGroupIndex < subGroups.size(); subGroupIndex++) {
				var subGroup = subGroups.get(subGroupIndex);
				var fields = subGroup.getFields();
				for (var fieldIndex = 0; fieldIndex < fields.size(); fieldIndex++) {
					var field = fields.get(fieldIndex);
					if (field.getDisplayFieldName() == fieldName) {
						return field.getDefaultValue();
					}
				}
			}
		}
	} else {
		return null;
	}
	return null;
}