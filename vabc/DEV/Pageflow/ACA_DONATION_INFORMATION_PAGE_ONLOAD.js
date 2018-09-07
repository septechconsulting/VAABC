/*------------------------------------------------------------------------------------------------------/
| Program : ACA_DONATION_INFORMATION_PAGE_BEFORE.js
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
	var isNonProfit = "N";
	var organizationName = "";
	var phone = "";
	message = message + "**ERROR "+AInfo["Nonprofit Donation"]  +"<BR>";
		
	//If ASI - Nonprofit Donation = No then in the ASIT Donation Information Add ASIT Row
	//Check if Nonprofit Donation is No
	if (AInfo["Nonprofit Donation"] == "No") {

		//Get Sponsoring Organization
		var sponsoringOrg = getContactByType4ACA("Sponsoring Organization");
		message = message + " sponsoringOrg: " +sponsoringOrg +"<BR>";
		
		//Get Sponsoring Organization Name
		/*if (!((sponsoringOrg.getFirstName()) && (sponsoringOrg.getMiddleName()) && (sponsoringOrg.getLastName()))) {
			if (sponsoringOrg.getFirstName())
				organizationName += sponsoringOrg.getFirstName() + " ";
			if (sponsoringOrg.getMiddleName())
				organizationName += sponsoringOrg.getMiddleName() + " ";
			if (sponsoringOrg.getLastName())
				organizationName += sponsoringOrg.getLastName();
		} else if (sponsoringOrg.getBusinessName()) {*/
			organizationName = sponsoringOrg.getBusinessName();
		//}
		message = message + " organizationName: " +organizationName +"<BR>";

		//Get Sponsoring Organization Phone
		if (sponsoringOrg.getPhone3()) {
			phone = sponsoringOrg.getPhone3();
		} else if (sponsoringOrg.getPhone2()) {
			phone = sponsoringOrg.getPhone2();
		} else if (sponsoringOrg.getPhone1()) {
			phone = sponsoringOrg.getPhone1();
		}
		message = message + " phone: " +phone +"<BR>";

		//Get Sponsoring Organization Tax Exempt
		if (sponsoringOrg) {
			var tm = sponsoringOrg.getTemplate();
			if (tm) {
				isNonProfit = getContactAppSpecific("Tax Exempt", tm);
				message = message + " isNonProfit: " +isNonProfit +"<BR>";
			}
		}		

		var copyToTable = 'DONATION INFORMATION';
		var donationTable = new Array();
		
		loadACAASITables();
		message = message + " typeof(DONATIONINFORMATION): " +typeof(DONATIONINFORMATION) +"<BR>";

		//Check if DONATION INFORMATION table is already existing (No action)
		if (typeof(DONATIONINFORMATION) != "object") {
				//Create a row with Organization Information
				row = new Array(); 
				row["Name of Organization to Which Profits Will Be Donated"] = new asiTableValObj("Name of Organization to Which Profits Will Be Donated", organizationName, "N");
				row["Is organization a non profit"] = new asiTableValObj("Is organization a non profit", String(isNonProfit), "N");
				row["Name and Phone Number of Contact Person for Organization"] = new asiTableValObj("Name and Phone Number of Contact Person for Organization", String(phone), "N");
				row["Will net profits be used for any of the following purposes"] = new asiTableValObj("Will net profits be used for any of the following purposes", "", "N");
				donationTable.push(row);  	

				message = message + " donationTable.length: " +donationTable.length +"<BR>";
				
				// Create ASITable and add row to the table
				var asit =  cap.getAppSpecificTableGroupModel();	
				if (donationTable.length > 0)
				{ 
					newasit = addASITable4ACAPageFlowFix(asit, copyToTable, donationTable);
					message = message + " newasit: " +newasit +"<BR>";
					cap.setAppSpecificTableGroupModel(newasit);
					aa.env.setValue("CapModel", cap);	
				}
		}
	}
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
function getContactByType4ACA(cType) {
	var capContactArray = new Array();

	if (cap.getContactsGroup().size() > 0) {
		var capContactAddArray = cap.getContactsGroup().toArray();
		for (ccaa in capContactAddArray)
			capContactArray.push(capContactAddArray[ccaa]);

		for ( var cIndex in capContactArray) {
			var cContact = capContactArray[cIndex];
			var peopleModel = cContact.getPeople();
			if ((peopleModel.contactType).toUpperCase() == cType.toUpperCase())
				return peopleModel;
		}
	}
	return false;
}

