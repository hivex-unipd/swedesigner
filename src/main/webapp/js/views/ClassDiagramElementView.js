define([
    'jquery',
    'underscore',
    'backbone',
    'joint'
], function ($, _, Backbone, joint) {

    /**
     * @classdesc [...]
     *
     * @module client.views
     * @name ClassDiagramElementView
     * @class ClassDiagramElementView
     * @extends {joint.dia.ElementView}
     */
    var ClassDiagramElementView = joint.dia.ElementView.extend({

        initialize: function () {
            joint.dia.ElementView.prototype.initialize.apply(this, arguments);

            this.listenTo(this.model, 'uml-update', function () {
                console.log("update interfaccia");
                this.update();
                this.resize();
            });
            ///this.listenTo(this.model, 'click', toggl);

        },

        events: {
            'click .togglemethods': 'togglemethods',
            'click .toggleattributes': 'toggleattributes',
        },

        toggleattributes: function () {

            this.model.set("attributesexpanded", !this.model.get("attributesexpanded"));
            this.model.updateRectangles();
            this.update(); // ecco cosa dovevi fare, le cose funzionavano già

        },

        togglemethods: function () {

            this.model.set("methodsexpanded", !this.model.get("methodsexpanded"));
            this.model.updateRectangles();
            this.update(); // ecco cosa dovevi fare, le cose funzionavano già

        }
    });
    return ClassDiagramElementView;
});
