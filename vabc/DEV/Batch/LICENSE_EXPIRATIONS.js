aa.env.setValue("DAY_SPAN","30");
aa.env.setValue("EXPIRATION_STATUS","Active");
aa.env.setValue("PROCESSED_SET_PREFIX","Banquet");
aa.env.setValue("PROCESSED_SET_STATUS","*");
aa.env.setValue("NO_EMAIL_SET_PREFIX","NO_EMAIL_LIC_RECORDS");
aa.env.setValue("NO_EMAIL_SET_STATUS","Active");
aa.env.setValue("WORKFLOW_CRITERIA_TASKS","License Status,Permit Status");
aa.env.setValue("WORKFLOW_CRITERIA_STATUS","Active");
aa.env.setValue("EMAIL_TEMPLATE","LICENSE ABOUT TO EXPIRE");
aa.env.setValue("EMAIL_REPORT_NAME","");



/*
 * Title: License Expiration Batch
 * 
 * Desc: sends email to License Holder of a record when it's about to expire, records fetched by expiration date
 * 
 * Author: Yazan Barghouth
 * 
 * Batch Parameters:
 * -DAY_SPAN : REQUIRED, search records with expiration between today and today+DAY_SPAN
 * -EXPIRATION_STATUS : REQUIRED, search records with expiration status
 * -PROCESSED_SET_PREFIX : REQUIRED, prefix of set name to put processed records in (full name can be provided, if prefix only, script will complete it with todays date)
 * -PROCESSED_SET_STATUS : REQUIRED, Set status
 * -NO_EMAIL_SET_PREFIX : REQUIRED, prefix of set name to put records with no email, or ASI=Yes, (full name can be provided, if prefix only, script will complete it with todays date)
 * -NO_EMAIL_SET_STATUS : REQUIRED, Set status
 * -WORKFLOW_CRITERIA_TASKS : OPTIONAL, tasks (comma separated) to check if any one matched with status
 * -WORKFLOW_CRITERIA_STATUS : OPTIONAL (required for WORKFLOW_CRITERIA_TASKS), 1 status to check if any of the tasks matched with
 * -EMAIL_TEMPLATE : REQUIRED, email template name
 * -EMAIL_REPORT_NAME : OPTIONAL, report name to attach
 * 
 * 
 */
 
 var SCRIPT_VERSION = "3.0";
var BATCH_NAME = "LICENSE ABOUT TO EXPIRE";
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


	logDebug("**GO");
	
	var recordTypeArray = [ "Licenses/*/*/License", "Permits/*/*/Permits" ];//getBatchParam("RECORD_TYPES").split(",");
	var execludeCapStatusArray = getBatchParam("EXCLUDE_CAP_STATUSES").split(",");
	var criExpStatus = getBatchParam("EXPIRATION_STATUS");

	var daySpan = getBatchParam("DAY_SPAN");
	var fromDate = aa.util.formatDate(new Date(), "MM/dd/YYYY");
	var toDate = dateAdd(fromDate, daySpan);
	var criWorkflowTaskArray = getBatchParam("WORKFLOW_CRITERIA_TASKS").split(",");
	var criWorkflowStatus = getBatchParam("WORKFLOW_CRITERIA_STATUS");

	var notificationTemplateName = getBatchParam("EMAIL_TEMPLATE");
	var notificationReportName = getBatchParam("EMAIL_REPORT_NAME");

	var processedRecordsSetPrefix = getBatchParam("PROCESSED_SET_PREFIX");
	var processedRecordsSetStatus = getBatchParam("PROCESSED_SET_STATUS");
	var noEmailsSetPrefix = getBatchParam("NO_EMAIL_SET_PREFIX");
	var noEmailsSetStatus = getBatchParam("NO_EMAIL_SET_STATUS");

	processExpirationRecords(recordTypeArray, execludeCapStatusArray, criExpStatus, fromDate, toDate, criWorkflowTaskArray, criWorkflowStatus, notificationTemplateName,
			notificationReportName, processedRecordsSetPrefix, processedRecordsSetStatus, noEmailsSetPrefix, noEmailsSetStatus);

}

