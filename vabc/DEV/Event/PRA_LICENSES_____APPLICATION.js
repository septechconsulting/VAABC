/*------------------------------------------------------------------------------------------------------/
| Program		: PRA;LICENSES!~!~!APPLICATION.js
| Event			: Event Script
|
| Usage			: 
| Notes			:
| Created by	: AWARRAD 
| Created at	: 09/02/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
if (balanceDue == 0) {
	if (capStatus.toUpperCase() == "PENDING ISSUANCE") {
		updateTask("Application Status", "Issued", "", "");
	}
}