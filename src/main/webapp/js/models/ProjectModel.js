define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'models/celltypes/celltypes'
], function ($, _, Backbone, joint, celltypes) {

    /**
     * @classdesc `ProjectModel` is the model for a
     * `ProjectView` object.
     *
     * @module client.models
     * @name ProjectModel
     * @class ProjectModel
     * @extends {Backbone.Model}
     */
    var ProjectModel = Backbone.Model.extend({

        graph: {},

        urlRoot: '/generate',

        options: {
            currentindex: "class",
            currentgraph: {},
            cellToBeAdded: null,
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
            let myAdjustVertices= _.partial(this.adjustVertices,this.graph);
            this.graph.on('add remove change:source change:target', myAdjustVertices);
        },

        /**
         * Deletes a cell from the model.
         * @param  {?} cell the cell to delete
         * @function
         */
        deleteCell: function (cell) {
            if (cell.getValues().hasOwnProperty("methods")) {
                for (var met in cell.getValues().methods) {
                    this.deleteMethodDiagram(cell.getValues().methods[met].id);
                }
            }
            this.graph.removeCells([cell]);
            console.log((this.graph));

            this.trigger('addcell');
        },

        /**
         * Adds a cell to the model.
         * @param  {?} cell the cell to be added
         * @function
         */
        addCell: function (cell) {
            this.options.cellToBeAdded = cell;
        },

        addCellToGraph: function () {
            _.each(this.graph.get("cells").models, function (el) {
                el.set("z", 1);
            });

            this.graph.addCell(this.options.cellToBeAdded);
            this.trigger('addcell', this.options.cellToBeAdded);
            this.options.cellToBeAdded = null;
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
                } else {
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
                } else {
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
            //this.trigger("renderActivity");
        },

        newProject:function () {
            this.options.graphs =  {
                classes: {
                    classesArray: [],
                        relationshipsArray: []
                },
                methods: []
            };
            this.options.currentindex = "class";
            this.graph.clear();
        },

        getIndexFromId: function (id) {
            return this.options.graphs.methods.findIndex((x) => x.id == id);
        },

        getClassVisibleElements: function (cell) {
            var elems = [];
            var cl = this.options.graphs.classes.classesArray;
            for (var g in cl) {
                console.log(cl[g]);
                if (cl[g].get("type") != "class.HxComment") {
                    elems.push({
                        label: this.options.graphs.classes.classesArray[g].getValues().name,
                        value: this.options.graphs.classes.classesArray[g].getValues().name,
                        icon: this.options.graphs.classes.classesArray[g].get("type") == "class.HxClass" ? "class" : "interface"
                    });
                }
            }
            for (var attr in cell.getValues().attributes) {
                elems.push({
                    label: cell.getValues().attributes[attr].name + ":" + cell.getValues().attributes[attr].type,
                    value: cell.getValues().attributes[attr].name,
                    icon: "attribute"
                });
            }
            for (var met in cell.getValues().methods) {
                elems.push({
                    label: cell.getValues().methods[met].name + "(" + cell.getValues().methods[met].parameters.map(function (e) {
                        return e.name;
                    }).join(',') + ")",
                    value: cell.getValues().methods[met].name + "(",
                    icon: "method"
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
        },

        adjustVertices: function (graph, cell) {
            // If the cell is a view, find its model.
            cell = cell.model || cell;

            if (cell instanceof joint.dia.Element) {

                _.chain(graph.getConnectedLinks(cell)).groupBy(function (link) {
                    // the key of the group is the model id of the link's source or target, but not our cell id.
                    return _.omit([link.get('source').id, link.get('target').id], cell.id)[0];
                }).each(function (group, key) {
                    // If the member of the group has both source and target model adjust vertices.
                    if (key !== 'undefined') adjustVertices(graph, _.first(group));
                });

                return;
            }

            // The cell is a link. Let's find its source and target models.
            var srcId = cell.get('source').id || cell.previous('source').id;
            var trgId = cell.get('target').id || cell.previous('target').id;

            // If one of the ends is not a model, the link has no siblings.
            if (!srcId || !trgId) return;

            var siblings = _.filter(graph.getLinks(), function (sibling) {

                var _srcId = sibling.get('source').id;
                var _trgId = sibling.get('target').id;

                return (_srcId === srcId && _trgId === trgId) || (_srcId === trgId && _trgId === srcId);
            });

            switch (siblings.length) {

                case 0:
                    // The link was removed and had no siblings.
                    break;

                case 1:
                    // There is only one link between the source and target. No vertices needed.
                    cell.unset('vertices');
                    break;

                default:

                    // There is more than one siblings. We need to create vertices.

                    // First of all we'll find the middle point of the link.
                    var srcCenter = graph.getCell(srcId).getBBox().center();
                    var trgCenter = graph.getCell(trgId).getBBox().center();
                    var midPoint = joint.g.line(srcCenter, trgCenter).midpoint();

                    // Then find the angle it forms.
                    var theta = srcCenter.theta(trgCenter);

                    // This is the maximum distance between links
                    var gap = 20;

                    _.each(siblings, function (sibling, index) {

                        // We want the offset values to be calculated as follows 0, 20, 20, 40, 40, 60, 60 ..
                        var offset = gap * Math.ceil(index / 2);

                        // Now we need the vertices to be placed at points which are 'offset' pixels distant
                        // from the first link and forms a perpendicular angle to it. And as index goes up
                        // alternate left and right.
                        //
                        //  ^  odd indexes
                        //  |
                        //  |---->  index 0 line (straight line between a source center and a target center.
                        //  |
                        //  v  even indexes
                        var sign = index % 2 ? 1 : -1;
                        var angle = joint.g.toRad(theta + sign * 90);

                        // We found the vertex.
                        var vertex = joint.g.point.fromPolar(offset, angle, midPoint);

                        sibling.set('vertices', [{x: vertex.x, y: vertex.y}]);
                    });
            }
        }

    });
    return new ProjectModel;
});
