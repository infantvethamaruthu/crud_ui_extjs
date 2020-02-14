Ext.define('CrudUI.model.Person', {
    extend: 'CrudUI.model.Base',
    
    idProperty: 'personid',

    fields: [
        'firstName', 'lastName', 'age',
        {name: 'personid', mapping: 'id', persist: false},
    ]
});
