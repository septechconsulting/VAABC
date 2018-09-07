/**
 * Returns the ref contact ASIT specified Column value array, if empty returns null
 * @param columnName :column to get value for 
 * @param subGroupName : ASIT subgroup name
 * @param contactTemplate: Contact Template 
 * @returns {Array},null
 */
function getContactAppSpecTableColValue(columnName,subGroupName,contactTemplate){
	if (contactTemplate) {
		var templateTable = contactTemplate.getTemplateTables();
		var allRows = new Array();
		for (var i = 0; i < templateTable.size(); i++) {
			var eachtable = templateTable.get(i);
			var tablename = eachtable.getGroupName();
			var tableSubgroups = eachtable.getSubgroups();

			if (tablename == null) {
				continue;
			}
			
			for (var j = 0; j < tableSubgroups.size(); j++) {
				var eachSubGroup = tableSubgroups.get(j);
				
				if (eachSubGroup == null || eachSubGroup.getRows() == null
						|| String(eachSubGroup.getSubgroupName()).toUpperCase() != String(subGroupName).toUpperCase()) {
					continue;
				}
				
				var rows = eachSubGroup.getRows();
				var rowsArray = new Array();
				for (var r = 0; r < rows.size(); r++) {
					var fieldList = rows.get(r).getValues();
					for (var i = 0; i < fieldList.size(); i++) {
						var eachField = fieldList.get(i);
						if (String(eachField.getFieldName()).toUpperCase()==String(columnName).toUpperCase()) {
							rowsArray.push(eachField.getValue());
						}
					} // end of Fields loop
				}// end of ASIT Rows
			}// end of Subgroups
			
			return rowsArray;
		}
	}
	return null;
}