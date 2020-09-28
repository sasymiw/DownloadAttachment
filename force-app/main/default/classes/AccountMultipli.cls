public inherited sharing class AccountMultipli {    
	@AuraEnabled(cacheable=true)
	public static List<AccountContactRelation> retrieveAccountContactRelationshipRecords() {
		//System.debug('This is the record id : ' + recordId);
		return [SELECT Id, Account.Name,  Account.ShippingStreet, Account.ShippingCity, Account.ShippingState, Account.ShippingPostalCode FROM AccountContactRelation WHERE ContactId = '0035I000004LDloQAG'];
	}
}