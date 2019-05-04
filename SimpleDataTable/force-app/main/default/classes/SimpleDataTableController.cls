/**
 * Created by Bohdan Dovhan on 1/26/2018.
 */
public inherited sharing virtual class SimpleDataTableController  {
    protected virtual Map<String, Map<String, Object>> getColumnsMap(
        String sObjectName, List<String> sObjectFieldsNames
    ) {
        Map<String, Schema.SObjectField> m = SchemaProvider.getFieldMap(sObjectName);
        Map<String, Map<String, Object>> columnsMap = new Map<String, Map<String, Object>>();
        for ( String fieldName: sObjectFieldsNames ) {
            Schema.DescribeFieldResult dfr = m.get( fieldName ).getDescribe();
            Map<String, Object> column = new Map<String, Object>{
                'label' => dfr.getLabel(),
                'fieldName' => dfr.getName(),
                'type' => String.valueOf( dfr.getType() ).toLowerCase(),
                'sortable'=>true
            };
            columnsMap.put( fieldName, column );
        }
        return columnsMap;
    }
    protected virtual List<SObject> query(String sObjectName, List<String> sObjectFieldsNames, String whereClause) {
        String query = 'SELECT ' + String.join( sObjectFieldsNames, ', ') + ' FROM ' + sObjectName;
        if (!String.isBlank(whereClause)) {
            query += ' WHERE ' + whereClause;
        }
        return Database.query( query );
    }
    public virtual Map<String, Object> getColumnsData(
        String sObjectName, List<String> sObjectFieldsNames, String whereClause
    ) {
        return new Map<String, Object>{
            'columns' => getColumnsMap(sObjectName, sObjectFieldsNames).values(),
            'data' => query(sObjectName, sObjectFieldsNames, whereClause)
        };
    }
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getColumnsAndData(
        String sObjectName, List<String> sObjectFieldsNames, String whereClause
    ) {
        try{
            return new SimpleDataTableController().getColumnsData(sObjectName, sObjectFieldsNames, whereClause);
        } catch(Exception e) {
            throw AuraUtils.buildAuraHandledException(e);
        }
    }
}