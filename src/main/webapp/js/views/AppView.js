/**
 * Created by matte on 21/03/2017.
 */
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
    var AppView = Backbone.View.extend({
        el: $('#navbar'),
        views: {
            project: {},
            details: {},
            newCell: {},
            index: 0
        },
        initialize: function () {
            this.views.project = ProjectView;
            this.views.details = new DetailsView;
            this.views.newCell = new NewCellView;
        },
        events: {
            'click #switch': 'switchgraph',
            'click #savefile': 'save',
            'change #files': 'load'
        },
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
        save: function (event) {
            Command.execute("saveDiagram");
        },
        load: function (event) {
            Command.execute("loadDiagram", event);
        }
    });
    return AppView;
});
