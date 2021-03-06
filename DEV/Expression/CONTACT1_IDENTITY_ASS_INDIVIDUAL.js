﻿/*------------------------------------------------------------------------------------------------------/
| Program		: CONTACT1_IDENTITY_ASS_INDIVIDUAL.js
| Event			: Expression
|
| Usage			: 
| Notes			: On Submit
| Created by	: Suhail Wakil: BANB-18-000129-A
| Created at	: 08/21/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
var servProvCode = expression.getValue("$$servProvCode$$").value;
var driverLicenseNbr = expression.getValue("CONTACT1::contactsModel*driverLicenseNbr");
var stateIDNbr = expression.getValue("CONTACT1::contactsModel*stateIDNbr");
var maskedSsn = expression.getValue("CONTACT1::contactsModel*maskedSsn");
var state = expression.getValue("CONTACT1::contactsModel*state");
var driverLicenseState = expression.getValue("CONTACT1::contactsModel*driverLicenseState");
var form = expression.getValue("CONTACT1::FORM");
var ack = expression.getValue("CONTACT1TPLFORM::ABC_C_IND_R::IDENTIFYING INFO::Ack_NoFeeRefundWOutNumber");

var totalRowCount = expression.getTotalRowCount();
//If driverLicenseNbr, stateIDNbr and SSN is not provided
if ((driverLicenseNbr.value == null || driverLicenseNbr.value.equals(String(""))) && (stateIDNbr.value == null || stateIDNbr.value.equals(String("")))
	&& (maskedSsn.value == null || maskedSsn.value.equals(String(""))))
{
	//Block Form
	form.blockSubmit = true;
	expression.setReturn(form);

	//Present Message
	form.message = "Please enter one of the identification Numbers - Social Security Number (TIN), Driver's License Number or State Identity Number";
	expression.setReturn(form);

	//Reset Acknowledge Checkbox if previously checked
	ack.value = "UNCHECKED";
	expression.setReturn(ack);

	//Hide Acknowledge Checkbox
	ack.hidden = true;
	expression.setReturn(ack);
}
//Else If SSN is not provided 
else if (maskedSsn.value == null || maskedSsn.value.equals(String(""))) 
{
	//Present Message if Acknowledge Checkbox is not checked
	if(ack.value != "CHECKED"){
		form.message = "Please Acknowledge - Since SSN is not provided, you wont be able to get a refund.";
		expression.setReturn(form);
	}

	//Show Acknowledge Checkbox
	ack.hidden = false;
	expression.setReturn(ack);

	//Make Acknowledge Checkbox Required
	ack.required = true;
	expression.setReturn(ack);
}

//If Driving License Number is provided
if (!(driverLicenseNbr.value == null || driverLicenseNbr.value.equals(String("")))) {
		//Make License State as required
		driverLicenseState.required = true;
		expression.setReturn(driverLicenseState);
} else {
	driverLicenseState.required = false;
	expression.setReturn(driverLicenseState);
}

//If State ID Number is provided
if (!(stateIDNbr.value == null || stateIDNbr.value.equals(String("")))) {
	//Make State of ID as required
	state.required = true;
	expression.setReturn(state);
} else {
	state.required = false;
	expression.setReturn(state);
}

