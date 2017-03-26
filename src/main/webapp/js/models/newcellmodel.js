/**
 * Created by Marco on 24/03/2017.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'models/ProjectModel'
], function ($, _, Backbone, joint,ProjectModel) {
    var newCellModel = Backbone.Model.extend({
            str: [],
            initialize: function () {
                console.log(this.str);
                for (var property in joint.shapes.uml) {
                    if (joint.shapes.uml.hasOwnProperty(property)) {
                        this.str.push(property);
                    }
                }

            },
            addCell: function (type) {
                //console.log(type);
                ProjectModel.addCellFromType(type);
            }
        }
    );
    return newCellModel;
});