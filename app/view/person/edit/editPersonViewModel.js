/**
 * Created by khaines on 7/15/2015.
 */
Ext.define('Assign.view.census.edit.EditPatientViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.edit-patient-view-model',

    stores: {
        patientStore: {
            model: 'Assign.model.Patient',

            proxy: {
                type: 'ajax',
                url: Assign.model.Utils.URL_PREFIX + '/assign/patients/v1',
                actionMethods: {
                    create: 'POST',
                    read: 'GET',
                    update: 'PUT',
                    destroy: 'DELETE'
                },
                reader: {
                    type: 'json',
                    rootProperty: ''
                },
                writer: {
                    nameProperty: 'mapping'
                }
            }
        }
    }
});