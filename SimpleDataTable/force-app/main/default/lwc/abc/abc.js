import { LightningElement, wire, track, api } from 'lwc';
import getDE from '@salesforce/apex/ABCCont.getDE';
export default class Abc extends LightningElement {
    @api a;
    @api b;
    @api c;

    @wire(getDE, { a:this.a, b:this.b.split(','), c:this.c})
    deWired = {};

    @track d;
    @track e;
    @track error;
    connectedCallback() {
        getDE({ a:this.a, b:this.b.split(','),c:this.c}).then(result=>{
                this.d = result.d;
                this.e = result.e;
            }).catch(error => {
                this.error = error;
            });
    }
}