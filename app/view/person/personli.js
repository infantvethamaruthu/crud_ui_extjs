/**
 * The panel for displaying available Patients.  Patients
 * may be removed and/or added to the list of Patients.
 *
 * Created by khaines on 7/7/2015.
 */
Ext.define('Assign.view.census.physician.PhysicianCensus', {
    extend: 'Ext.Panel',

    requires: [
        'Ext.grid.Panel',
        'Assign.view.census.physician.PhysicianCensusViewModel',
        'Assign.view.census.physician.PhysicianCensusViewController'
    ],

    xtype: 'censusPanel',
    cls: 'patient-census',

    layout: 'fit',

    controller: 'census-view-controller',

    viewModel: {
        type: 'census-view-model'
    },

    displayAvailability: true,

    tbar: [
        {
            xtype: 'resettextfield',
            itemId: 'searchPatientsBox',
            cls: 'patientCensusSearchBox',
            width: '210px',
            emptyText: 'Search',
            listeners: {
                change: 'filterPatients'
            }
        },
        {
            xtype: 'checkboxfield',
            itemId: 'onCheckBox',
            boxLabel: 'On Census',
            cls: 'patientCensusOnChkBox',
            listeners: {
                change: 'filterPatients'
            }
        },
        {
            xtype: 'checkboxfield',
            itemId: 'offCheckBox',
            boxLabel: 'Off Census',
            cls: 'patientCensusOffChkBox',
            listeners: {
                change: 'filterPatients'
            }
        },
        {
            xtype: 'checkboxfield',
            itemId: 'assignedCheckBox',
            boxLabel: 'Assigned',
            cls: 'patientCensusAssignedChkBox',
            listeners: {
                change: 'filterPatients'
            }
        },
        '->',
        {
            xtype: 'panel',
            items: [
                {
                    xtype: 'button',
                    itemId: 'regenerateCensusBtn',
                    cls: 'patientCensusReGenerateCensus',
                    text: 'Refresh Census',
                    margin: '0 5 0 0',
                    listeners: {
                        click: function () {
                            var controller = this.up('censusPanel').getController();
                            return controller.onRefreshCensus();
                        }
                    }
                },
                {
                    xtype: 'button',
                    itemId: 'manualAddPatientBtn',
                    cls: 'patientCensusManualAdd',
                    text: 'Create New Patient',
                    margin: '0 5 0 0',
                    listeners: {
                        click: 'onClickCreateNewPatient'
                    }
                },
                {
                    xtype: 'button',
                    itemId: 'downloadCensusBtn',
                    cls: 'patientCensusDownload',
                    text: 'Download',
                    margin: '0 5 0 0',
                    listeners: {
                        click: 'onClickDownloadCensus'
                    }
                },
                {
                    xtype: 'button',
                    itemId: 'availButton',
                    cls: 'patientCensusAvailButton',
                    text: 'Availability &raquo;',
                    listeners: {
                        click: 'onProviderAvailability'
                    }
                }
            ]
        }
    ],

    items: [
        {
            xtype: 'gridpanel',
            itemId: 'patientsGrid',
            bind: '{availablePatientsStore}',
            enableColumnMove: false,
            enableColumnResize: false,
            enableColumnHide: true,
            cls: 'patients-grid',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            viewConfig: {
                markDirty: false,
                loadMask: false,
                emptyText: 'No patients on census',
                trackOver: false,
                stripeRows: false,
                selectedItemCls: 'none',
                getRowClass: function (record, index, rowParams, store) {
                    var cls = "patientCensusRow" + index,
                    censusLevel = record.get('censusLevel');

                    if(!censusLevel || censusLevel === 'OFF') {
                        cls += " off-patient-row";
                    }

                    return cls;
                }
            },
            columns: [
                {
                    xtype: 'gridcolumn',
                    text: 'Admit',
                    dataIndex: 'admissionDateTime',
                    hideable: false,
                    flex: 8 / 100,
                    sortable: true,
                    componentCls:'censusAdmitDateHeader',
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        var tdCls = "patientCensusAdmitDate ",
                            admissionDate = Ext.Date.parse(record.get('admissionDateString'), "Y-m-d Hi");
                            val = '';

                        tdCls += "patientCensus" + rowIndex + "_" + colIndex;
                        metaData.tdCls = tdCls;

                        if (admissionDate) {
                            val = Ext.Date.format(admissionDate, "m/d/y").toString() + '<br/>' + record.get('admissionTime');
                        }

                        return val;
                    } 
                },
                {
                    xtype: 'gridcolumn',
                    text: 'Source',
                    dataIndex: 'creationSource',
                    hideable: false,
                    flex: 8 / 100,
                    sortable: true,
                    componentCls: 'creationSource',
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        var tdCls = "creationSource patientCensus" + rowIndex + "_" + colIndex;
                        metaData.tdCls = tdCls;

                        return value;
                    }
                },
                {
                    xtype: 'gridcolumn',
                    text: 'Indicator',
                    dataIndex: 'indicatorDisplay',
                    hideable: false,
                    flex: 10 / 100,
                    sortable: true,
                    componentCls:'censusStatusHeader',
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        var tdCls = "patientCensusStatus ",
                            censusLevel = record.get('censusLevel');

                        tdCls += "patientCensus" + rowIndex + "_" + colIndex;

                        if(!censusLevel || censusLevel === 'OFF') {
                            tdCls += " off-patient-row";
                        }

                        metaData.tdCls = tdCls;

                        return value;
                    }
                },
                {
                    xtype: 'gridcolumn',
                    text: 'Attribute',
                    dataIndex: 'patientAttributeDefinitionIds',
                    itemId: 'attributeColumn',
                    hideable: false,
                    flex: 10 / 100,
                    sortable: true,
                    componentCls:'attributeHeader',
                    renderer: 'attributeRenderer'
                },
                {
                    xtype: 'actioncolumn',
                    text: 'POC',
                    dataIndex: 'pocShortName',
                    hideable: false,
                    flex: 7 / 100,
                    sortable: true,
                    componentCls:'censusPOCHeader',
                    items: [
                        {
                            // Method called when user clicks the 'Attention' button
                            handler: 'onEditPatientLocation',

                            // Display the 'Attention' button if the Location
                            // for the current row is invalid and needs attention
                            getClass: function (value, metadata, record) {
                                var controller = this.up('censusPanel').getController();
                                var validLocation = controller.isValidLocation(record.get('currentLocation'));
                                return validLocation ? 'hidden' : 'attention-button-small-right';
                            },

                            // Provide a tooltip for the Attention button
                            getTip: function (value, metadata, record) {
                                var controller = this.up('censusPanel').getController();
                                var validLocation = controller.isValidLocation(record.get('currentLocation'));
                                return validLocation ? '' : 'This point of care is unmatched to a location.';
                            }
                        }
                    ],
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        var tdCls = "patientCensusPOC ",
                            censusLevel = record.get('censusLevel');

                        tdCls += "patientCensus" + rowIndex + "_" + colIndex;

                        var valueCls = 'x-grid-cell x-grid-item';
                        if(!censusLevel || censusLevel === 'OFF') {
                            valueCls += " off-patient-row";
                        }

                        metaData.tdCls = tdCls;
                        return '<span class="' + valueCls + '" style="display: inline-block; background-color: transparent; border: none; padding-left: 5px;">'  + value + '</span>';
                    },
                    sort: function(state) {
                        var me = this;
                        var store = me.up('tablepanel').store;
                        var direction = (state != undefined) ? state : (me.sortState === 'ASC' ? 'DESC' : 'ASC');

                        Ext.suspendLayouts();
                        me.sorting = true;

                        store.sort([
                            {
                                property: 'pocShortName',
                                direction: direction
                            },
                            {
                                property: 'room',
                                direction: direction
                            },
                            {
                                property: 'bed',
                                direction: direction
                            }
                        ]);

                        delete me.sorting;
                        Ext.resumeLayouts(true);
                    }
                },
                {
                    xtype: 'gridcolumn',
                    text: 'Rm/Bed',
                    dataIndex: 'roomBed',
                    hideable: false,
                    flex: 8 / 100,
                    sortable: true,
                    componentCls:'censusRoomBedHeader',
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        var tdCls = "patientCensusRm/Bed ";
                        tdCls += "patientCensus" + rowIndex + "_" + colIndex;
                        metaData.tdCls = tdCls;
                        return value;
                    }
                },
                {
                    xtype: 'gridcolumn',
                    text: 'Patient',
                    dataIndex: 'displayNameWithMiddleName',
                    hideable: false,
                    flex: 19 / 100,
                    sortable: true,
                    componentCls:'censusPatientNameHeader',
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        var tdCls = "patientCensusPatient ";
                        tdCls += "patientCensus" + rowIndex + "_" + colIndex;
                        metaData.tdCls = tdCls;
                        metaData.style = "cursor: pointer";

                        var patientDisplay = '';
                        return patientDisplay.concat('<span class="linkbutton"><b>', record.get('displayNameWithMiddleName'), '</b></span><br/>',
                            record.get('gender'), ' ', record.get('ageDisplay'), '&nbsp;&nbsp;&nbsp;&nbsp;', record.get('mrn'), '<br/>', record.get('birthDate'));
                    }
                },
                {
                    xtype: 'gridcolumn',
                    text: 'Attending',
                    dataIndex: 'attendingDisplayName',
                    groupAttribute : 'provider',
                    flex: 14 / 100,
                    sortable: true,
                    componentCls:'censusAttendingHeader',
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        var attendingProvider = record.get('attendingProvider'),
                            tdCls = "patientCensusAttending ";

                        tdCls += "patientCensus" + rowIndex + "_" + colIndex;
                        metaData.tdCls = tdCls;
                        metaData.style = "cursor: pointer";

                        if (attendingProvider && attendingProvider.groups.length > 0) {
                            for (var i = 0; i < attendingProvider.groups.length; i++) {
                                var group = attendingProvider.groups[i];
                                if (group.name === 'Hospitalist') {
                                    value = '<b>' + value + '</b>';
                                    break;
                                }
                            }
                        }

                        return value;
                    }
                },
                {
                    xtype: 'gridcolumn',
                    text: 'Admitting',
                    dataIndex: 'admittingDisplayName',
                    groupAttribute : 'provider',
                    flex: 14 / 100,
                    sortable: true,
                    componentCls:'censusAdmittingHeader',
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        var admittingProvider = record.get('admittingProvider'),
                            tdCls = "patientCensusAdmitting ";

                        tdCls += "patientCensus" + rowIndex + "_" + colIndex;
                        metaData.tdCls = tdCls;

                        if (admittingProvider && admittingProvider.groups.length > 0) {
                            for (var i = 0; i < admittingProvider.groups.length; i++) {
                                var group = admittingProvider.groups[i];
                                if (group.name === 'Hospitalist') {
                                    value = '<b>' + value + '</b>';
                                    break;
                                }
                            }
                        }

                        return value;
                    }
                },
                {
                    xtype: 'gridcolumn',
                    text: 'Consulting',
                    dataIndex: 'roundingConsultingDisplay',
                    groupAttribute : 'provider',
                    flex: 14 / 100,
                    sortable: true,
                    componentCls:'censusConsultingHeader',
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        var consultingProviders = record.get('consultingProviders'),
                            tdCls = "patientCensusConsulting ";

                        tdCls += "patientCensus" + rowIndex + "_" + colIndex;
                        metaData.tdCls = tdCls;
                        metaData.style = "cursor: pointer";

                        var tooltipValue = '',
                            numAdded = 0;
                        if (consultingProviders && consultingProviders.length > 0) {
                            for (var i = 0; i < consultingProviders.length; i++) {
                                var consultingProvider = consultingProviders[i];
                                if (consultingProvider && consultingProvider.roundingProvider) {
                                    if (numAdded > 0) {
                                        tooltipValue += '<br/>';
                                    }
                                    tooltipValue += consultingProvider.displayName;

                                    numAdded++;
                                }
                            }
                        }
                        metaData.tdAttr = "data-qtip='" + tooltipValue + "'";

                        return value;
                    }
                },
                {
                    xtype: 'gridcolumn',
                    text:'Assign',
                    align: 'center',
                    flex: 8 / 100,
                    dataIndex: 'censusAssign',
                    sortable: true,
                    componentCls:'censusAddRmvHeader',
                    renderer: function (value, metaData, rec, rowIndex, colIndex) {
                        metaData.tdCls = "censusAddRemove patientCensus" + rowIndex + "_" + colIndex;
                        metaData.style = "cursor: pointer";

                        var text = rec.get('censusLevel') == 'ON' ? 'Yes' : 'No',
                            display = '<span class="linkbutton">' + text + '</span>';

                        return display;
                    }
                }
            ],
            listeners: {
                cellclick: 'onClickGridCell', 
                beforerender: 'loadCustomAttribute'
            }
        }
    ]
});
