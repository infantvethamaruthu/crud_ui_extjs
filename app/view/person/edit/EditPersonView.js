Ext.define('CrudUI.view.person.edit.EditPersonView', {
    extend: 'Ext.window.Window',

    xtype: 'editPersonWindow',

    requires: [
        'CrudUI.view.person.edit.EditPersonViewModel',
        'CrudUI.view.person.edit.EditPersonViewController'
    ],

    controller: 'edit-person-view-controller',

    viewModel: {
        type: 'edit-person-view-model'
    },

    width: 400,
    buttonAlign: 'center',
    modal: true,
    draggable: false,
    resizable: false,
    overflowY: 'auto',
    padding: '10px',

    items: [
        {
            xtype: 'form',
            layout: 'hbox',
            items: [
                {
                    xtype: 'panel',
                    defaultType: 'textfield',
                    items: [
                        {
                            itemId: 'fNameField',
                            fieldLabel: 'First Name',
                            bind: '{firstName}',
                            allowOnlyWhitespace: false,
                            maxLength: 50,
                        },
                        {
                            itemId: 'lNameField',
                            fieldLabel: 'Last Name',
                            bind: '{lastName}',
                            allowOnlyWhitespace: false,
                            maxLength: 50
                        },
                        {
                            itemId: 'ageField',
                            fieldLabel: 'Age',
                            bind: '{age}',
                            allowOnlyWhitespace: false,
                            maxLength: 50
                        }
                    ]
                }
            ],
            buttons: [
                {
                    text: 'Save',
                    disabled: true,
                    formBind: true,
                    listeners: {
                    click: 'onClickSave'
                    }
                },
                {
                    text: 'Cancel',
                    listeners: {
                    // closeView is a helper inherited from Ext.app.ViewController
                    click: 'closeView'
                    }
                }
            ]
        }
    ]

});