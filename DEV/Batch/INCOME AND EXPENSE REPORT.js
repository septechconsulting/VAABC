
/*------------------------------------------------------------------------------------------------------/
| Program		: INCOME AND EXPENSE REPORT.js
| Event			: BATCH Script
|
| Usage			: Used as a batch script
| Notes			: Send Income and Expense Report Reminder
| Created by	: AWARRAD 
| Created at	: 07/31/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = "3.0";
var BATCH_NAME = "SEND INCOME AND EXPENSE REPORT REMINDER";
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, true));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, true));
eval(getScriptText("INCLUDES_CUSTOM", null, true));
var showDebug = true; // Set to true to see debug messages
var showMessage = true;
function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)
		servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		if (useProductScripts) {
			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		} else {
			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
		}
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}
elapsed = function() {
	var thisDate = new Date();
	var thisTime = thisDate.getTime();
	return ((thisTime - startTime) / 1000)
}
logMessage = function(etype, edesc) {
	aa.eventLog.createEventLog(etype, "Batch Process", BATCH_NAME, sysDate, sysDate, "", edesc, batchJobID);
	aa.print(etype + " : " + edesc);
	emailText += etype + " : " + edesc + "\n";
}
logDebug = function(edesc) {
	if (showDebug) {
		aa.eventLog.createEventLog("DEBUG", "Batch Process", BATCH_NAME, sysDate, sysDate, "", edesc, batchJobID);
		aa.print("DEBUG : " + edesc);
		emailText += "DEBUG : " + edesc + "\n";
	}
}

/*------------------------------------ USER PARAMETERS ---------------------------------------*/
var batchJobName = "" + aa.env.getValue("BatchJobName");
var appCategory = aa.env.getValue("appCategory");
var appGroup = aa.env.getValue("appGroup");
var appSubtype = aa.env.getValue("appSubtype");
var appType = aa.env.getValue("appType");
var emailAddress = aa.env.getValue("emailAddress");
var emailTemplate = aa.env.getValue("emailTemplate");
var expirationStatus = aa.env.getValue("expirationStatus");
/*------------------------------------ END OF USER PARAMETERS --------------------------------*/
var maxSeconds = 5 * 60; // number of seconds allowed for batch processing,
// usually < 5*60

var startDate = new Date();

var timeExpired = false;
var emailText = "";
var startTime = startDate.getTime(); // Start timer
var sysDate = aa.date.getCurrentDate();
var sysDateFormatted = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear());
var batchJobID = aa.batchJob.getJobID().getOutput();
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var servProvCode = aa.getServiceProviderCode();
var capId;
var cap;

logMessage("START", "Start of Job");
if (!timeExpired)
	mainProcess();
logMessage("END", "End of Job: Elapsed Time : " + elapsed() + " Seconds");

if (emailAddress != null && emailAddress != "")
	aa.sendMail("noreply@accela.com", emailAddress, "", batchJobName + " Results", emailText);

function mainProcess() {
	var runs = [ 1, 60, 80 ];

	for ( var r in runs) {
			var daysTilDue;
			var days = runs[r];
			if (days == 1)
				daysTilDue = 90;
			else
				daysTilDue = 90 - days;
			
			var fromDate = dateAdd(null,-parseInt(days));
			var toDate = dateAdd(null,-parseInt(days));
			
			var expResult = aa.expiration.getLicensesByDate(expirationStatus,fromDate,toDate);
			
	   if (expResult.getSuccess())
		  {
		  myExp = expResult.getOutput();
		  logDebug("Processing " + myExp.length + " expiration records due in " + daysTilDue + " days");
		  }			
				
		if (myExp && myExp.length > 0) {
			for ( var thisExp in myExp) {
				if (elapsed() > maxSeconds) {
					logMessage("WARNING", "A script timeout has caused partial completion of this process. Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.");
					timeExpired = true;
					break;
				}
				b1Exp = myExp[thisExp];
				capId = aa.cap.getCapID(b1Exp.getCapID().getID1(),b1Exp.getCapID().getID2(),b1Exp.getCapID().getID3()).getOutput();

				validate(capId,daysTilDue);
			}
		}
	}
}

