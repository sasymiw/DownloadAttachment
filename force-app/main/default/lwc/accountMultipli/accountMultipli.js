import { LightningElement, track, wire, api } from "lwc";
// importing Apex Class
import retrieveAccountContactRelationshipRecords from "@salesforce/apex/AccountMultipli.retrieveAccountContactRelationshipRecords";

// Datatable Columns
const columns = [
	{
		label: "Account Name",
		fieldName: "AccountName",
		type: "text"
	},
	{
		label: "Shipping Address",
		fieldName: "ShippingAddress",
		type: "text"
	}
];

export default class ReferenceDataInLwcDatatable extends LightningElement {
	@track data = [];
	@track columns = columns;
	@api recordId;
	@wire(retrieveAccountContactRelationshipRecords)
	opp({ error, data }) {
		console.log("Record id")
		console.log('This is the data : ' + data);
		if (data) {
			let currentData = [];
			data.forEach((row) => {
				let rowData = {};
				// Account related data
				if (row.Account) {
					rowData.AccountName = row.Account.Name;
					if (row.Account.ShippingStreet) {
						rowData.ShippingAddress = row.Account.ShippingStreet
					}
					if (row.Account.ShippingCity) {
						rowData.ShippingAddress += ', ' + row.Account.ShippingCity
					}
					if (row.Account.ShippingState) {
						rowData.ShippingAddress += ', ' + row.Account.ShippingState
					}
					if (row.Account.ShippingPostalCode) {
						rowData.ShippingAddress += ', ' + row.Account.ShippingPostalCode
					}
				}
				// Owner releated data
				currentData.push(rowData);
			});

			this.data = currentData;
		} else if (error) {
			window.console.log(error);
		}
	}
}