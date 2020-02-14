Ext.define('CrudUI.view.person.PersonListViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.person-list-view-controller',

    views: [
        'CrudUI.view.person.PersonListView'
    ],

    refs: [
        {
            ref: 'personList',
            selector: 'personList'
        }
    ],

    init: function () {
        this.control({
            "personList": {
                afterrender: this.onActivatePersonList
            }
        });
    },

    onActivatePersonList: function(){
        var me= this;
            view = me.getView(),
            viewModel = me.getViewModel()
            store = me.getStore('personStore');
            store.load();
          
        console.log("**********************************Person list activated");
    },

    onClickCreateNewPerson: function () {
        var me = this,
            editPersonWindow = Ext.create('CrudUI.view.person.edit.EditPersonView');
        
        editPersonWindow.setTitle('Create New Person');

        editPersonWindow.show();
    },

    onEditPatient: function (grid, td, cellIndex, record, tr, rowIndex, e) {
		 var me = this,
            editPersonWindow = Ext.create('CrudUI.view.person.edit.EditPersonView'),
            editPersonViewModel = editPersonWindow.getViewModel();
      
      
        // Load the patient data into the view and store for editing
        editPersonViewModel.setData(record.getData());
        editPersonViewModel.getStore('personStore').add(record.getData());
        editPatientWindow.setTitle('Edit Patient');
       
        // Display the edit patient window and give focus to the location field
        editPatientWindow.show();
	},

    // onDeletePatient: function(){
    //      Ext.Ajax.request(
    //                 {
    //                     url: Assign.model.Utils.URL_PREFIX + '/assign/nurse/acuitytool/' + record.get('acuityToolId') + '/v1',
    //                     method: 'DELETE',
    //                     success: function() {
    //                         me.onAcuityToolPanelActivate();
    //                     },
    //                     failure: function() {
    //                         Ext.Msg.alert('Delete Error', 'Error deleting Acuity Tool');
    //                     }
    //                 }
    //             );
    // }
    //  {
    //                             xtype: 'gridcolumn',
    //                             text: 'Active',
    //                             dataIndex: 'active',
    //                             flex: 7 / 100,
    //                             sortable: true,
    //                             renderer: function(value, metaData, record, rowIndex, colIndex){
    //                                 me.setTdCls(metaData, rowIndex, colIndex, "Active");

    //                                 return value === true ? "Yes" : "No";
    //                             }
    //                         }

    // {
    //                             xtype: 'actioncolumn',
    //                             align: 'center',
    //                             flex: 11 / 100,
    //                             items:  [
    //                                 {
    //                                     handler: 'onUnlockUser',
    //                                     getClass: function(value, metadata, record) {
    //                                         var locked = record.get('locked');
    //                                         return locked ? 'lockedButton' : 'hidden';
    //                                     },
    //                                     getTip: function(value, metadata, record) {
    //                                         var locked = record.get('locked');
    //                                         return locked ? 'Account locked, click to unlock' : '';
    //                                     }
    //                                 },
    //                                 {
    //                                     iconCls : 'editButton',
    //                                     tooltip: 'Edit',
    //                                     handler: 'onEditUser'
    //                                 }
    //                             ],
    //                             renderer: function(value, metaData, record, rowIndex, colIndex){
    //                                 me.setTdCls(metaData, rowIndex, colIndex, "Action");

    //                                 return value;
    //                             }
    //                         }

    // onEditUser: function(model, selectedIndex) {
    //     var me = this,
    //         selectedRecord = me.getViewModel().getStore('users').getAt(selectedIndex),
    //         editUserWindow = Ext.create('Assign.view.configuration.user.edit.EditUser'),
    //         password = editUserWindow.down('#passwordField');

    //     editUserWindow.isAddUser = false;
    //     password.allowBlank = true;

    //     // Load the user data into the view and store for editing
    //     editUserWindow.getViewModel().setData(selectedRecord.getData());
    //     editUserWindow.getViewModel().getStore('user').add(selectedRecord.getData());
    //     editUserWindow.setTitle('Edit ' + selectedRecord.get('username'));
    //     editUserWindow.show();
    // },
});
