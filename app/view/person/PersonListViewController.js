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
            store = me.getStore('personListStore');
            store.load();
    },

    onClickCreateNewPerson: function () {
        var me = this,
            editPersonWindow = Ext.create('CrudUI.view.person.edit.EditPersonView');
        
        editPersonWindow.setTitle('Create New Person');

        editPersonWindow.show();
    },

    onDeletePerson: function(grid, rowIndex, colIndex){
        var me = this,
            personListStore = me.getViewModel().getStore('personListStore'),
            selectedRecord = personListStore.getAt(rowIndex);

            Ext.Ajax.request(
                {
                    url: "http://localhost:8080/person/delete/"+selectedRecord.data.personid,
                    method: 'DELETE',
                    success: function() {
                        personListStore.load();
                    },
                    failure: function() {
                        Ext.Msg.alert('Delete Error', 'Error deleting person');
                    }
                });            
    },

    onEditPerson: function(grid, rowIndex, colIndex) {
        var me = this,
            selectedRecord = me.getViewModel().getStore('personListStore').getAt(rowIndex),
            editPersonWindow = Ext.create('CrudUI.view.person.edit.EditPersonView'),
            editPersonViewModel = editPersonWindow.getViewModel();
           
        // Load the patient data into the view and store for editing
        editPersonViewModel.setData(selectedRecord.getData());
        editPersonWindow.setTitle('Edit Person');
       
        // Display the edit patient window and give focus to the location field
        editPersonWindow.show();
    }    
});
