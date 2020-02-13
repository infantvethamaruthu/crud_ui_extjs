/**
 * This view is an example list of people.
 */
Ext.define('CrudUI.view.main.List', {
    extend: 'Ext.grid.Panel',
    xtype: 'mainlist',

    requires: [
        'CrudUI.store.Person'
    ],

    title: 'Person',

    store: {
        type: 'Person'
    },

    columns: [
        { text: 'First Name',  dataIndex: 'name' },
        { text: 'Last Name', dataIndex: 'email', flex: 1 },
        { text: 'Age', dataIndex: 'age', flex: 1 }
    ],

    listeners: {
        select: 'onItemSelected'
    }
});
