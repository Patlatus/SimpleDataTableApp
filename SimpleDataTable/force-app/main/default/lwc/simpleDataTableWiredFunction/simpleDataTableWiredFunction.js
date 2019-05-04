import { LightningElement, track, api, wire } from 'lwc';

import getColumnsAndData from '@salesforce/apex/SimpleDataTableController.getColumnsAndData';
import {copy} from 'c/copy';
export default class SimpleDataTableWiredFunction extends LightningElement {
    @api sObjectName;
    @track sObjectFieldsNamesArray;
    get sObjectFieldsNames() {
        return this.sObjectFieldsNamesArray;
    }
    @api
    set sObjectFieldsNames(value) {
        this.sObjectFieldsNamesArray = value.split(',');
     }
    @api whereClause;

    @track data;
    @track columns;
    @track error;

    @wire(getColumnsAndData, {
        sObjectName: '$sObjectName', sObjectFieldsNames: '$sObjectFieldsNames'
        , whereClause: '$whereClause'
    })
    wiredGet({ error, data }) {
        if (data) {
            this.data = data.data;
            this.columns = data.columns;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = null;
            this.columns = null;
        }
    }

    // Client-side controller called by the onsort event handler
    updateColumnSorting(e) {
        e.srcElement.sortedBy = e.detail.fieldName;
        e.srcElement.sortedDirection = e.detail.sortDirection;//  !== 'asc' ? 'asc' : 'desc';
        //this.sortedBy = e.detail.fieldName;
        //this.sortDirection = e.detail.sortDirection;
        this.sortData(e.detail.fieldName, e.detail.sortDirection);
    }

    sortData(fieldName, sortDirection) {
        var reverse = sortDirection !== 'asc';
        //sorts the rows based on the column header that's clicked
        var data = copy(this.data);
        var primer = (data && data.length && data[0].Origin) ? (x, field) => x.Origin[field] : null;
        data.sort(this.sortBy(fieldName, reverse, primer))
        this.data = data;
    }
    sortBy(field, reverse, primer) {
        var key = primer ?
            function (x) { return primer(x, field) } :
            function (x) { return x[field] };
        //checks if the two rows should switch places
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        }
    }
}