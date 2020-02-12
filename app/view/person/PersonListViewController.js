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
    }
});
