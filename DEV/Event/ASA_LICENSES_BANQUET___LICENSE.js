/*------------------------------------------------------------------------------------------------------/
| Program		: ASA;LICENSES!BANQUET!~!LICENSE.js
| Event			: Event Script
|
| Usage			: 
| Notes			:
| Created by	: AWARRAD 
| Created at	: 08/28/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
updateTask("License Status", "Active", "", "");

//PRJAUT-2018-01035
requireStatementOfIncomeAndExpenses();

function requireStatementOfIncomeAndExpenses(){
	// get the custom fields
	useAppSpecificGroupName=false;
	var compenForOrg=getAppSpecific("Compensation For Organizing");
	var cashBar=getAppSpecific("Cash Bar");
	var alcoholIncludedInFee=getAppSpecific("Alcohol Included In Fee");
	var alcoholicBeverageSoldToPublic=getAppSpecific("Alcoholic Beverage Sold to Public");

	if (compenForOrg=="Yes" || cashBar=="Yes" || alcoholIncludedInFee=="Yes" || alcoholicBeverageSoldToPublic=="Yes"){
		addStdCondition("Banquet","Statement of Income and Expenses Required");
	}

}
