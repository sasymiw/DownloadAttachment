import { LightningElement, api, track } from "lwc";
import downloadAttachments from '@salesforce/apex/DownloadAttachment.downloadAttachments';
import downloadContentVersion from '@salesforce/apex/DownloadAttachment.downloadContentVersion';

const columnsForAttachment = [
	{ label: 'Name', fieldName: 'Name' },
	{ label: 'Id', fieldName: 'Id', type: 'String' },
	{ label: 'CretedDate', fieldName: 'Createddate', type: 'date' },
];

const columnsForVersion = [
	{ label: 'Label', fieldName: 'name' },
	{ label: 'IsLatest', fieldName: 'website', type: 'url' },
	{ label: 'CretedDate', fieldName: 'Createddate', type: 'date' },
];

export default class DownloadAttachment extends LightningElement {
	@api recordId;
	@track resultsAttachments;
	@track resultsContentDocument;
	@track error;
	@track isModalOpen = false;
	@track dataForAttachment = [];
	@track columnsForAttachment = columnsForAttachment;
	@track dataForVersion = [];
	@track columnsForVersion = columnsForVersion;


	openModal() {
		// to open modal set isModalOpen tarck value as true
		this.isModalOpen = true;
	}
	closeModal() {
		// to close modal set isModalOpen tarck value as false
		this.isModalOpen = false;
	}
	submitDetails() {
		// to close modal set isModalOpen tarck value as false
		//Add your code to call apex method or do some processing
		this.isModalOpen = false;
	}
	connectedCallback() {
		console.log('Entered in download attachments method');
		console.log('Record id retrieved : ' + this.recordId);
		downloadAttachments({ recordId: this.recordId })
			.then((result) => {
				if (result !== undefined) {
					if (result.Attachments != null && result.Attachments !== undefined) {
						var attachmentList = [];
						result.Attachments.forEach(element => {
							var attachment = {};
							attachment.Id = element.Id;
							attachment.Name = element.Name;
							attachmentList.push(attachment);
						});
						this.dataForAttachment = attachmentList;
					}
				}
			})
			.catch((error) => {
				this.error = error;
			});
		console.log('Ended download attachments  method');
	}

	downloadContentDocuments() {
		console.log('Entered in download versions method');
		downloadContentVersion({ recordId: this.recordId })
			.then((result) => {
				this.resultsContentDocument = result;
			})
			.catch((error) => {
				this.error = error;
			});
		console.log('Ended download versions  method');
	}
}
