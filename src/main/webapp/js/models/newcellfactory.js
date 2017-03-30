/**
 * Created by Marco on 30/03/2017.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
], function ($, _, Backbone, joint) {
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

                // only register classes that fulfill the vehicle contract
                if ( proto.markup ) {
                    types[type] = Cell;
                }

                return abstractCellFactory;
            }
        };
    })();

    /**
     * non so se mettere da un altra parte sta roba sotto di registrazione
     */
    //abstractCellFactory.registerCell("HxInterface",)

    return abstractCellFactory;
});