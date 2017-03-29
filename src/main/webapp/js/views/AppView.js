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
     * @classdesc AppView is the the main view of the front end.
     * It manages the main graphical interface,
     * calling the other sub-views (ProjectView, DetailsView, NewCellView)
     * and setting up the calls to Command.
     * 
     * @name AppView
     * @class AppView
     */
    var AppView = Backbone.View.extend({

        /**
         * The navigation bar.
         * @name AppView#el
         * @type {jQuery}
         */
        el: $('#navbar'),

        /**
         * Links each page view to an appropriate object
         * and declares a variable for indexing them.
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
         * (ProjectView, DetailsView, NewCellView).
         * @name AppView#initialize
         * @function
         */
        initialize: function () {
            this.views.project = ProjectView;
            this.views.details = new DetailsView;
            this.views.newCell = new NewCellView;
        },

        /**
         * Links the page events to the desired actions.
         * @name AppView#events
         * @type {Object}
         */
        events: {
            'click #switch': 'switchgraph',
            'click #savefile': 'save',
            'change #files': 'load'
        },

        /**
         * Switches between different diagram elements.
         * @name AppView#switchgraph
         * @function
         */
        switchgraph: function () {
            if (this.views.index == 0) {
                this.views.project.switch(1);
                this.views.index = 1;
            }
            else {
                this.views.project.switch(0);
                this.views.index = 0;
            }
        },

        /**
         * Saves the entire project diagram to a JSON file
         * and gives it to the user.
         * @name AppView#save
         * @function
         * @param {event} event the action event
         */
        save: function (event) {
            Command.execute("saveDiagram");
        },

        /**
         * Loads an entire project from a JSON file
         * uploaded by the user.
         * @name AppView#load
         * @function
         * @param {event} event the action event
         */
        load: function (event) {
            Command.execute("loadDiagram", event);
        }
    });
    return AppView;
});
