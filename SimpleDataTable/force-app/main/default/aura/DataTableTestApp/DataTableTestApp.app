<aura:application extends="force.slds" >
    <c:dataTableLWC sObjectName="Contact"
                 sObjectFieldsNames="FirstName,LastName,BirthDate,HireDate__c,Branch__c,Position__c,Email,Phone"
                 whereClause="RecordType.Name = 'Employee'"
                 overrides="{'FirstName':{'type':'url','typeAttributes':{'label':{ 'fieldName': 'Origin.FirstName' },'tooltip':{ 'fieldName': 'Origin.FirstName' },'title':{ 'fieldName': 'Origin.FirstName' }}}}"
                 valueModifiers="{'Origin.FirstName':'{FirstName}', 'FirstName':'/{Id}'}"
    />
    <c:FakeOpportunityData/>
</aura:application>