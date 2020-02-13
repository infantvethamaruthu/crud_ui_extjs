

Ext.define('CrudUI.view.person.edit.EditPerson', {
    extend: 'Ext.window.Window',

    xtype: 'editPatientWindow',

    requires: [
        'Assign.view.census.edit.EditPatientViewModel',
        'Assign.view.census.edit.EditPatientViewController'
    ],

    controller: 'edit-patient-view-controller',

    viewModel: {
        type: 'edit-patient-view-model'
    },

    createSchedule: null,
    addToCensus: true,   //created patient should be added to the census (Nurse ignores this on server side)
    callingController: null,    //controller that instantiated this view

    width: 400,
    height: 475,
    minHeight: 475,
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
                            cls: "patientConfig0",
                            fieldCls: "patientConfig0input",
                            labelClsExtra: "patientConfig0label"
                        },
                        {
                            itemId: 'mNameField',
                            fieldLabel: 'Middle Name',
                            bind: '{middleName}',
                            maxLength: 20,
                            cls: "patientConfig1",
                            fieldCls: "patientConfig1input",
                            labelClsExtra: "patientConfig1label"
                        },
                        {
                            itemId: 'lNameField',
                            fieldLabel: 'Last Name',
                            bind: '{lastName}',
                            allowOnlyWhitespace: false,
                            maxLength: 50,
                            cls: "patientConfig2",
                            fieldCls: "patientConfig2input",
                            labelClsExtra: "patientConfig2label"
                        },
                        {
                            itemId: 'mrnField',
                            fieldLabel: 'MRN',
                            bind: '{mrn}',
                            allowOnlyWhitespace: false,
                            maxLength: 50,
                            cls: "patientConfig3",
                            fieldCls: "patientConfig3input",
                            labelClsExtra: "patientConfig3label"
                        },
                        {
                            itemId: 'dobField',
                            xtype: 'datefield',
                            fieldLabel: 'DOB',
                            bind: '{dateOfBirth}',
                            minValue: '1/1/1900',
                            maxValue: new Date(),
                            cls: "patientConfig4",
                            fieldCls: "patientConfig4input",
                            labelClsExtra: "patientConfig4label"
                        },
                        {
                            itemId: 'genderBox',
                            xtype: 'combobox',
                            fieldLabel: 'Gender',
                            editable: false,
                            store: new Ext.data.SimpleStore({
                                data: [['', '(no selection)'],
                                ['M', 'Male'],
                                ['F', 'Female']],
                                fields: ['value', 'text']
                            }),
                            valueField: 'value',
                            displayField: 'text',
                            bind: '{gender}',
                            cls: "patientConfig5",
                            fieldCls: "patientConfig5input",
                            labelClsExtra: "patientConfig5label"
                        },
                        {
                            xtype: 'combobox',
                            itemId: 'pointOfCareField',
                            fieldLabel: 'Point of Care',
                            store: 'PointsOfCare',
                            emptyText: 'Select a point of care',
                            bind: '{code}',
                            queryMode: 'local',
                            displayField: 'shortName',
                            valueField: 'pointOfCareCode',
                            forceSelection: true,           // restrict the selected value to one of the values in the list
                            allowBlank: false,              // forces validation to require combo have a valid value
                            editable: false,               // prevents user from entering text into the combo
                            cls: "patientConfig6",
                            fieldCls: "patientConfig6input",
                            labelClsExtra: "patientConfig6label"
                        },
                        {
                            xtype: 'fieldcontainer',
                            itemId: 'roomBedContainer',
                            layout: 'hbox',
                            fieldLabel: 'Room-Bed',
                            defaultType: 'textfield',
                            items: [
                                {
                                    itemId: 'roomField',
                                    bind: '{room}',
                                    maxLength: 10,
                                    width: 85,
                                    margin: '0 10px 0 0',
                                    fieldCls: 'patientConfig7Room'
                                },
                                {
                                    itemId: 'bedField',
                                    bind: '{bed}',
                                    maxLength: 8,
                                    width: 75,
                                    fieldCls: 'patientConfig7Bed'
                                }
                            ],
                            cls: "patientConfig7",
                            labelClsExtra: "patientConfiglabel"
                        },
                        {
                            itemId: 'visitIdField',
                            fieldLabel: 'Visit ID',
                            bind: '{currentVisitNumber}',
                            allowOnlyWhitespace: false,
                            maxLength: 50,
                            cls: "patientConfig8",
                            fieldCls: "patientConfig8input",
                            labelClsExtra: "patientConfig8label"
                        },
                        {
                            itemId: 'admitDateField',
                            fieldLabel: 'Admit Date',
                            maxLength: '50',
                            disabled: true,
                            bind: '{admissionDate}',
                            cls: "patientConfig9",
                            fieldCls: "patientConfig9input",
                            labelClsExtra: "patientConfig9label"
                        },
                        {
                            itemId: 'admissionTimeField',
                            xtype: 'timefield',
                            fieldLabel: 'Admit Time',
                            disabled: true,
                            minValue: '0:00 AM',
                            maxValue: '23:00 PM',
                            increment: 1,
                            bind: '{admissionTime}',
                            cls: "patientConfig10",
                            fieldCls: "patientConfig10input",
                            labelClsExtra: "patientConfig10label",
                        },
                        {
                            itemId: 'dischargeDateField',
                            xtype: 'datefield',
                            fieldLabel: 'Discharge Date',
                            disabled: true,
                            bind: '{dischargeDate}',
                            minValue: '1/1/2015',
                            maxValue: new Date(),
                            listeners :{
                                change: 'onDischargeDateChange'
                            },
                            cls: "patientConfig11",
                            fieldCls: "patientConfig11input",
                            labelClsExtra: "patientConfig11label",

                        },
                        {
                            itemId: 'dischargeTimeField',
                            xtype: 'timefield',
                            fieldLabel: 'Discharge Time',
                            disabled: true,
                            minValue: '0:00 AM',
                            maxValue: '23:00 PM',
                            increment: 1,
                            bind: '{dischargeTime}',
                            cls: "patientConfig12",
                            fieldCls: "patientConfig12input",
                            labelClsExtra: "patientConfig12label",
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
                    },
                    cls: "addEditPatSaveBtn"
                },
                {
                    text: 'Cancel',
                    listeners: {
                        // closeView is a helper inherited from Ext.app.ViewController
                        click: 'closeView'
                    },
                    cls: "addEditPatCancelBtn"
                }
            ]
        }
    ],

});
