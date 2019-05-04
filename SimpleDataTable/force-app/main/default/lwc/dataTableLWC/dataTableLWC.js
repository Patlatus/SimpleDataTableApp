import { api } from 'lwc';
import getColumnsAndData from '@salesforce/apex/DataTableController.getColumnsAndData';
import SimpleDataTableLWC from 'c/simpleDataTableLWC';
export default class DataTableLWC extends SimpleDataTableLWC {
    @api overrides;
    @api valueModifiers;

    connectedCallback() {
        getColumnsAndData({ sObjectName:this.sObjectName, sObjectFieldsNames:this.sObjectFieldsNames.split(',')
            , whereClause: this.whereClause, overrides: JSON.parse(this.overrides.replace(/'/g, '"'))
            , valueModifiers: JSON.parse(this.valueModifiers.replace(/'/g, '"')) })
        .then(result=>{
            this.data = result.data;
            this.columns = result.columns;
        }).catch(error => {
            this.error = error;
        });
    }
}