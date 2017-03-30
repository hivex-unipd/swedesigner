define([
    'jquery',
    'underscore',
    'backbone',
    'joint'
], function ($, _, Backbone, joint) {

    /**
     * @classdesc `ActivityDiagramElement` is the base class
     * for all the block elements in the activity diagram of a method.
     *
     * @module client.models.celltypes
     * @name ActivityDiagramElement
     * @class ActivityDiagramElement
     * @extends {joint.shapes.basic.Generic}
     */
    var ActivityDiagramElement = joint.shapes.basic.Generic.extend({

        /**
         * The SVG markup for rendering the element on the page.
         * @name ActivityDiagramElement#markup
         * @type {string}
         */
        markup: [
            '<g class="activity">',
            '<rect class="activity-element-name-rect"/>',
            '<text class="activity-element-name-text"/>',
            '</g>'
        ].join(''),

        /**
         * The base class default attributes.
         * @name ActivityDiagramElement#defaults
         * @type {Object}
         */
        defaults: _.defaultsDeep({

            /**
             * The type of the element.
             * @name ActivityDiagramElement#defaults#type
             * @type {string}
             */
            type: 'uml.ActivityDiagramElement',

            /**
             * The CSS attributes for the diagram element.
             * @name ActivityDiagramElement#defaults#attrs
             * @type {Object}
             */
            attrs: {
                rect: {'width': 200},

                '.activity-element-name-rect': {
                    'stroke': 'black',
                    'stroke-width': 0,
                    'fill': '#4db6ac'
                },

                '.activity': {
                    'stroke': 'black',
                    'stroke-width': 0,
                    'fill': '#ffffff'
                },

                '.activity-element-name-text': {
                    'ref': '.activity-element-name-rect',
                    'ref-y': .5,
                    'ref-x': .5,
                    'text-anchor': 'middle',
                    'y-alignment': 'middle',
                    'fill': 'white',
                    'font-size': 16,
                    'font-family': 'Roboto'
                }
            },

            /**
             * Whether the element is expanded. (?)
             * @name ActivityDiagramElement#defaults#expanded
             * @type {boolean}
             */
            expanded: true,

            /**
             * Vertical offset from the top of the diagram. (?)
             * @name ActivityDiagramElement#defaults#offsetY
             * @type {number}
             */
            offsetY: 0,

            /**
             * ??
             * @name ActivityDiagramElement#defaults#keyvalues
             * @type {Object}
             */
            keyvalues: {
                xtype: '[block type]',
                comment: '[new block]',
                body : []
            }

        }, joint.shapes.basic.Generic.prototype.defaults),

        /**
         * Initializes the CSS attributes.
         * @name ActivityDiagramElement#initialize
         * @function
         */
        initialize: function () {

            joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);

            //_.bindAll(this.setOffsetY,'setOffsetY');
            this.updateRectangles();
            //_.bindAll(this, 'getOffsetY');

        },

        /**
         * Returns KeyValues.
         * @name ActivityDiagramElement#getKeyvalues
         * @return {Object} KeyValues
         */
        getKeyvalues: function () {
            return this.get('keyvalues');
        },

        /**
         * Sets the vertical offset from the top to `a` pixels.
         * @name ActivityDiagramElement#setOffsetY
         * @param {number} a vertical offset
         */
        setOffsetY: function (a) {
            this.offsetY = a;
        },

        /**
         * Returns the vertical offset of the element from the top.
         * @name ActivityDiagramElement#getOffsetY
         * @return {number} the vertical offset
         */
        getOffsetY: function () {
            return this.attributes.offsetY;
        },

        /**
         * Returns the indentation level of the element (in pixels).
         * @name ActivityDiagramElement#getOffsetX
         * @return {number} the indentation level
         */
        getOffsetX: function () {
            return this.getAncestors().length * 50;
        },

        /**
         * Returns the height of the element (in pixels).
         * @name ActivityDiagramElement#getHeight
         * @return {number} the height
         */
        getHeight: function () {
            return 35;
        },

        /**
         * Updates the CSS attributes, based on the state of the object.
         * @name ActivityDiagramElement#updateRectangles
         * @function
         */
        updateRectangles: function () {

            var attrs = this.get('attrs');

            // this.set('size.height', (this.get('attributes') + this.get('methods')) * 20);

            this.attributes.position = {x: this.getOffsetX(), y: this.getOffsetY()};


            if (this.get("keyvalues").comment.length > 20) {
                var text = this.getKeyvalues().xtype + "\n" + this.getKeyvalues().comment.slice(0, 20) + "...";
            } else {
                var text = this.getKeyvalues().xtype + "\n" + this.getKeyvalues().comment;
            }

            attrs['.activity-element-name-text'].text = text;
            attrs['.activity-element-name-rect'].height = this.getHeight();
            attrs['.activity-element-name-rect'].transform = 'translate(0,0)';
            console.log("valore offset: ");
            console.log(this.getOffsetY());


            //attrs['.activity'].transform = 'translate(0,' + this.getOffsetY()+ ')';
            //console.log(this.getOffsetY());

        }
    });
    return ActivityDiagramElement;
});
