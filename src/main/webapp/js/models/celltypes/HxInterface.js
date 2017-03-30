define([
    'jquery',
    'underscore',
    'backbone',
    'joint'
], function ($, _, Backbone, joint) {

    var HxInterface = joint.shapes.uml.ClassDiagramElement.extend({
        markup: [
            '<g class="rotatable">',
            '<g class="">',
            '<rect class="uml-class-name-rect"/><rect class="uml-class-divider-rect"/><rect class="uml-class-methods-rect togglemethods"/>',
            '</g>',
            '<text class="uml-class-name-text"/><text class="uml-class-methods-text togglemethods"/>',
            '</g>'
        ].join(''),

        // [...]
    });
    return HxInterface;
});
