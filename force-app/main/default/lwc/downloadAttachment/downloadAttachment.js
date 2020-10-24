import { LightningElement, api, track } from "lwc";
import downloadAttachments from '@salesforce/apex/DownloadAttachment.downloadAttachments';
import downloadContentVersion from '@salesforce/apex/DownloadAttachment.downloadContentVersion';

import JSZip from '@salesforce/resourceUrl/JSZip';

const columnsForAttachment = [
	{ label: 'Name', fieldName: 'Name' },
	{ label: 'Id', fieldName: 'Id', type: 'String' }
];

const columnsForVersion = [
	{ label: 'Title', fieldName: 'Title' },
	{ label: 'Id', fieldName: 'Id' }
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
	@track selectedAttachments = [];
	@track selectedVersions = [];

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
				try {
					if (result !== undefined) {
						if (result.Attachments != null && result.Attachments !== undefined) {
							var attachmentList = [];
							for (const key in result.Attachments) {
								var attachment = {};
								console.log('result.Attachments[key].Id : ' + result.Attachments[key].Id);
								attachment.Id = result.Attachments[key].Id;
								console.log('result.Attachments[key].Name : ' + result.Attachments[key].Name);
								attachment.Name = result.Attachments[key].Name;
								attachmentList.push(attachment);
							}
							this.dataForAttachment = attachmentList;
							console.log('This is the data for attachment:' + JSON.stringify(this.dataForAttachment));
						}
					}
				} catch (e) {
					console.log('This is the error first catch: ' + e);
				}
			})
			.catch((error) => {
				this.error = error;
				console.log('This is the error:' + error);
			});
		downloadContentVersion({ recordId: this.recordId })
			.then((result) => {
				try {
					if (result !== undefined) {
						if (result.Versions != null && result.Versions !== undefined) {
							var versionList = [];
							for (const key in result.Versions) {
								var version = {};
								console.log('result.Versions[key].Id : ' + result.Versions[key].Id);
								version.Id = result.Versions[key].Id;
								console.log('result.Versions[key].Name : ' + result.Versions[key].Title);
								version.Title = result.Versions[key].Title;
								versionList.push(version);
							}
							this.dataForVersion = versionList;
							console.log('This is the data for version:' + JSON.stringify(this.dataForVersion));
						}
					}
				} catch (e) {
					console.log('This is the error first catch: ' + e);
				}
			})
			.catch((error) => {
				this.error = error;
				console.log('This is the error:' + error);
			});
		console.log('Ended download documents method');
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

	getSelectedNameAttachments(event) {
		const selectedRows = event.detail.selectedRows;
		// Display that fieldName of the selected rows
		var selectedAttachmentsList = [];
		for (let i = 0; i < selectedRows.length; i++) {
			selectedAttachmentsList.push(selectedRows[i]);
		}
		this.selectedAttachments = null;
		this.selectedAttachments = selectedAttachmentsList;
		console.log('Selected attachments list: ' + this.selectedAttachments);
		console.log('Selected attachments list length: ' + this.selectedAttachments.length);
	}

	getSelectedNameVersions(event) {
		const selectedRows = event.detail.selectedRows;
		// Display that fieldName of the selected rows
		var selectedVersionsList = [];
		for (let i = 0; i < selectedRows.length; i++) {
			selectedVersionsList.push(selectedRows[i]);
		}
		this.selectedVersions = null;
		this.selectedVersions = selectedVersionsList;
		console.log('Selected versions list: ' + this.selectedVersions);
		console.log('Selected versions list length: ' + this.selectedVersions.length);
	}

	downloadAttachmentasZip() {
		if (this.selectedAttachments.length > 0) {
			var url = '=';
			for (let i = 0; i < this.selectedAttachments.length; i++) {
				url += this.selectedAttachments[i].Id + '/';
			}
			url = url.substring(0, url.length - 1);
			url += '?';
			fetch('https://sm-org-2-dev-ed.my.salesforce.com/servlet/servlet.FileDownload?file=00P5I000007KNTeUAO')
				.then((resp) => resp.json()) // Transform the data into json
				.then(function (data) {
					console.log('This is the data : ' + data);
				})
		}
	}

	downloadContentVersionsAsZip() {
		(async () => {
			try {
				if (this.selectedVersions.length > 0) {
					var url = '/';
					for (let i = 0; i < this.selectedVersions.length; i++) {
						url += this.selectedVersions[i].Id + '/';
					}
					url = url.substring(0, url.length - 1);
					url += '?';
					console.log('updated code');
					let blob = await fetch("https://sm-org-2-dev-ed.lightning.force.com/sfc/servlet.shepherd/version/download/0685I000002u0wNQAQ").then(r => r.blob());
					console.log('This is the type of blob : ' + typeof blob.name);
					//download("data: text / html, HelloWorld", "helloWorld.txt");
					//window.open('https://sm-org-2-dev-ed.lightning.force.com/sfc/servlet.shepherd/version/download/' + url)
				}
			} catch (error) {
				console.log('Entered in error');
			} finally {
				console.log('Entered in finally');
			}
		})();
	}

	download(url, filename) {
		fetch(url).then(function (t) {
			return t.blob().then((b) => {
				var a = document.createElement("a");
				a.href = URL.createObjectURL(b);
				a.setAttribute("download", filename);
				a.click();
			}
			);
		});
	}
	onClickDownload() {
		var zip = new JSZip();
		zip = new JSZip();
		zip.file("Hello.", "hello.txt");
		zip.generateAsync({ type: "base64" })
			.then(function (base64) {
				Downloadify.create('downloadify', {
					data: function () {
						return base64;
					},
					dataType: 'base64'
				});
			})
	}
}