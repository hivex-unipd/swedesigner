/**
 * Created by matte on 21/03/2017.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'models/ProjectModel'
],function ($, _, Backbone, joint, ProjectModel) {

    var ProjectView = Backbone.View.extend({
        paper:{},
        initialize: function(){
            this.model = ProjectModel;//new ProjectModel();
            this.paper = new joint.dia.Paper({
                el:$('#paper'),
                model : this.model.graph,
                width: 1500,
                height: 1000,
                gridSize: 6,
                drawGrid: true
            });
            this.model.addInitialsCells();


        },
        switch:function (index) {
            this.model.switchToGraph(index);
        }
    });
    return ProjectView;
});