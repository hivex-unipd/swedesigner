define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'models/celltypes/celltypes'
], function ($, _, Backbone, joint, celltypes) {

    /**
     * @classdesc `AbstractCellFactory` is an abstract factory
     * for registering new cell types to the model and
     * getting instances of these types.
     *
     * @module client.models
     * @name AbstractCellFactory
     * @class AbstractCellFactory
     */
    var abstractCellFactory = (function () {

        /**
         * The available cell types.
         * @name AbstractCellFactory#types
         * @type {Object}
         */
        var types = {};

        return {

            /**
             * Returns a cell of a particular type,
             * possibly customized.
             * @name AbstractCellFactory#getCell
             * @param  {string} type           the type name
             * @param  {Object} customizations the customizations
             * @return {class}                 a new cell
             * @function
             */
            getCell: function (type, customizations) {
                var Cells = types[type];
                return (Cells ? new Cells(customizations) : null);
            },

            /**
             * [registerCell description]
             * @name AbstractCellFactory#registerCell
             * @param  {string} type                the type name
             * @param  {class}  Cell                the cell type
             * @return {joint.shapes.basic.Generic} a new cell
             * @function
             */
            registerCell: function (type, Cell) {
                var proto = Cell.prototype;
                types[type] = Cell;
                return abstractCellFactory;
            }
        };
    })();

    abstractCellFactory.registerCell("HxInterface", celltypes.class.HxInterface);
    abstractCellFactory.registerCell("HxClass", celltypes.class.HxClass);
    abstractCellFactory.registerCell("HxComment", celltypes.class.HxComment);
    abstractCellFactory.registerCell("HxGeneralization", celltypes.class.HxGeneralization);
    abstractCellFactory.registerCell("HxAssociation", celltypes.class.HxAssociation);
    abstractCellFactory.registerCell("HxImplementation", celltypes.class.HxImplementation);

    abstractCellFactory.registerCell("HxCustom", celltypes.activity.HxCustom);
    abstractCellFactory.registerCell("HxElse", celltypes.activity.HxElse);
    abstractCellFactory.registerCell("HxFor", celltypes.activity.HxFor);
    abstractCellFactory.registerCell("HxIf", celltypes.activity.HxIf);
    abstractCellFactory.registerCell("HxVariable", celltypes.activity.HxVariable);
    abstractCellFactory.registerCell("HxReturn", celltypes.activity.HxReturn);
    abstractCellFactory.registerCell("HxWhile", celltypes.activity.HxWhile);

    return abstractCellFactory;
});
