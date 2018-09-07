/*------------------------------------------------------------------------------------------------------/
| Program		: updateDonation.js
|
| Usage			: INCLUDES_CUSTOM function
| Notes			: When custom Field "Nonprofit Donation" = "No", add a row to the 'Donation Information’ ASI Table with the information from Sponsoring Organization
| Created by	: AWARRAD
| Created at	: 08/07/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
function updateDonation() {
	if (getAppSpecific("Nonprofit Donation") == "No") {
		var sponsoringOrg = getContactByType("Sponsoring Organization", capId);
		var organizationName = "";

		if (sponsoringOrg) {
			if (isTableExist("DONATION INFORMATION")) {
				if (!((sponsoringOrg.getFirstName() == null || sponsoringOrg.getFirstName() == "")
						&& (sponsoringOrg.getMiddleName() == null || sponsoringOrg.getMiddleName() == "") && (sponsoringOrg.getLastName() == null || sponsoringOrg.getLastName() == ""))) {
					if (sponsoringOrg.getFirstName() != null || sponsoringOrg.getFirstName() != "")
						organizationName += sponsoringOrg.getFirstName() + " ";
					if (sponsoringOrg.getMiddleName() != null && sponsoringOrg.getMiddleName() != "")
						organizationName += sponsoringOrg.getMiddleName() + " ";
					if (sponsoringOrg.getLastName() != null && sponsoringOrg.getLastName() != "")
						organizationName += sponsoringOrg.getLastName();
				} else if (sponsoringOrg.getBusinessName() != null && sponsoringOrg.getBusinessName() != "") {
					organizationName = sponsoringOrg.getBusinessName();
				}

				var donationInfoTbl = loadASITable("DONATION INFORMATION");
				if (!donationInfoTbl)
					donationInfoTbl = new Array();

				var sponsoringOrgRow = new Array();

				sponsoringOrgRow["Name of Organization to Which Profits Will Be Donated"] = new asiTableValObj("Name of Organization to Which Profits Will Be Donated",
						organizationName, "N");
				sponsoringOrgRow["Is organization a non profit"] = new asiTableValObj("Is organization a non profit", "", "N");
				sponsoringOrgRow["Name and Phone Number of Contact Person for Organization"] = new asiTableValObj("Name and Phone Number of Contact Person for Organization", "",
						"N");
				sponsoringOrgRow["Will net profits be used for any of the following purposes"] = new asiTableValObj("Will net profits be used for any of the following purposes",
						"", "N");

				donationInfoTbl.push(sponsoringOrgRow);

				removeASITable("DONATION INFORMATION");
				addASITable("DONATION INFORMATION", donationInfoTbl);
			}
		}
	}
}
