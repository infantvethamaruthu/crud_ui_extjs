Ext.define('CrudUI.view.person.PersonListView', {
    extend: 'Ext.grid.Panel',
    xtype: 'personList',

    requires: [
        'CrudUI.store.Person'
    ],

    title: 'Person',

    store: {
        type: 'Person'
    },

     tbar: [
        {
            xtype: 'button',
            itemId: 'createPersonBtn',
            text: 'Create New Person',
            listeners: {
                click: 'onClickCreateNewPatient'
            }
        }
     ], 
    columns: [
        { text: 'First Name',  dataIndex: 'name' },
        { text: 'Last Name', dataIndex: 'email', flex: 1 },
        { text: 'Age', dataIndex: 'age', flex: 1 }
    ],

    listeners: {
        select: 'onItemSelected'
    }
});