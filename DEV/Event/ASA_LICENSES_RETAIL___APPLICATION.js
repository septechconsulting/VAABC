retailBackgroundFeeAssessment();
function retailBackgroundFeeAssessment(){
	try{
		var feeQty=0;
		var conArray=getContactsByType(capId,"Associated Individual");
		if (conArray!=null){
			for (cc in conArray){
				var capContactScriptModel = conArray[cc];
				var capContact = capContactScriptModel.getCapContactModel();
				var tm = capContact.getTemplate();
				var res=getContactAppSpecific("Are you currently or have you previously been a resident in Virginia or",tm);

				if (res!=null && (String(res).toUpperCase()=="YES" || String(res).toUpperCase()=="Y")){
					var asitValueArray=getContactAppSpecTableColValue("Date background check received","BACKGROUND CHECK DETAILS",tm);
					if (asitValueArray!=null){
						var isAllMoreThan24Months=true;			
						for (i in asitValueArray ){
							// check all rows values :if one of the rows value< 24 then skip this contact else increment the Fee Quantity
							var today=new Date();
							var receivedDate=new Date(asitValueArray[i]);
							var diffInMonths=parseInt(dateDiff(receivedDate,today))/30;
							if (diffInMonths<24){
								isAllMoreThan24Months=false;
								break;
						     }
						}
						// if all received date are more than 24 months then consider the current contact for assessed fee quantity
						if (isAllMoreThan24Months)feeQty++;
					}
				}
			}
		} 

		if (feeQty>0){
			updateFee("ABC_GEN_BKGC","ABC_GENERAL","FINAL",feeQty);
		}
		
	} catch (e) {
		cancel = true;
		showMessage = true;
		comment(e);
	}

}


/**
 * Function to return contact array by type
 * @param itemCap
 * @param typeToLoad
 * @returns Array or null(if Empty)
 */
function getContactsByType(itemCap,typeToLoad){
	var capContactResult = aa.people.getCapContactByCapID(itemCap);
    if (capContactResult.getSuccess()) {
        var capContactArray = capContactResult.getOutput();
    } 
   
    if (capContactArray) {
    	var conArray=new Array();
        for (var yy in capContactArray) {
            if (capContactArray[yy].getPeople().contactType.toUpperCase().equals(typeToLoad.toUpperCase())) {
             	conArray.push(capContactArray[yy]);
            }
        }
        return conArray;
    }
    return null;
}

