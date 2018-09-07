/*------------------------------------------------------------------------------------------------------/
| Program		: DUA;LICENSES!~!~!APPLICATION.js
| Event			: Event Script
|
| Usage			: 
| Notes			:
| Created by	: AWARRAD 
| Created at	: 08/09/2018
| Parameters    : 
/------------------------------------------------------------------------------------------------------*/
capStatus = cap.getCapStatus();
if (capStatus == "Addtl Info Req")
	updateAppStatus("Addtl Info Received", "");
