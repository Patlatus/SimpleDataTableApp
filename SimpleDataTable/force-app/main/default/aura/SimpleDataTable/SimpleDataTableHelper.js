({
    callActionAsPromise : function(component, helper, actionName, params) {
        return new Promise($A.getCallback(function(resolve, reject) {
            let action = component.get(actionName);
            action.setParams(params);
            action.setCallback(helper, function(actionResult) {
                if (actionResult.getState() === 'SUCCESS') {
                    resolve({'c':component, 'h':helper, 'r':actionResult.getReturnValue()});
                } else {
                    let errors = actionResult.getError();
                    reject(new Error(errors && Array.isArray(errors) && errors.length === 1
                        ? errors[0].message : JSON.stringify(errors))
                    );
                }
            });
            $A.enqueueAction(action);
        }));
    },
    
    sortData: function (cmp, fieldName, sortDirection) {
        var data = cmp.get("v.data");
        var reverse = sortDirection !== 'asc';
        //sorts the rows based on the column header that's clicked
        var primer = (data && data.length && data[0].Origin) ? (x, field)=>x.Origin[field] : null;
        data.sort(this.sortBy(fieldName, reverse, primer))
        cmp.set("v.data", data);
    },
    sortBy: function (field, reverse, primer) {
        var key = primer ?
            function(x) {return primer(x, field)} :
            function(x) {return x[field]};
        //checks if the two rows should switch places
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    }
})