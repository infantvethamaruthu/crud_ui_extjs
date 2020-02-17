Ext.define('CrudUI.view.person.PersonListView', {
    extend: 'Ext.grid.Panel',
    xtype: 'personList',

    requires: [
        'Ext.grid.Panel',
        'CrudUI.view.person.PersonListViewController',
        'CrudUI.view.person.PersonListViewModel'
    ],

    title: 'Person',

    controller: 'person-list-view-controller',

    viewModel: {
        type: 'person-list-view-model'
    },

    bind: '{personListStore}',
    tbar: [
        {
            xtype: 'button',
            itemId: 'createPersonBtn',
            text: 'Create New Person',
            cls: 'background-color: lightgrey',
            listeners: {
                click: 'onClickCreateNewPerson'
            }
        }
    ],
    columns: [
        { text: 'First Name', dataIndex: 'firstName', flex: 1 },
        { text: 'Last Name', dataIndex: 'lastName', flex: 1 },
        { text: 'Age', dataIndex: 'age', flex: 1 },
        {
            xtype: 'actioncolumn',
            align: 'center',
            items: [
                {
                    iconCls: 'x-fa fa-edit',
                    tooltip: 'Edit',
                    handler: 'onEditPerson'
                }
            ]
        },
        {
            xtype: 'actioncolumn',
            align: 'center',
            items: [
                {
                    iconCls: 'x-fa fa-trash',
                    tooltip: 'Delete',
                    handler: 'onDeletePerson'
                }
            ]
        }
    ]
});