/**
 * Created by matte on 21/03/2017.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'models/ProjectModel',
    'models/celltypes/celltypes'
], function ($, _, Backbone, joint, ProjectModel) {

    var ProjectView = Backbone.View.extend({
        det: {},
        paper: {},
        initialize: function () {
            this.model = ProjectModel;//new ProjectModel();
            this.paper = new joint.dia.Paper({
                el: $('#paper'),
                model: this.model.graph,
                width: 1500,
                height: 1000,
                gridSize: 6,
                drawGrid: true,
                elementView: joint.shapes.uml.ClassDiagramElementView,

                linkView: joint.dia.LinkView.extend({
                    pointerdblclick: function (evt, x, y) {
                        if (V(evt.target).hasClass('connection') || V(evt.target).hasClass('connection-wrap')) {
                            this.addVertex({x: x, y: y});
                        }
                    },
                    pointerclick: function (evt, x, y) {
                        console.log("you clicked a link");
                        // codice per dire a detailsview che è cambiato qualcosa
                    }
                }),

                selectedCell: null,

                interactive: function (cellView) {
                    if (cellView.model instanceof joint.dia.Link) {
                        // Disable the default vertex add functionality on pointerdown.
                        return {vertexAdd: false};
                    }
                    return true;
                },


            });

            // per qualche satanica ragione cell:pointerclick non funziona
            /// e pointerup funziona. FML.

            this.paper.on('cell:pointerup', function (cellView, evt, x, y) {
                this.selectedCell = cellView.model;
                console.log(cellView.model.getClassName());
                this.trigger("changed-cell");
            });
            this.paper.on('blank:pointerdown', function (evt, x, y) {
                console.log(evt);
               console.log(x,y);
            });

            this.model.addInitialsCells();


        },
        switch: function (index, selectedCell) {
            this.model.switchToGraph(index, selectedCell);
            this.trigger("Switchgraph");
        }
    });
    return new ProjectView;
});
