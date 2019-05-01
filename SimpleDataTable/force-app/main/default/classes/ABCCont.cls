public inherited sharing class ABCCont {
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getDE(String a, List<String> b, String c) {
        return new Map<String, Object>{'d'=>'d','e'=>'e'};
    }
}
