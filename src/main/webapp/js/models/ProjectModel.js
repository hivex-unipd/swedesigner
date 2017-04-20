/**
 * Created by matte on 21/03/2017.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'models/celltypes/celltypes'
], function ($, _, Backbone, joint, celltypes) {

    var ProjectModel = Backbone.Model.extend({

        graph: {},

        urlRoot: '/generate',

        options: {
            currentindex: "class",
            currentgraph: {},
            graphs: {
                classes: {
                    classesArray: [],
                    relationshipsArray: []
                },
                methods: []
            }
        },
        initialize: function () {

            this.graph = new joint.dia.Graph({}, {cellNamespace: Swedesigner.client.model.celltypes});
        },
        deleteCell: function (cell) {
            if (cell.getValues().hasOwnProperty("methods")) {
                for (var met in cell.getValues().methods) {
                    this.deleteMethodDiagram(cell.getValues().methods[met].id);
                }
            }
            this.graph.removeCells([cell]);
            this.trigger('addcell');
        },
        addCell: function (cell) {
            _.each(this.graph.get("cells").models, function (el) {
                el.set("z", 1);
            });

            this.graph.addCell(cell);
            this.trigger('addcell', cell);

        },

        switchToGraph: function (id) {
            this.saveCurrentDiagram();
            if (id == "class") {
                this.options.currentindex = id;
                this.graph.resetCells(this.options.graphs.classes.classesArray.concat(this.options.graphs.classes.relationshipsArray));
            }
            else {
                var index = this.getIndexFromId(id);
                this.options.currentindex = id;
                if (index != -1) {
                    this.graph.resetCells(this.options.graphs.methods[index].cells);
                }
                else {
                    this.graph.resetCells([]);
                }
            }


        },
        saveCurrentDiagram: function () {
            if (this.options.currentindex == "class") {
                this.options.graphs.classes.classesArray = (this.graph.getElements());
                this.options.graphs.classes.relationshipsArray = (this.graph.getLinks());
            }
            else {
                var index = this.getIndexFromId(this.options.currentindex);
                if (index != -1) {
                    this.options.graphs.methods[index].cells = this.graph.getCells();
                }
                else {
                    this.options.graphs.methods.push({
                        id: this.options.currentindex,
                        cells: this.graph.getCells()
                    });
                }
            }
        },
        saveProject: function () {
            this.saveCurrentDiagram();
            return JSON.stringify(this.options.graphs);
        },
        loadProject: function (diag) {
            this.options.graphs = JSON.parse(diag);
            this.options.currentindex = "class";
            this.graph.resetCells(this.options.graphs.classes.classesArray.concat(this.options.graphs.classes.relationshipsArray));
            this.trigger("renderActivity");

        },
        getIndexFromId: function (id) {
            return this.options.graphs.methods.findIndex((x) => x.id == id);
        },
        getClassVisibleElements: function (cell) {
            var elems = [];
            for (var attr in cell.getValues().attributes) {
                elems.push(
                    {
                        label: cell.getValues().attributes[attr].name + ":" + cell.getValues().attributes[attr].type,
                        value: cell.getValues().attributes[attr].name,
                        icon:"attribute"
                    });
            }
            for (var met in cell.getValues().methods) {
                elems.push(
                    {
                        label: cell.getValues().methods[met].name + "(" + cell.getValues().methods[met].parameters.map(function (e) {
                            return e.name;
                        }).join(',') + ")",
                        value: cell.getValues().methods[met].name + "(",
                        icon:"method"
                    });
            }
            return elems;
        },
        getCurrentDiagramType: function () {
            return this.options.currentindex == "class" ? "class" : "activity";
        },
        getCurrentGraph: function () {
            return this.get("graph");
        },
        deleteMethodDiagram: function (id) {
            this.options.graphs.methods.splice(this.getIndexFromId(id), 1);
        }

    });
    return new ProjectModel;
});
