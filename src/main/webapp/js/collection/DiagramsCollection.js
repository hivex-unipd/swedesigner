define([
    'jquery',
    'underscore',
    'backbone',
    'joint'
],function ($, _, Backbone, joint) {

	/**
     * @classdesc `DiagramsCollection` is a collection of
     * `joint.dia.Graph` objects, which are drawable diagrams.
     *
     * @module client.collection
     * @name DiagramsCollection
     * @class DiagramsCollection
     * @extends {Backbone.Collection}
     */
    var DiagramsCollection = Backbone.Collection.extend({
        model: joint.dia.Graph
    });
    return DiagramsCollection;
});
