/*------------------------------------------------------------------------------------------------------/
| Program : ACA_TOTAL_DAYS_PAGE_ONLOAD.js.js
| Event   : Pageflow Before
|
| Usage   : 
|
| Client  : N/A
| Action# : N/A
|
| Notes   : 
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
var showMessage = false; // Set to true to see results in popup window
var showDebug = false; // Set to true to see debug messages in popup window
var preExecute = ""
var controlString = ""; // Standard choice for control
var documentOnly = false; // Document Only -- displays hierarchy of std choice steps
var disableTokens = false; // turn off tokenizing of std choices (enables use of "{} and []")
var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false; // Use Group name when populating Task Specific Info Values
var enableVariableBranching = false; // Allows use of variable names in branching.  Branches are not followed in Doc Only
var maxEntries = 99; // Maximum number of std choice entries.  Entries must be Left Zero Padded
/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/

var cancel = false;
var startDate = new Date();
var startTime = startDate.getTime();
var message = ""; // Message String
var debug = ""; // Debug String
var br = "<BR>"; // Break Tag

var SCRIPT_VERSION = 2.0;

var useProductScript = true; // if true, use Events->Custom Script and Master Scripts, else use Events->Scripts->INCLUDES_*

if (documentOnly) {
	doStandardChoiceActions(controlString, false, 0);
	aa.env.setValue("ScriptReturnCode", "0");
	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");
	aa.abortScript();
}

var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {
	useSA = true;
	SA = bzr.getOutput().getDescription();
	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
	if (bzr.getSuccess()) {
		SAScript = bzr.getOutput().getDescription();
	}
}

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useProductScript));
eval(getScriptText("INCLUDES_CUSTOM", null, useProductScript));

if (documentOnly) {
	doStandardChoiceActions(controlString, false, 0);
	aa.env.setValue("ScriptReturnCode", "0");
	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");
	aa.abortScript();
}

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

var cap = aa.env.getValue("CapModel");
var capId = cap.getCapID();
var servProvCode = capId.getServiceProviderCode() // Service Provider Code
var publicUser = false;
var currentUserID = aa.env.getValue("CurrentUserID");
var publicUserID = aa.env.getValue("CurrentUserID");
if (currentUserID.indexOf("PUBLICUSER") == 0) {
	currentUserID = "ADMIN";
	publicUser = true
} // ignore public users
var capIDString = capId.getCustomID(); // alternate cap id string
var systemUserObj = aa.person.getUser(currentUserID).getOutput(); // Current User Object
var appTypeResult = cap.getCapType();
var appTypeString = appTypeResult.toString(); // Convert application type to string ("Building/A/B/C")
var appTypeArray = appTypeString.split("/"); // Array of application type string
var currentUserGroup;
var currentUserGroupObj = aa.userright.getUserRight(appTypeArray[0], currentUserID).getOutput()
if (currentUserGroupObj)
	currentUserGroup = currentUserGroupObj.getGroupName();
var capName = cap.getSpecialText();
var capStatus = cap.getCapStatus();
var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");

var AInfo = new Array(); // Create array for tokenized variables
loadAppSpecific4ACA(AInfo); // Add AppSpecific Info

/*------------------------------------------------------------------------------------------------------/
| BEGIN Event Specific Variables
/------------------------------------------------------------------------------------------------------*/
var isEmpty = true;
/*------------------------------------------------------------------------------------------------------/
| END Event Specific Variables
/------------------------------------------------------------------------------------------------------*/

if (preExecute.length)
	doStandardChoiceActions(preExecute, true, 0); // run Pre-execution code

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/
var message = " ";	
try {
	var rows = calcRowCount4ASIT("DAY AND TIME INFORMATION");
	//message = message + "**ERROR ROWS "+ rows +"<BR>";
	if (AInfo['License Fee Waiver'] == 'No')
		editAppSpecificACA("Total Days", Number(rows));
} catch (err) {
	logDebug(err)
}
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

//Used for debuggng using Error Message if no access to server logs (remove //). Commits don't happen if on
if (message.indexOf("//**ERROR") > 0)
{
	aa.env.setValue("ErrorCode", "1");
	aa.env.setValue("ErrorMessage", message);
}

if (debug.indexOf("**ERROR") > 0) {
	aa.env.setValue("ErrorCode", "1");
	aa.env.setValue("ErrorMessage", debug);
} else {
	if (cancel) {
		aa.env.setValue("ErrorCode", "-2");
		if (showMessage)
			aa.env.setValue("ErrorMessage", message);
		if (showDebug)
			aa.env.setValue("ErrorMessage", debug);
	} else {
		aa.env.setValue("ErrorCode", "0");
		if (showMessage)
			aa.env.setValue("ErrorMessage", message);
		if (showDebug)
			aa.env.setValue("ErrorMessage", debug);
	}
}
/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/

function logDebug(dstr)
{
	debug+=dstr + br;
}

function logMessage(dstr) 
{
	message+=dstr + br;
}

function calcRowCount4ASIT(tableName)
{
    var rowCount = 0;
    var appSpecificTableGroupModel = cap.getAppSpecificTableGroupModel();
    if(appSpecificTableGroupModel != null )
    {
        var tablesMap = appSpecificTableGroupModel.getTablesMap();
        if(tablesMap == null && tablesMap.values() == null) return 0;
        var appSpecificTableModelArray = tablesMap.values().toArray();
        for( i in appSpecificTableModelArray)
        {
            var appSpecificTableModel = appSpecificTableModelArray[i];
            if(!appSpecificTableModel.getTableName().equals(tableName) ) continue;
            if(appSpecificTableModel == null || appSpecificTableModel.getColumns() == null || appSpecificTableModel.getTableField() == null) continue;
            var columnCount =  appSpecificTableModel.getColumns().toArray().length;  // Columm Count
            var fieldCount = appSpecificTableModel.getTableField().toArray().length; // Field Count
            rowCount = fieldCount/columnCount;
            break;
        }
    }
    return rowCount
}

function editAppSpecificACA(fieldName, value){
    var thisCapModel = aa.env.getValue("CapModel");     
    var asiGroups = thisCapModel.getAppSpecificInfoGroups();
    var asiGroupsRet = setFieldValue(fieldName, asiGroups, value);
    thisCapModel.setAppSpecificInfoGroups(asiGroupsRet);
    aa.env.setValue("CapModel", thisCapModel);      
}

function setFieldValue(fieldName, asiGroups, value)
{     
        if(asiGroups == null)
        {
            return null;
        }
        
    var iteGroups = asiGroups.iterator();
    while (iteGroups.hasNext())
    {
        var group = iteGroups.next();
        var fields = group.getFields();
        if (fields != null)
        {
            var iteFields = fields.iterator();
            while (iteFields.hasNext())
            {
                var field = iteFields.next();              
                if (fieldName == field.getCheckboxDesc())
                {
                     field.setChecklistComment(value);
                     group.setFields(fields);
                }
            }
        }
    }   
    return asiGroups;   
}