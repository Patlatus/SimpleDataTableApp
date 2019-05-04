import { LightningElement, track, api } from 'lwc';
import getColumnsAndData from '@salesforce/apex/SimpleDataTableController.getColumnsAndData';
export default class SimpleDataTableLWC extends LightningElement {
    @api sObjectName;
    @api sObjectFieldsNames;
    @api whereClause;

    @track data;
    @track columns;
    @track error;
    connectedCallback() {
        getColumnsAndData({ sObjectName:this.sObjectName, sObjectFieldsNames:this.sObjectFieldsNames.split(',')
            , whereClause: this.whereClause }).then(result=>{
                this.data = result.data;
                this.columns = result.columns;
            }).catch(error => {
                this.error = error;
            });
    }
    
    // Client-side controller called by the onsort event handler
    updateColumnSorting(e) {
        this.sortedBy = e.detail.fieldName;
        this.sortDirection = e.detail.sortDirection;
        this.sortData(e.detail.fieldName, e.detail.sortDirection);
    }

    sortData(fieldName, sortDirection) {
        var reverse = sortDirection !== 'asc';
        //sorts the rows based on the column header that's clicked
        var data = this.data;
        var primer = (data && data.length && data[0].Origin) ? (x, field)=>x.Origin[field] : null;
        data.sort(this.sortBy(fieldName, reverse, primer))
        this.data = JSON.parse(JSON.stringify(data)) ;
    }
    sortBy(field, reverse, primer) {
        var key = primer ?
            function(x) {return primer(x,field)} :
            function(x) {return x[field]};
        //checks if the two rows should switch places
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        }
    }
}