/**
 * Created by matte on 21/03/2017.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
],function ($, _, Backbone, joint) {
    var DiagramsCollection = Backbone.Collection.extend({
        model:joint.dia.Graph
    });
    return DiagramsCollection;
});