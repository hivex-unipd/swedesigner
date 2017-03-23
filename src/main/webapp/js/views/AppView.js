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
    'views/detailsview'
],function ($, _, Backbone, joint, ProjectView,Command, DetailsView) {
    var AppView = Backbone.View.extend({
        el:$('#navbar'),
        op: {
                pv:{},
                dv:{},
                ind:0
        },
        initialize: function () {
            this.op.pv = ProjectView;
            this.op.dv = new DetailsView;

        },
        events: {
            'click #switch':	'switchgraph',
            'click #savefile':   'save',
            'change #files': 'load'
        },
        switchgraph:function () {
            if(this.op.ind==0){
                this.op.pv.switch(1);
                this.op.ind=1;
            }
            else{
                this.op.pv.switch(0);
                this.op.ind=0;
            }
        },
        save: function (event) {

            Command.execute("saveDiagram");
        },
        load:function (event) {
            Command.execute("loadDiagram",event);
        }
});
    return AppView;
});
