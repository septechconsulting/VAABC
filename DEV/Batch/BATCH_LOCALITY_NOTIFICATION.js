/*------------------------------------------------------------------------------------------------------/
| Program		: BATCH_LOCALITY_NOTIFICATION.js
| Event			: BATCH Script
|
| Usage			: Used as a batch script
| Notes			: Run nightly to send email notification when wfTask 'Preliminary Review' and status 'Application Received'
| Created by	: AWARRAD - SMS: PRJAUT-2018-00672
| Created at	: 06/11/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/

var SCRIPT_VERSION = "3.0";
var BATCH_NAME = "BATCH_LOCALITY_NOTIFICATION";
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, true));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, true));
eval(getScriptText("INCLUDES_CUSTOM", null, true));
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

/*------------------------------------ END OF USER PARAMETERS --------------------------------*/

var showDebug = true; // Set to true to see debug messages
var showMessage= true;
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

function mainProcess() {
	var capIDList = new Array(), capTypeModel, capModel;

		locNotDateResult = new Array();
		locNotDateResult = aa.cap.getCapIDsByAppSpecificInfoField("Locality Notice Date",sysDateFormatted);
		if (locNotDateResult.getSuccess())
		{
			capIDList= locNotDateResult.getOutput();
		}
	logDebug("Total Number of apps submitted on " + sysDateFormatted+ " : " + capIDList.length + "<br>");
	for (i in capIDList) {
		// only continue if time hasn't passed max allowed
		if (elapsed() > maxSeconds) {
			logMessage("WARNING", "A script timeout has caused partial completion of this process. Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.");
			timeExpired = true;
			break;
		}

		capId = capIDList[i].getCapID();
		var capIdArr = capId.toString().split('-');
		capId = aa.cap.getCapID(capIdArr[0], capIdArr[1], capIdArr[2]).getOutput();
		cap = aa.cap.getCap(capId).getOutput();
		
		capIDString = capId.getCustomID();

		logDebug("Record: " + capIDString+"<br>");
	
		loadASITables();
		if (DAYANDTIMEINFORMATION.length == 0)
			logDebug("No data entered into table...skipping");
		else
		{
			logDebug("checking table: " + DAYANDTIMEINFORMATION.length + " rows");
			var dateOfEvent = new Array();
			for (y in DAYANDTIMEINFORMATION) 
			{
				var tempObject = new Array();
				dateOfEvent.push(DAYANDTIMEINFORMATION[y]["Date"]);
			}
		}
		logDebug("Date of Event: " + dateOfEvent);
					
		var itemAppTypeResult = cap.getCapType();
		var itemAppTypeString = itemAppTypeResult.toString();
		var itemAppTypeArray = itemAppTypeString.split('/');
		var type = itemAppTypeArray[1].toUpperCase();

		var propertyAddress = getPropertyAddress(capId);
		if (propertyAddress != null) {
			var county = propertyAddress.getCounty();
			if (county != null && county != "") {
				var email = lookup("Locality_Notification_Lookup_TestRun", county + "-");
				if (email != null && email != "") {
					var appNotifyLocalityTemp = "ABC " + type + " APP NOTIFY LOCALITY";
					sendEmail(email, appNotifyLocalityTemp, propertyAddress, itemAppTypeArray, String(dateOfEvent));
				}

				var city = propertyAddress.getCity();
				if (city != null && city != "") {
					email = lookup("Locality_Notification_Lookup_TestRun", county + "-" + city);
					if (email != null && email != "") {
						var localityNotificationTemp = "ABC " + type + " APP NOTIFY LOCALITY";
						sendEmail(email, localityNotificationTemp, propertyAddress, itemAppTypeArray, String(dateOfEvent));
					}
				} else {
					logDebug("City is null for Record # " + capId + " , locality notification will not be sent.");
				}
			} else {
				logDebug("County is null for Record # " + capId + " , no notifications will be sent.");
			}
		}
	}
}

function sendEmail(email, emailTemplate, address, itemAppTypeArray, dateOfEvent) {
	var files = new Array();
	var eParams = aa.util.newHashtable();
	addParameter(eParams, "$$Locality$$", address.getCounty() + "-");
	addParameter(eParams, "$$DBATradeName$$", "");
	addParameter(eParams, "$$addressLine$$", getAddressLine(address));
	addParameter(eParams, "$$AddressDescription$$", address.getAddressDescription() == null ? "" : address.getAddressDescription());
	addParameter(eParams, "$$capTypeAlias$$", cap.getCapType().getAlias());
	addParameter(eParams, "$$license type$$", itemAppTypeArray[0] + "/" + itemAppTypeArray[1] + "/" + itemAppTypeArray[2] + "/License");
	addParameter(eParams, "$$LocalityEmail$$", email);
	addParameter(eParams, "$$AppEventDate$$", dateOfEvent);
	
	var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
	acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));
	eParams = getACARecordParam4Notification(eParams, acaSite);	
	
	var sent = aa.document.sendEmailByTemplateName("accela.auto-sender@abc.virginia.gov", email, "", emailTemplate, eParams, files);
	if (!sent.getSuccess()) {
		logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
	}
	
	return sent.getSuccess();
}
