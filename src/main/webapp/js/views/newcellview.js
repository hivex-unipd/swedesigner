define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'models/newcellmodel'
], function ($, _, Backbone, joint, NewCellModel) {

    /**
     * @classdesc `NewCellView` presents to the user all the available
     * elements, relations, and blocks that can be inserted in the
     * current diagram (class or method diagram).
     * It extracts the available elements by creating and querying
     * a `NewCellModel` object.
     *
     * @module client.view
     * @name NewCellView
     * @class NewCellView
     * @extends {Backbone.View}
     */
    var NewCellView = Backbone.View.extend({

        /**
         * The DOM element corresponding to `NewCellView`.
         * @name NewCellView#el
         * @type {jQuery}
         */
        el: $('#components'),

        /**
         * The HTML buttons to be fed into the `#components` div;
         * each of them is a string representing an element that
         * can be inserted into the current diagram.
         * @name NewCellView#str
         * @type {Array}
         */
        str: [],

        /**
         * The page events, each one linked to the desired actions.
         * @name NewCellView#events
         * @type {Object}
         */
        events: {
            'click .newcompbt': 'addCell'
        },

        /**
         * Initializes `model` with a `NexCellModel` object;
         * initializes `str` with with the HTML buttons for each insertable
         * element (deduced from `model.str`);
         * initializes `el` with the HTML buttons in `str`.
         * @name NewCellView#initialize
         * @function
         */
        initialize: function () {
            console.log("ehi ci sono");
            this.model = new NewCellModel;
            console.log(this.model.str);
            for (var p in this.model.str) {
               console.log(p);
                this.str.push('<button id="' + this.model.str[p] + '"" class="newcompbt ">' + this.model.str[p] + '</button>');
                console.log(this.str);
            }
            this.$el.html(_.each(this.str));
        },

        /**
         * Adds a new cell to the current diagram, based on which
         * type of cell the user has selected.
         * @name NewCellView#addCell
         * @function
         * @param {event} event the action event
         */
        addCell: function (event) {
            type = event.target.id;
            this.model.addCell(type);
        }
    });
    return NewCellView;
});
