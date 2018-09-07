/*------------------------------------------------------------------------------------------------------/
| Program		: getContactAppSpecific.js
|
| Usage			: INCLUDES_CUSTOM function
| Notes			: Get contact app specific from contact template
| Created by	: AWARRAD
| Created at	: 08/16/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
function getContactAppSpecific(fieldName, contactTemplate) {
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