define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'views/ProjectView',
    'models/Command',
    'views/detailsview',
    'views/newcellview'
], function ($, _, Backbone, joint, ProjectView, Command, DetailsView, NewCellView) {

    /**
     * @classdesc `AppView` is the the main view of the front end.
     * It manages the main graphical interface, calling the other
     * sub-views (`ProjectView`, `DetailsView`, `NewCellView`)
     * and setting up the calls to the `Command` object.
     *
     * @module client.view
     * @name AppView
     * @class AppView
     * @extends {Backbone.View}
     */
    var AppView = Backbone.View.extend({

        /**
         * The navigation bar.
         * @name AppView#el
         * @type {jQuery}
         */
        el: $('#all'),

        /**
         * Links each page view to an appropriate object
         * and declares the variable `index` for indexing them.
         * @name AppView#views
         * @type {Object}
         */
        views: {
            project: {},
            details: {},
            newCell: {},
            index: 0
        },

        /**
         * Initializes the views dictionary with the three sub-views
         * (`ProjectView`, `DetailsView`, `NewCellView`).
         * @name AppView#initialize
         * @function
         */
        initialize: function () {
            this.views.project = ProjectView;
            this.views.details = new DetailsView;
            this.views.newCell = new NewCellView;
            this.listenTo(this.views.project, 'Switchgraph', this.toggleVisib);
        },

        /**
         * The page events, each one linked to the desired action.
         * @name AppView#events
         * @type {Object}
         */
        events: {
            'click #switchtoclass': 'switchToClass',
            'click #switch': 'switchGraph',
            'click .savefile': 'save',
            'change .files': 'load',
            'click .generate': 'generate',
            'click .newproj':'newProject',
            'click #extendedtheme':'themeExtended',
            'click #compacttheme':'themeCompact'
        },

        /**
         * Toggles the visibility of the 'Back to Class
         * Diagram' button.
         * @name AppView#toggleVisib
         * @function
         */
        toggleVisib: function () {
            $('#switchtoclass').toggle();
        },
        /**
         * Change the css to the extended style one
         * @name AppView#themeExtended
         * @function
         */
        themeExtended:function () {
            $('#pagetheme').attr('href',"assets/style.css");
        },
        /**
         * Change the css to the compact style one
         * @name AppView#themeCompact
         * @function
         */
        themeCompact:function () {
            $('#pagetheme').attr('href',"assets/style2.css");
        },

        /**
         * Shows the class diagram.
         * @name AppView#switchToClass
         * @function
         */
        switchToClass: function (e) {
            this.views.project.switch('class');

            $('#elementstab')[0].click();
        },

        /**
         * Switches between different diagram elements.
         * @name AppView#switchGraph
         * @function
         */
        switchGraph: function () {
            if (this.views.index == 0) {
                this.views.project.switch(1);
                this.views.index = 1;
            } else {
                this.views.project.switch(0);
                this.views.index = 0;
            }
        },

        /**
         * Creates a new project from scratch.
         * @name AppView#newProject
         * @function
         */
        newProject: function () {
            if ($('#switchtoclass').css('display') == 'block') {
                $('#switchtoclass')[0].click();
            }
            Command.execute('newProject');
        },

        /**
         * Saves the entire project diagram to a JSON file
         * and gives it back to the user.
         * @name AppView#save
         * @function
         * @param {event} event the action event
         */
        save: function (event) {
            Command.execute('saveProject');
        },

        /**
         * Loads an entire project from a JSON file
         * uploaded by the user.
         * @name AppView#load
         * @function
         * @param {event} event the action event
         */
        load: function (event) {
            if ($('#switchtoclass').css('display') == 'block') {
                $('#switchtoclass')[0].click();
            }
            Command.execute('loadProject', event);
        },

        /**
         * Sends a request to the server for generating
         * an executable from the user diagrams.
         * @name AppView#generate
         * @function
         * @param {event} event the action event
         */
        generate: function (event) {
            Command.execute('sendDiagram');
            return false;
        }
    });
    return AppView;
});