function processExpirationRecords(recordTypeArray, execludeCapStatusArray, criExpStatus, fromDate, toDate, criWorkflowTaskArray, criWorkflowStatus, notificationTemplateName,
		notificationReportName, processedRecordsSetPrefix, processedRecordsSetStatus, noEmailsSetPrefix, noEmailsSetStatus) {

	var expiration = aa.expiration.getLicensesByDate(criExpStatus, fromDate, toDate);
	if (!expiration.getSuccess()) {
		throw "processExpirationRecords() Error in getLicensesByDate(): " + expiration.getErrorMessage();
	}

	expiration = expiration.getOutput();

	logDebug("**INFO Records found: " + expiration.length);

	if (expiration.length == 0) {
		return;
	}

	var processedSet = prepareSet(processedRecordsSetPrefix, processedRecordsSetStatus);
	var noEmailSet = prepareSet(noEmailsSetPrefix, noEmailsSetStatus);

	for (e in expiration) {
		b1Exp = expiration[e];
		capId = aa.cap.getCapID(b1Exp.getCapID().getID1(),b1Exp.getCapID().getID2(),b1Exp.getCapID().getID3()).getOutput();		
		cap = aa.cap.getCap(capId).getOutput();

		if (!validateRecordType(cap, recordTypeArray)) {
			continue;
		}
		logDebug("**INFO processing record: " + capId.getCustomID());

		if (execludeCapStatusArray && validateCapStatus(cap.getCapStatus(), execludeCapStatusArray)) {
			continue;
		}

		var taskMatched = false;
		for (w in criWorkflowTaskArray) {
			if (isTaskStatus(criWorkflowTaskArray[w], criWorkflowStatus)) {
				taskMatched = true;
				break;
			}
		}//for all cri tasks
		if (criWorkflowTaskArray != null && criWorkflowTaskArray.length > 0 && !taskMatched) {
			continue;
		}

		//Do Actions:
		if (validateRecordType(cap, [ "Licenses/Banquet/*/License" ])) {
			expiration[e].setExpStatus("Expired");
			aa.expiration.editB1Expiration(expiration[e].getB1Expiration());
			for (w in criWorkflowTaskArray) {
				updateTask(criWorkflowTaskArray[w], "Expired", "by batch", "by batch");
			}//for all workflow tasks
		} else {
			expiration[e].setExpStatus("About to Expire");
			aa.expiration.editB1Expiration(expiration[e].getB1Expiration());
			for (w in criWorkflowTaskArray) {
				updateTask(criWorkflowTaskArray[w], "About to Expire", "by batch", "by batch");
			}//for all workflow tasks

			updateAppStatus("About to Expire", "by batch");

			var licenseHolder = getContactByType("License Holder", capId);

			if (!licenseHolder || licenseHolder.getEmail() == null || licenseHolder.getEmail() == "") {
				logDebug("**WARN no License Holder or has no email, Record: " + capId);
				noEmailSet.add(capId);
				continue;
			}

			var eParams = aa.util.newHashtable();
			addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
			addParameter(eParams, "$$recordName$$", cap.getSpecialText());
			addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
			addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
			addParameter(eParams, "$$fileDate$$", cap.getFileDate());

			if (notificationReportName != "") {
				var repParams = aa.util.newHashMap();
				repParams.put("altID", cap.getCapModel().getAltID());
				aa.print("cap.getCapModel().getAltID() " + cap.getCapModel().getAltID());
				repParams.put("p1Value", cap.getCapModel().getAltID());
				sendEmailWithReportLocal(licenseHolder.getEmail(), notificationTemplateName, notificationReportName, repParams, eParams, cap.getCapModel().getModuleName());
			} else {
				sendNotification("", licenseHolder.getEmail(), "", notificationTemplateName, eParams, null);
			}

			processedSet.add(capId);
		}//other record types

	}//for all caps found
}

function validateCapStatus(capStatus, execludeCapStatusArray) {
	if (execludeCapStatusArray == null || execludeCapStatusArray == 'undefined' || execludeCapStatusArray == "") {
		return false;
	}
	for (c in execludeCapStatusArray) {
		if (execludeCapStatusArray[c] == capStatus) {
			return true;
		}
	}//for all statuses
	return false;
}

