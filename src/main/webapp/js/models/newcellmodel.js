define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'models/ProjectModel',
    'models/newcellfactory',
    'models/celltypes/celltypes'
], function ($, _, Backbone, joint, ProjectModel,abstractCellFactory,celltypes) {

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
            console.log(this.str);
            this.registerCells("class");
        },

        registerCells: function(diag){

            for (var property in celltypes[diag]) {
                if (celltypes[diag].hasOwnProperty(property) && property.startsWith("Hx")) {
                    console.log(property);
                    this.str.push(property);
                }
            }
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
            //console.log(type);
            ProjectModel.addCell(cell);
            //ProjectModel.addCellFromType(type);
        }
    });
    return NewCellModel;
});
