/**
 * Created by Marco on 30/03/2017.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'models/celltypes/celltypes'
], function ($, _, Backbone, joint,celltypes) {
    var abstractCellFactory = (function () {

        // Storage for our vehicle types
        var types = {};

        return {
            getCell: function ( type, customizations ) {
                var Cells = types[type];

                return (Cells ? new Cells(customizations) : null);
            },

            registerCell: function ( type, Cell ) {
                var proto = Cell.prototype;
                types[type]= Cell;
                // only register classes that fulfill the vehicle contract
                /*if ( proto.markup ) {
                 types[type] = Cell;
                 }*/

                return abstractCellFactory;
            }
        };
    })();

    /**
     * non so se mettere da un altra parte sta roba sotto di registrazione
     */
    abstractCellFactory.registerCell("HxInterface",celltypes.class.HxInterface);
    abstractCellFactory.registerCell("HxClass",celltypes.class.HxClass);
    abstractCellFactory.registerCell("HxGeneralization",celltypes.class.HxGeneralization);
    abstractCellFactory.registerCell("HxAssociation",celltypes.class.HxAssociation);
    abstractCellFactory.registerCell("HxImplementation",celltypes.class.HxImplementation);

    //abstractCellFactory.registerCell("HxAssignement",celltypes.activity.HxAssignement);
    abstractCellFactory.registerCell("HxCustom",celltypes.activity.HxCustom);
    abstractCellFactory.registerCell("HxElse",celltypes.activity.HxElse);
    abstractCellFactory.registerCell("HxFor",celltypes.activity.HxFor);
    abstractCellFactory.registerCell("HxIf",celltypes.activity.HxIf);
    abstractCellFactory.registerCell("HxVariable",celltypes.activity.HxVariable);
    abstractCellFactory.registerCell("HxReturn",celltypes.activity.HxReturn);
    abstractCellFactory.registerCell("HxWhile",celltypes.activity.HxWhile);

    return abstractCellFactory;
});