Ext.define('CrudUI.view.person.edit.EditPersonViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.edit-person-view-model',

    stores: {
        personStore: {
            model: 'CrudUI.model.Person',

            proxy: {
                type: 'ajax',
                url: 'http://localhost:8080/person/',
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