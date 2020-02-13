/**
 * Created by khaines on 7/15/2015.
 *
 */
Ext.define('Assign.view.census.edit.EditPatientViewController', {
    extend: 'Assign.controller.AbstractViewController',
    alias: 'controller.edit-patient-view-controller',

    views: [
        'Assign.view.census.edit.EditPatient'
    ],

    isClickedNo: false,
    refs: [
        {
            ref: 'editPatientWindow',
            selector: 'editPatientWindow'
        }
    ],

    init: function () {
        this.control({
            "editPatientWindow": {
                afterrender: this.onActivateEditPatient
            }
        });
    },

    onActivateEditPatient: function () {
        var me = this;

        me.enableDischargeDate();
        me.loadPointsOfCare();

        // Initialize the location combo to the correct location
        var patientLocation = me.getViewModel().get('currentLocation');
        var comboBox = me.getView().down('#pointOfCareField');
        comboBox.setValue(patientLocation);
    },

    /**
     * Call the server to add the Patient
     */
    onClickSave: function () {
        var me = this,
            view = me.getView(),
            viewModel = me.getViewModel();

        view.mask('Loading...');
        viewModel.set('manualAdd', true);

        var updatedRecord = viewModel.getData();
        var patientStore = viewModel.getStore('patientStore');

        // Update the record with the selected combo box location
        var comboBox = view.down('#pointOfCareField');
        updatedRecord.currentLocation = comboBox.value;

        // validate form data and create/update patient record
        if (Ext.String.trim(updatedRecord.firstName).length == 0 || Ext.String.trim(updatedRecord.lastName).length == 0
            || Ext.String.trim(updatedRecord.mrn).length == 0 ) {
            view.unmask();
            Ext.Msg.alert('Missing Required Fields', 'First Name, Last Name and MRN  must not be empty.');
        } else if (Ext.String.trim(updatedRecord.currentLocation).length == 0) {
            view.unmask();
            Ext.Msg.alert('Missing Required Field', 'Point Of Care must not be empty.');
        } else if (updatedRecord.patientid) {
            me.updatePatient(patientStore, updatedRecord);
        } else {
            me.createPatient(patientStore, updatedRecord);
        }
    },

    updatePatient: function (patientStore, updatedRecord) {
        var me = this,
            view = me.getView();

        var dischargeTime = view.down('#dischargeTimeField').value,
            admissionTime = view.down('#admissionTimeField').value,
            dischargeDateWithTime = me.getDateWithTime(updatedRecord.dischargeDate, dischargeTime),
            admissionDateWithTime = me.getDateWithTime(updatedRecord.admissionDate, admissionTime);

        if (dischargeDateWithTime && dischargeDateWithTime < admissionDateWithTime) {
            view.unmask();
            Ext.Msg.alert("Update Patient Error", "Discharge date cannot be prior to admission date.");
            return;
        }

        // Update the store with the updated values in the edit screen so the updated values get sent to the server
        var record = patientStore.findRecord('patientid', updatedRecord.patientid, 0, false, false, true);
        record.set('currentLocation', updatedRecord.currentLocation);
        record.set('room', updatedRecord.room);
        record.set('bed', updatedRecord.bed);
        record.set('dischargeDateString', dischargeDateWithTime);
        record.set('dischargeDate');
        record.set('dischargeTime');
        record.set('currentVisitNumber', updatedRecord.currentVisitNumber);
        record.set('censusSource', updatedRecord.censusSource);

        var patientsController = view.callingController;

        if (record.dirty) {
            patientStore.getProxy().setUrl(Assign.model.Utils.URL_PREFIX + '/assign/patients/' + updatedRecord.patientid + '/v1');
            patientStore.update({
                callback: function (records, operation, success) {
                    if (success) {
                        // Reload locations since they have been updated
                        if (view.createSchedule) {
                            patientsController.onScheduleExistingPatient(updatedRecord.patientid);
                        } else {
                            patientsController.onPatientUpdated(updatedRecord.patientid, records[0].data);
                        }

                        view.destroy();
                    } else {
                        patientStore.rejectChanges();
                        view.unmask();
                        if (operation.error.status !== 403 && operation.error.status !== -1) {
                            var errorMessage = "Error updating patient";
                            if (operation.error.response) {
                                errorMessage += ": " + operation.error.response.responseJson;
                            }
                            Ext.Msg.alert("Save Error", errorMessage);
                        }
                    }
                }
            });
        } else {
            if (view.createSchedule) {
                patientsController.onScheduleExistingPatient(updatedRecord.patientid);
            }

            view.destroy();
        }
    },

    // Get the date with time. If time is Null. Set the current time as time
    getDateWithTime: function (date, time) {
        var dateWithTime = "";
        if (date) {
            date = new Date(date);

            if (time == null) {
                time = new Date();
            }
            date.setHours(time.getHours());
            date.setMinutes(time.getMinutes());

            //Date time format is Y-m-d H:i
            dateWithTime = Ext.util.Format.date(date, 'Y-m-d Hi');
        }
        return dateWithTime;
    },

    //To discharge the patient immediately, if the current time >= discharge time
    isDischarge: function (dischargeDate) {
        //Date time format is Y-m-d H:i
        currentDate = Ext.util.Format.date(new Date(), 'Y-m-d H:i');
        if (dischargeDate && (currentDate >= dischargeDate)) {
            return true;
        }
        return false;
    },

    createPatient: function (patientStore, newPatient) {
        var me = this,
            view = me.getView(),
            dateOfBirth = newPatient.dateOfBirth;

        if (!dateOfBirth || null == dateOfBirth) {
            dateOfBirth = '';
        } else {
            dateOfBirth = Ext.Date.format(dateOfBirth, "Y-m-d");
        }

        patientStore.create(
            {
                firstName: newPatient.firstName,
                middleName: newPatient.middleName,
                lastName: newPatient.lastName,
                mrn: newPatient.mrn,
                gender: newPatient.gender,
                dateOfBirth: dateOfBirth,
                currentLocation: newPatient.currentLocation,
                manualAdd: newPatient.manualAdd,
                room: newPatient.room,
                bed: newPatient.bed,
                currentVisitNumber: newPatient.currentVisitNumber
            },
            {
                params: {addToCensus: view.addToCensus},
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
                            var response = operation.error.response;
                            var responseText = response.responseJson != null ? response.responseJson : response.responseText;
                            if (response.status == 400 && (responseText != null && responseText.includes("A patient with this MRN or demographics already exists"))) {
                                Ext.toast({
                                    html: responseText,
                                    align: 't',
                                    timeout: 3000
                                });
                                view.destroy();
                                return;
                            }
                            var errorMessage = "Error creating patient. " + responseText;

                            Ext.Msg.alert("Save Patient Error", errorMessage);
                        }
                    }
                }
            }
        );
    },

    loadPointsOfCare: function () {
        var me = this,
            viewModel = me.getViewModel(),
            view = me.getView(),
            pocStore = Ext.getStore('PointsOfCare');

        pocStore.load({
            params: {
                roundingOnly: false,
				includeInactive: false,
				includeOrphans: true
            },
            callback: function (records, operation, success) {
                if (me.isCurrentProductNurseAssign()) {
                    var isSameUnit = (Assign.getApplication().currentUnit.get('pointOfCareCode') === viewModel.get('currentLocation'));
                    if (!isSameUnit && view.callingController.isClickedNo) {
                        me.handlePocFields(false);
                    } else {
                        me.enableLocationFields();
                    }
                } else {
                    me.enableLocationFields();
                }

                if (!success && operation.error.status !== 403 && operation.error.status !== -1) {
                    Ext.Msg.alert("Retrieve Error", "Error retrieving points of care.");
                }
            }
        });
        pocStore.sort('shortName', 'ASC');
    },

    enableLocationFields: function () {
        var me = this,
            view = me.getView(),
            viewModel = me.getViewModel(),
            roomBedContainer = view.down('#roomBedContainer');

        // Disable location fields if editing a patient with a hospitalization
        if (viewModel.get('patientid')) {
            var pocField = view.down('#pointOfCareField'),
                roomField = view.down('#roomField'),
                bedField = view.down('#bedField');


            //Disable only if poc is valid
            if (me.isValidLocation(viewModel.get('currentLocation')) ) {
                pocField.disable();
            }

            if (viewModel.get('room') && viewModel.get('bed')) {
                roomField.disable();
                bedField.disable();
                roomBedContainer.labelEl.addCls('disabled');
            }
        } else {
            roomBedContainer.labelEl.removeCls('disabled');
        }
    },

    enableDischargeDate: function () { 
        var me = this,
            dischargeDateField = me.getView().down('#dischargeDateField');

        if (me.getViewModel().getData().patientid
                && (me.isCurrentUserCoordinator() || me.isCurrentUserCensusManager() || me.isCurrentUserChargeNurse)) {
            dischargeDateField.enable();

            //Enable the Discharge time field, if the discharge date is configured
            if (me.getViewModel().getData().dischargeDate) {
                me.getView().down('#dischargeTimeField').enable();
            }
        }
    },

     // Returns true if the location is a valid and active Location 
    isValidLocation: function (location) {
        var store = Ext.getStore('PointsOfCare'),
            poc = store.findRecord('pointOfCareCode', location, 0, false, false, true),
            isValid = false;

        if (poc && poc.get('roundingPointOfCare')) {
            isValid = true
        }
        return isValid;
    },

    //Enable or Disable the Discharge Time field based on the
    //Discharge date field
    onDischargeDateChange: function (field, value, eOpts) {
        var me = this;
        dischargeTimeField = me.getView().down('#dischargeTimeField');
        if (value && dischargeTimeField.isDisabled()) {
            dischargeTimeField.enable();
            if (dischargeTimeField.value == null || dischargeTimeField.value == "") {
                dischargeTimeField.setValue(new Date());
            }
        } else if (value == null) {
            dischargeTimeField.disable();
        }
    },

    isPatientOnTBA: function (records) {
        var record = records[0];
        if (record && record.getData() && record.getData().censusLevel) {
            return true;
        }
        return false;
    },

      handlePocFields: function (disable) {
        var me = this,
            view = me.getView(),
            roomBedContainer = view.down('#roomBedContainer'),
            pocField = view.down('#pointOfCareField'),
            roomField =view.down('#roomField'),
            bedField = view.down('#bedField');

        pocField.setDisabled(disable);
        roomField.setDisabled(disable);
        bedField.setDisabled(disable);

        if (disable) {
            roomBedContainer.labelEl.addCls('disabled');
        } else {
            roomBedContainer.labelEl.removeCls('disabled');
        }
    }
});
