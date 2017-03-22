/**
 * Created by matte on 21/03/2017.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'views/ProjectView',
    'models/Command'
],function ($, _, Backbone, joint, ProjectView,Command) {
    var AppView = Backbone.View.extend({
        el:$('#content'),
        op: {
                pv:{},
                ind:0
        },
        initialize: function () {
            this.op.pv= new ProjectView;

        },
        events: {
            'click #switch':	'switchgraph',
            'click #add':   'save',
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
            Command.execute("loadDiagram");
        }
});
    return AppView;
});