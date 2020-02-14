/**
 * Created by khaines on 7/15/2015.
 *
 */
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

        view.mask('Loading...');
        //viewModel.set('manualAdd', true);

        var updatedRecord = viewModel.getData();
        var personStore = viewModel.getStore('personStore');

        // validate form data and create/update patient record
        if (Ext.String.trim(updatedRecord.firstName).length == 0 || Ext.String.trim(updatedRecord.lastName).length == 0
            || Ext.String.trim(updatedRecord.mrn).length == 0) {
            view.unmask();
            Ext.Msg.alert('Missing Required Fields', 'First Name, Last Name and MRN  must not be empty.');
        } else if (updatedRecord.personid) {
            me.updatePerson(personStore, updatedRecord);
        } else {
            me.createPerson(personStore, updatedRecord);
        }
    },

    updatePerson: function (personStore, updatedRecord) {
        var me = this,
            view = me.getView();

        // Update the store with the updated values in the edit screen so the updated values get sent to the server
        var record = personStore.findRecord('patientid', updatedRecord.patientid, 0, false, false, true);
        record.set('firstName', updatedRecord.firstName);
        record.set('LastName', updatedRecord.LastName);
        record.set('age', updatedRecord.age);

        if (record.dirty) {
            //TODO
            //personStore.getProxy().setUrl(Assign.model.Utils.URL_PREFIX + '/assign/patients/' + updatedRecord.patientid + '/v1');
            personStore.update({
                callback: function (records, operation, success) {
                    if (success) {
                        //Load All Paients
                        view.destroy();
                    } else {
                        personStore.rejectChanges();
                        view.unmask();
                        if (operation.error.status !== 403 && operation.error.status !== -1) {
                            var errorMessage = "Error updating Person";
                            if (operation.error.response) {
                                errorMessage += ": " + operation.error.response.responseJson;
                            }
                            Ext.Msg.alert("Save Error", errorMessage);
                        }
                    }
                }
            });
        } else {
            view.destroy();
        }
    },

    createPerson: function (personStore, newPerson) {
        var me = this,
            view = me.getView();

        personStore.create(
            {
                firstName: newPerson.firstName,
                lastName: newPerson.lastName,
                age: newPatient.age
            },
            {
                callback: function (records, operation, success) {
                    if (success) {
                        var createdPatient = records[0].data,
                            unit = Assign.getApplication().currentUnit,
                            callingController = view.callingController,
                            unitName = unit ? unit.get('pointOfCareCode') : null;

                        // Do not add the patient to the census store if it is for nurse and patient belongs to different unit
                        if (me.isCurrentProductPhysicianAssign() || createdPatient.currentLocation === unitName) {
                            callingController.onPatientCreated(createdPatient);
                        }

                        view.destroy();
                    } else {
                        patientStore.rejectChanges();
                        view.unmask();
                        if (operation.error.status !== 403 && operation.error.status !== -1) {
                            //var response = operation.error.response;
                            //var responseText = response.responseJson != null ? response.responseJson : response.responseText;

                            view.destroy();
                            Ext.Msg.alert("Save Person Error", errorMessage);
                        }
                    }
                }
            }
        );
    }
});
