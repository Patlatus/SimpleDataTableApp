import { LightningElement, track, api, wire } from 'lwc';
import getColumnsAndData from '@salesforce/apex/SimpleDataTableController.getColumnsAndData';
import {copy} from 'c/copy';

export default class SimpleDataTableWiredProperty extends LightningElement {
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

    @wire(getColumnsAndData, {
        sObjectName: '$sObjectName', sObjectFieldsNames: '$sObjectFieldsNames'
        , whereClause: '$whereClause'
    })
    columnsAndData;

    // Client-side controller called by the onsort event handler
    updateColumnSorting(e) {
        e.srcElement.sortedBy = e.detail.fieldName;
        e.srcElement.sortedDirection = e.detail.sortDirection;//  !== 'asc' ? 'asc' : 'desc';
        //this.sortedBy = e.detail.fieldName;
        //this.sortDirection = e.detail.sortDirection;
        this.sortData(e.srcElement, e.detail.fieldName, e.detail.sortDirection);
    }

    sortData(src, fieldName, sortDirection) {
        var reverse = sortDirection !== 'asc';
        //sorts the rows based on the column header that's clicked
        var data = copy(src.data);
        var primer = (data && data.length && data[0].Origin) ? (x, field) => x.Origin[field] : null;
        data.sort(this.sortBy(fieldName, reverse, primer))
        src.data = data;
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