function validate(capId,daysTilDue) {
	var compensationForOrganizing = getAppSpecific("Compensation For Organizing", capId);
	var includedFee = getAppSpecific("Alcohol Included In Fee", capId);
	var cashBar = getAppSpecific("Cash Bar", capId);
	var soldToPublic = getAppSpecific("Alcoholic Beverage Sold to Public", capId);
	var isStatementAttached = false;

	docListResult = aa.document.getCapDocumentList(capId, aa.getAuditID());

	if (docListResult.getSuccess()) {
		docListArray = docListResult.getOutput();
		for ( var i in docListArray) {
			var document = docListArray[i];
			var cat = document.getDocCategory();
			if (cat.toUpperCase() == "STATEMENT OF INCOME AND EXPENSES") {
				isStatementAttached = true;
			}
		}
	}
if ((compensationForOrganizing == "Yes" || includedFee == "Yes" || cashBar == "Yes" || soldToPublic == "Yes") && !isStatementAttached)
	sendEmail(capId, daysTilDue);
}

function sendEmail(capId, daysTilDue) {
	var contactArray = getPeople(capId);
	for ( var i in contactArray) {
		var contact = contactArray[i].getPeople();
		if (contact.getEmail() != null && contact.getEmail() != "") {
			var email = contact.getEmail();
			var files = new Array();
			var eParams = aa.util.newHashtable();
			getRecordParams4Notification(eParams);
			addParameter(eParams, "$$altID$$", capId.getCustomID());
			addParameter(eParams, "$$DaysTilDue$$", daysTilDue.toString());
			var acaURL = lookup("ACA_CONFIGS", "ACA_SITE");
			acaURL = acaURL.substr(0, acaURL.toUpperCase().indexOf("/ADMIN"));
			addParameter(eParams, "$$acaURL$$", acaURL);
			addParameter(eParams, "$$ApplicantEmail$$", email);
			addParameter(eParams, "$$ApplicantFullName$$", contact.getFirstName() + " " + contact.getLastName());
			var sent = aa.document.sendEmailByTemplateName("", email, "", emailTemplate, eParams, files);
			if (!sent.getSuccess()) {
				logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
			} else {
				logMessage("**INFO an email has been sent to " + email + " , capId= " + capId);
			}
		}
	}
}

function getRunCapIdList(capIDList, days) {
	var runCapIdList = new Array();
	for ( var i in capIDList) {
		var capId = capIDList[i].getCapID();
		;
		var capIdArr = capId.toString().split('-');
		capId = aa.cap.getCapID(capIdArr[0], capIdArr[1], capIdArr[2]).getOutput();

		var b1ExpResult = aa.expiration.getLicensesByCapID(capId);
		if (b1ExpResult.getSuccess()) {
			var b1Exp = b1ExpResult.getOutput();

			var today = new Date();
			var compareDate = new Date();
			compareDate.setDate(today.getDate() - days);
			var tmpDate = b1Exp.getExpDate(); // To be converted to  JavaScript date
			var expDate = new Date(tmpDate.getMonth() + "/" + tmpDate.getDayOfMonth() + "/" + tmpDate.getYear());

			if (datesAreEqual(expDate, compareDate)) {
				runCapIdList.push(capId);
			}
		} else {
			logDebug("**ERROR: Getting B1Expiration Object for Cap.  Reason is: " + b1ExpResult.getErrorType() + ":" + b1ExpResult.getErrorMessage());
		}
	}

	return runCapIdList;
}

function datesAreEqual(date1, date2) {
	date1 = date1.setHours(0, 0, 0, 0);
	date2 = date2.setHours(0, 0, 0, 0);
	return (date1 == date2);
}
