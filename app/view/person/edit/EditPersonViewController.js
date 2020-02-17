Ext.define('CrudUI.view.person.edit.EditPersonViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.edit-person-view-controller',

    views: [
        'CrudUI.view.person.edit.EditPersonView'
    ],

    refs: [
        {
            ref: 'editPersonWindow',
            selector: 'editPersonWindow'
        }
    ],

    init: function () {
        this.control({
            "editPersonWindow": {
                afterrender: this.onActivateEditPerson
            }
        });
    },

    onActivateEditPerson: function () {
        var me = this;

        //TODO Load All person
        console.log("Edit Person view activated");
    },

    /**
     * Call the server to add the Person
     */
    onClickSave: function () {
        var me = this,
            view = me.getView(),
            viewModel = me.getViewModel();

        var updatedRecord = viewModel.getData();
        var personStore = viewModel.getStore('personStore');

        // validate form data and create/update patient record
        if (Ext.String.trim(updatedRecord.firstName).length == 0) {
            Ext.Msg.alert('Missing Required Fields', 'First Name must not be empty.');
        } else if (updatedRecord.personid) {
            me.updatePerson(personStore, updatedRecord);
        } else {
            me.createPerson(personStore, updatedRecord);
        }
    },

    updatePerson: function (personStore, updatedRecord) {
        var me = this,
            view = me.getView(),
            personList = Ext.ComponentQuery.query('personList')[0],
            personListStore = personList.getStore('personListStore'),
            record = personListStore.findRecord('personid', updatedRecord.personid, 0, false, false, true);

        record.set('firstName', updatedRecord.firstName);
        record.set('lastName', updatedRecord.lastName);
        record.set('age', updatedRecord.age);

        if (record.dirty) {
            Ext.Ajax.request(
                {
                    url: "http://localhost:8080/person/update",
                    method: 'PUT',
                    jsonData: record.data,
                    useDefaultXhrHeader: false,
                    cors: true,
                    success: function() {
                        me.loadPersonList();
                        view.destroy();
                    },
                    failure: function() {
                        Ext.Msg.alert('Save Error', 'Error updating person');
                    }
                }
            );
        } else {
            view.destroy();
        }
    },

    createPerson: function (personStore, newPerson) {
        var me = this,
            view = me.getView();
        personStore.getProxy().setUrl("http://localhost:8080/person/create");
        personStore.create(
            {
                firstName: newPerson.firstName,
                lastName: newPerson.lastName,
                age: newPerson.age
            },
            {
                callback: function (records, operation, success) {
                    if (success) {
                        me.loadPersonList();

                        console.log("Successfully created a person");
                        view.destroy();
                    } else {
                        patientStore.rejectChanges();
                        // view.unmask();
                        if (operation.error.status !== 403 && operation.error.status !== -1) {
                            view.destroy();
                            Ext.Msg.alert("Save Person Error");
                        }
                    }
                }
            }
        );
    },

    loadPersonList: function () {
        var personList = Ext.ComponentQuery.query('personList')[0];
        personList.getStore('personListStore').load();
    }
});

