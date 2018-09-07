var isValid = validate();
if (isValid) {
	if (appTypeString == "Licenses/ABC/Internet Retailer/Application") {
		if (getAppSpecific("Beer") == "CHECKED") {
			if (getAppSpecific("Location of business") == "In state") {
				rules.action.refLPType = "Internet Beer Retailer - In State";
			} else if (getAppSpecific("Location of business") == "Out of state") {
				rules.action.refLPType = "Internet Beer Retailer - Out of State";
			}
		} else if (getAppSpecific("Wine") == "CHECKED") {
			if (getAppSpecific("Location of business") == "In state") {
				rules.action.refLPType = "Internet Wine Retailer - In State";
			} else if (getAppSpecific("Location of business") == "Out of state") {
				rules.action.refLPType = "Internet Wine Retailer - Out of State";
			}
		}
	}

	else if (appTypeString == "Licenses/ABC/Shipper/Application") {
		if (getAppSpecific("Location of business") == "In state") {
			rules.action.refLPType = "Shipper In State";
		} else if (getAppSpecific("Location of business") == "Out of state") {
			rules.action.refLPType = "Shipper Out of State";
		}
	}

	else if (appTypeString == "Licenses/Industry/Brewery/Application") {
		if (getAppSpecific("Brewery Application Type") == "Brewery" && getAppSpecific("Retail off premises") != "CHECKED") {
			rules.action.refLPType = "Brewery";
		} else if (getAppSpecific("Brewery Application Type") == "Limited Brewery" && getAppSpecific("Retail off premises") != "CHECKED") {
			rules.action.refLPType = "Limited Brewery";
		} else if (getAppSpecific("Brewery Application Type") == "Brewery" && getAppSpecific("Retail off premises") == "CHECKED") {
			rules.action.refLPType = "Retail Off-Premises Brewery";
		} else if (getAppSpecific("Brewery Application Type") == "Limited Brewery" && getAppSpecific("Retail off premises") == "CHECKED") {
			rules.action.refLPType = "Retail Off-Premises Limited Brewery";
		}
	}

	else if (appTypeString == "Licenses/Industry/Distillery/Application") {
		if (getAppSpecific("Distillery Application Type") == "Distillery") {
			rules.action.refLPType = "Distillery";
		} else if (getAppSpecific("Distillery Application Type") == "Fruit Distillery") {
			rules.action.refLPType = "Fruit Distillery";
		} else if (getAppSpecific("Distillery Application Type") == "Limited Distillery") {
			rules.action.refLPType = "Limited Distillery";
		}
	}

	else if (appTypeString == "Licenses/Industry/Farm Winery/Application") {
		rules.action.refLPType = getAppSpecific("Farm Winery Application Type");
	}

	else if (appTypeString == "Licenses/Industry/Importer/Application") {
		if (getAppSpecific("Importer Application Type") == "Importer" && getAppSpecific("Beer") == "CHECKED") {
			rules.action.refLPType = "Beer Importer";
		} else if (getAppSpecific("Importer Application Type") == "Importer" && getAppSpecific("Wine") == "CHECKED") {
			rules.action.refLPType = "Wine Importer";
		}
	}

	else if (appTypeString == "Licenses/Industry/Wholesaler/Application") {
		if (getAppSpecific("Wholesaler Application Type") == "Importer" && getAppSpecific("Beer") == "CHECKED") {
			rules.action.refLPType = "Beer Wholesaler";
		} else if (getAppSpecific("Wholesaler Application Type") == "Importer" && getAppSpecific("Wine") == "CHECKED") {
			rules.action.refLPType = "Wine Wholesaler";
		}
	}

	else if (appTypeString == "Licenses/Industry/Winery/Application") {
		if (getAppSpecific("Winery Application Type") == "Winery Application Type" && getAppSpecific("Retail off premises") != "CHECKED") {
			rules.action.refLPType = "Winery";
		} else if (getAppSpecific("Winery Application Type") == "Winery Application Type" && getAppSpecific("Retail off premises") == "CHECKED") {
			rules.action.refLPType = "Retail Off-Premises Winery";
		}
	}

	else if (appTypeString == "Licenses/Industry/Industry/Application") {
		rules.action.refLPType = getAppSpecific("Specialty Application Type");
	}

	else if (appTypeString == "Licenses/Retail/Annual Mixed Beverage/Application") {
		rules.action.refLPType = getAppSpecific("What is the type of business conducted at the establishment?");
	}

	else if (appTypeString == "Licenses/Retail/Carrier/Application") {
		if (getAppSpecific("What is the type of business conducted at the establishment?") == "Airplane"
				|| getAppSpecific("What is the type of business conducted at the establishment?") == "Boat"
				|| getAppSpecific("What is the type of business conducted at the establishment?") == "Train") {
			rules.action.refLPType = "Carrier";
		}
	}

	else if (appTypeString == "Licenses/Retail/Hotel/Application") {
		rules.action.refLPType = getAppSpecific("What is the type of business conducted at the establishment?");
	} else if (appTypeString == "Licenses/Retail/Private Club/Application") {
		rules.action.refLPType = getAppSpecific("What is the type of business conducted at the establishment?");
	} else if (appTypeString == "Licenses/Retail/Restaurant or Caterer/Application") {
		rules.action.refLPType = getAppSpecific("What is the type of business conducted at the establishment?");
	} else if (appTypeString == "Licenses/Retail/Retail/Application") {
		rules.action.refLPType = getAppSpecific("What is the type of business conducted at the establishment?");
	} else if (appTypeString == "Licenses/Permit/Out of State Delivery/Permit") {
		rules.action.refLPType = "Out of State Delivery";
	} else if (appTypeString == "Licenses/Permit/Grain Alcohol/Permit") {
		rules.action.refLPType = "Grain Alcohol";
	} else if (appTypeString == "Licenses/Permit/Operational Still/Permit") {
		rules.action.refLPType = "Operational Still";
	} else if (appTypeString == "Licenses/Permit/Solicitor Salesman/Permit") {
		rules.action.refLPType = "Solicitor Salesman";
	} else if (appTypeString == "Licenses/Permit/Solicitor Tasting/Permit") {
		rules.action.refLPType = "Solicitor Tasting";
	} else if (appTypeString == "Licenses/Permit/Transportation/Permit") {
		rules.action.refLPType = "Transportation";
	}

	else if (appTypeString == "Licenses/Permit/Common Carrier/Permit" || appTypeString == "Licenses/Permit/Continuance of Operation/Permit"
			|| appTypeString == "Licenses/Permit/Culinary/Permit" || appTypeString == "Licenses/Permit/Customs/Permit" || appTypeString == "Licenses/Permit/One Time Sale/Permit"
			|| appTypeString == "Licenses/Permit/Out of Bond/Permit" || appTypeString == "Licenses/Permit/Personal Import/Permit"
			|| appTypeString == "Licenses/Permit/Sacramental Wine/Permit" || appTypeString == "Licenses/Permit/Transport Industrial/Permit"
			|| appTypeString == "Licenses/Permit/Tour or Sightseeing/Permit" || appTypeString == "Licenses/Permit/Trustee/Permit") {
		rules.action.createLP = false;
	}
}

function validate() {
	if (balanceDue != 0) {
		cancelCfgExecution = true;
		return false;
	}

	var capConditions = null;
	var r = aa.capCondition.getCapConditions(capId);
	if (r.getSuccess()) {
		capConditions = r.getOutput();
	} else {
		logDebug("**INFO: failed getting cap conditions: " + r.getErrorMessage());
		return true;
	}

	if (capConditions != null && capConditions.length > 0) {
		for ( var i in capConditions) {
			var cond = capConditions[i];
			if (cond.getConditionOfApproval() == "Y") {
				if (cond.getConditionStatus() != "Met") {
					cancelCfgExecution = true;
					return false;
				}
			}
		}
	}

	return true;
}
