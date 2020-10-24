public with sharing class DownloadAttachment {
	@AuraEnabled(cacheable=true)
	public static Map<String, Object> downloadAttachments(String recordId) {
		Map<String, Object> response = new Map<String, Object>();
		try {
			System.debug('This is the recordId that i retrieved: ' + recordId);
			Map<String, attachment> mapAttachments = new Map<String, Attachment>();
			List<Attachment> attachments = [SELECT ID, Name
											FROM Attachment
											WHERE ParentId =: recordId];
			System.debug('These are the Attachments  i retrieved: ' + JSON.serializePretty(attachments));
			if(attachments.size() > 0 ) {
				for(Attachment attachment : attachments) {
					mapAttachments.put(attachment.Id, attachment);
				}
				response.put('Attachments', mapAttachments);
			} else {
				response.put('Attachments', null);
			}
			response.put('error', false);
			return response;
		} catch (Exception e) {
			response.put('error', true);
			return response;
		}
	}

	@AuraEnabled(cacheable=true)
	public static Map<String, Object> downloadContentVersion(String recordId) {
		Map<String, Object> response = new Map<String, Object>();
		try {
			System.debug('This is the recordId that i retrieved: ' + recordId);
			Map<String, ContentVersion> mapVersions = new Map<String, ContentVersion>();
			List<ContentVersion> contentVersions = [SELECT ID, Title
													FROM ContentVersion
													WHERE FirstPublishLocationId =: recordId AND isLatest = true];
			System.debug('These are the content versions i retrieved: ' + JSON.serializePretty(contentVersions));
			if(contentVersions.size() > 0 ) {
				for(ContentVersion version : contentVersions) {
					mapVersions.put(version.Id, version);
				}
				response.put('Versions', mapVersions);
			} else {
				response.put('Versions', null);
			}
			response.put('error', false);
			return response;
		} catch (Exception e) {
			response.put('error', true);
			return response;
		}
	}
}