function validateRecordType(itemCapModel, appTypeArray) {
	var thisAppType = itemCapModel.getCapType().getValue();
	thisAppType = thisAppType.split("/");
	for (t in appTypeArray) {
		var tmpAppType = appTypeArray[t].split("/");

		if ((tmpAppType[0] == "*" || tmpAppType[0] == thisAppType[0]) && (tmpAppType[1] == "*" || tmpAppType[1] == thisAppType[1])
				&& (tmpAppType[2] == "*" || tmpAppType[2] == thisAppType[2]) && (tmpAppType[3] == "*" || tmpAppType[3] == thisAppType[3])) {
			return true;
		}
	}//for all types
	return false;
}

function getBatchParam(paramName) {
	var tmpValue = aa.env.getValue(paramName);
	if (tmpValue == null)
		tmpValue = "";
	return tmpValue;
}

/**
 * get or create (if not exist) a set
 * @param setPrefix find set by prefix
 * @param setStatus find set by status
 * @returns {Set} the created or fetched Set
 */
function prepareSet(setPrefix, setStatus) {

	// search for an open mailer set, if it doesn't exist, create a new one
	var setId;
	var setHeaderSearch = aa.set.getSetHeaderScriptModel().getOutput();
	setHeaderSearch.setSetID(setPrefix);
	//	setHeaderSearch.setSetStatus(setStatus);
	var setSearchResult = aa.set.getSetHeaderListByModel(setHeaderSearch);
	if (setSearchResult.getSuccess) {
		var setArray = setSearchResult.getOutput();
		if (setArray) {
			setArray = setArray.toArray();
			//use last set in list (if multiple were found)
			for (s in setArray) {
				var thisSetHeader = setArray[s];
				setId = thisSetHeader.getSetID();
				continue;
			}
		} else {
			var startDate = new Date();
			var yy = startDate.getFullYear().toString();
			var mm = (startDate.getMonth() + 1).toString();
			if (mm.length < 2)
				mm = "0" + mm;
			var dd = startDate.getDate().toString();
			if (dd.length < 2)
				dd = "0" + dd;
			setId = setPrefix + "_" + mm + "/" + dd + "/" + yy;
			logDebug("**INFO No existing sets found. Creating a new one. Set ID: " + setId);
		}
	}

	var theSet = new capSet(setId);
	return theSet;
}

function sendEmailWithReportLocal(applicantEmail, emailTemplateName, reportName, rptParams, emailParams, moduleName) {
	var report = aa.reportManager.getReportInfoModelByName(reportName);
	if (report == null) {
		logDebug("**WARN getReportInfoModelByName() returned NULL, reportType=" + reportName);
		return false;
	}
	if (report.getSuccess()) {
		var reportFiles = new Array();

		report = report.getOutput();
		report.setModule(moduleName);
		report.setCapId(capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3());
		report.setReportParameters(rptParams);

		var hasPerm = aa.reportManager.hasPermission(reportName, aa.getAuditID());
		if (hasPerm.getSuccess() && hasPerm.getOutput().booleanValue()) {
			var reportResult = aa.reportManager.getReportResult(report);
			if (reportResult.getSuccess()) {
				reportResult = reportResult.getOutput();
				var reportFile = aa.reportManager.storeReportToDisk(reportResult);
				if (reportFile.getSuccess()) {
					reportFile = reportFile.getOutput();
					reportFiles.push(reportFile);
				} else {
					logDebug("**WARN storeReportToDisk() failed: " + reportFile.getErrorMessage());
				}
			}//report result OK
		}//has permission

		var altIDScriptModel = aa.cap.createCapIDScriptModel(capId.getID1(), capId.getID2(), capId.getID3());
		var sent = aa.document.sendEmailAndSaveAsDocument("", applicantEmail, "", emailTemplateName, emailParams, altIDScriptModel, reportFiles);
		if (!sent.getSuccess()) {
			logDebug("**WARN send email failed, Error: " + sent.getErrorMessage());
			return false;
		}
		return true;
	} else {//report OK
		logDebug("**WARN getReportInfoModelByName() failed: " + report.getErrorMessage());
		return false;
	}
}
