/**
 * Created by Marco on 24/03/2017.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'models/newcellmodel'
], function ($, _, Backbone, joint, newCellModel) {
    var newCellView = Backbone.View.extend({
        str: [],
        el: $('#components'),
        initialize: function () {
            console.log("ehi ci sono");
            this.model = new newCellModel;

            for (var p in this.model.str) {
                console.log(this.model.str[p]);
                this.str.push('<button class="newcompbt mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect mdl-button--colored mdl-color-text--white">' + this.model.str[p] + '</button>');
            }
            this.$el.html(_.each(this.str));
        },
        events:{
            'click .newcompbt':'addCell'
        },
        addCell: function (event) {
            this.model.addCell(event)
        }
    });
    return newCellView;
});