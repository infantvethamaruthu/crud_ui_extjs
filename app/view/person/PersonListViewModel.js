Ext.define('CrudUI.view.person.PersonListViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.person-list-view-model',

    stores: {
        personListStore: {
            model: 'CrudUI.model.Person',

            proxy: {
                type: 'ajax',
                url: 'http://localhost:8080/person/load',
                useDefaultXhrHeader: false,
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