/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'CrudUI.Application',

    name: 'CrudUI',

    requires: [
        // This will automatically load all classes in the CrudUI namespace
        // so that application classes do not need to require each other.
        'CrudUI.*'
    ],

    // The name of the initial view to create.
    mainView: 'CrudUI.view.main.Main'
});