function addASITable4ACAPageFlowFix(destinationTableGroupModel,tableName,tableValueArray) // optional capId
    	{
   	var itemCap = capId
  	if (arguments.length > 3)
  		itemCap = arguments[3]; // use cap ID specified in args

  	var ta = destinationTableGroupModel.getTablesMap().values();
  	var tai = ta.iterator();

  	var found = false;

  	while (tai.hasNext())
  		  {
  		  var tsm = tai.next();  // com.accela.aa.aamain.appspectable.AppSpecificTableModel
  		  if (tsm.getTableName().equals(tableName)) { found = true; break; }
  	          }


  	if (!found) { logDebug("cannot update asit for ACA, no matching table name"); return false; }

	var fld = aa.util.newArrayList();  // had to do this since it was coming up null.
        var fld_readonly = aa.util.newArrayList(); // had to do this since it was coming up null.
  	var i = -1; // row index counter

         	for (thisrow in tableValueArray)
  		{


  		var col = tsm.getColumns()
  		var coli = col.iterator();

  		while (coli.hasNext())
  			{
  			var colname = coli.next();

			if (typeof(tableValueArray[thisrow][colname.getColumnName()]) == "object")  // we are passed an asiTablVal Obj
				{
				var args = new Array(tableValueArray[thisrow][colname.getColumnName()].fieldValue,colname);
				var fldToAdd = aa.proxyInvoker.newInstance("com.accela.aa.aamain.appspectable.AppSpecificTableField",args).getOutput();
				/* for (i in fldToAdd){
					aa.debug("HERE----", i);
				} */
				
				
				fldToAdd.setRowIndex(i);
				fldToAdd.setFieldLabel(colname.getColumnName());
				fldToAdd.setFieldGroup('MULTI_TIMES'.replace(/ /g,"\+"));
				
				aa.debug("HERE-fieldGroup ", fldToAdd.getFieldGroup());
				
				//fldToAdd.setFieldGroup("MULTI_TIMES");
				fldToAdd.setReadOnly(tableValueArray[thisrow][colname.getColumnName()].readOnly.equals("Y"));
				fld.add(fldToAdd);
				fld_readonly.add(tableValueArray[thisrow][colname.getColumnName()].readOnly);

				}
			else // we are passed a string
				{
				var args = new Array(tableValueArray[thisrow][colname.getColumnName()],colname);
				var fldToAdd = aa.proxyInvoker.newInstance("com.accela.aa.aamain.appspectable.AppSpecificTableField",args).getOutput();
				fldToAdd.setRowIndex(i);
				fldToAdd.setFieldLabel(colname.getColumnName());
				fldToAdd.setFieldGroup(tableName.replace(/ /g,"\+"));
				//fldToAdd.setFieldGroup("MULTI_TIMES");
				fldToAdd.setReadOnly(false);
				fld.add(fldToAdd);
				fld_readonly.add("N");

				}
  			}

  		i--;

  		}
  	tsm.setTableFields(fld); // MODIFIED
  	tsm.setReadonlyField(fld_readonly); // set readonly field

    tssm = tsm;

    return destinationTableGroupModel;
}

function loadACAASITables() {
	//logDebugWithThreadID("Loading ASIT for Venue NOC:"+count);
	var gm = cap.getAppSpecificTableGroupModel();
	if(gm == null)
	{
		return;
	}
	var ta = gm.getTablesMap();
	if(ta == null)
	{
		return;
	}
	var tai = ta.values().iterator();
	while (tai.hasNext()) {
		var tsm = tai.next();

		if (tsm.rowIndex.isEmpty())
			continue; // empty table

		var tempObject = new Array();
		var tempArray = new Array();
		var tn = tsm.getTableName();

		tn = String(tn).replace(/[^a-zA-Z0-9]+/g, '');

		if (!isNaN(tn.substring(0, 1)))
			tn = "TBL" + tn // prepend with TBL if it starts with a number

				var tsmfldi = tsm.getTableField().iterator();
		var tsmcoli = tsm.getColumns().iterator();
		var numrows = 1;
		while (tsmfldi.hasNext()) // cycle through fields
		{
			if (!tsmcoli.hasNext()) // cycle through columns
			{

				var tsmcoli = tsm.getColumns().iterator();
				tempArray.push(tempObject); // end of record
				var tempObject = new Array(); // clear the temp obj
				numrows++;
			}
			var tcol = tsmcoli.next();
			var tval = tsmfldi.next();
			tempObject[tcol.getColumnName()] = tval;
		}
		tempArray.push(tempObject); // end of record
		var copyStr = "" + tn + " = tempArray";
		eval(copyStr); // move to table name
	}
}

function logDebug(dstr)
{
	debug+=dstr + br;
}

function logMessage(dstr) 
{
	message+=dstr + br;
}
