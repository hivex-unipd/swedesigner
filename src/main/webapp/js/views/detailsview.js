define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'views/ProjectView'
], function ($, _, Backbone, joint, ProjectView) {
    var DetailsView = Backbone.View.extend({
        tagname: "div",
        className: "details-view",
        el: {},

        /*events: {
         "click .adda":   "addAttribute",
         "click .addm":  "addMethod",
         "keydown" : "confirm"
         },*/
        //paper: null,

        //templ: _.template($('#class-template').html()),


        initialize: function () {
            this.$el = $("#details");
            console.log(ProjectView.paper);
            //this.listenTo(paper, "cellChanged", this.changeModel);
            this.listenTo(ProjectView.paper, "changed-cell", this.render);
            this.listenTo(ProjectView, "Switchgraph", this.visib);
            // si riesce a passare paper come parametro?
        },

        render: function () {
            console.log("i'm detailsview and i saw your change");
            //this.$el.html(ProjectView.paper.selectedCell.getClassName());

            return this;


        },
        visib: function () {
            if (ProjectView.paper.selectedCell)
                this.$el.html(ProjectView.paper.selectedCell.getMethods());
        }

        /*
         confirm: function (e) {
         if (e.which === ENTER_KEY) {
         // fai controllo di dati corretti e aggiorna il graph
         }
         }
         */


    });
    return DetailsView;
});
