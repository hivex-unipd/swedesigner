define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'models/ProjectModel',
    'models/newcellfactory',
    'models/celltypes/celltypes'
], function ($, _, Backbone, joint, ProjectModel, abstractCellFactory, celltypes) {

    /**
     * @classdesc `NewCellModel` stores all the available
     * elements, relations, and blocks that can be inserted in
     * a diagram. Every `NewCellView` owns a `NewCellModel`.
     *
     * @module client.models
     * @name NewCellModel
     * @class NewCellModel
     * @extends {Backbone.Model}
     */
    var NewCellModel = Backbone.Model.extend({

        /**
         * The available type of cell that the user
         * can insert into the current diagram.
         * @name NewCellModel#str
         * @type {Array}
         */
        str: [],

        /**
         * Initialize the `str` array with all the available
         * cell types.
         * @name NewCellModel#initialize
         * @function
         */
        initialize: function () {
            this.registerCells("class");
        },

        switchComponents: function () {
            if (ProjectModel.options.currentindex == "class")
                this.registerCells("class");
            else
                this.registerCells("activity");
        },

        registerCells: function (diag) {
            this.str.length = 0;
            for (var property in celltypes[diag]) {
                if (celltypes[diag].hasOwnProperty(property) && property.startsWith("Hx")) {
                    console.log(property);
                    this.str.push(property);
                }
            }
            this.trigger("change:str");
        },

        /**
         * Adds a new cell to the current diagram, based on which
         * type of cell the user has selected.
         * @name NewCellModel#addCell
         * @function
         * @param {event} event the action event
         */
        addCell: function (type) {
            var cell = abstractCellFactory.getCell(type);
            ProjectModel.addCell(cell);
        }
    });
    return NewCellModel;
});
