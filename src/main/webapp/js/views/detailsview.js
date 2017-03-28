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
        mytemplate: _.template($('#item-template').html()),
        inputs: {},
        /*events: {
         "click .adda":   "addAttribute",
         "click .addm":  "addMethod",
         "keydown" : "confirm"
         },*/
        //paper: null,

        //templ: _.template($('#class-template').html()),

        events: {
            //'blur .edit': 'confirmEdit'
        },

        initialize: function () {

            this.$el = $("#details");
            console.log(ProjectView.paper);
            //this.listenTo(paper, "cellChanged", this.changeModel);


            // occhio
            // this.listenTo(ProjectView.paper, "changed-cell", this.render);
            this.listenTo(ProjectView, "Switchgraph", this.visib);
            // si riesce a passare paper come parametro?
        },

        render: function () {
            console.log("i'm detailsview and i saw your change");
            //this.$el.html(ProjectView.paper.selectedCell.getClassName());

            //this.$el.html(this.mytemplate({title: "titolo molto divino", val:"valore molto animale"}));

            console.log(ProjectView.paper.selectedCell);
            console.log(ProjectView.paper.selectedCell.attributes.keyvalues);
            var c = ProjectView.paper.selectedCell;


            var output = "";




            var fn = function (element) {
                //console.log("no lazy?");
                if(_.isArray(element)) {console.log(element); console.log("è array"); _.each(element, fn, this) }
                else  {console.log(element); output += this.mytemplate(element);}
            };

            console.log("ripperoni");
            //c.attributes.keyvalues.forEach(fn);
            _.each(c.attributes.keyvalues, fn, this);

            console.log("finironi");



            // this.$el.html(this.mytemplate({title: "titolo molto divino", val:"valore molto animale"}));
            this.$el.html(output);



            // idee per il binding a due vie: salvarsi in un array inputs i vari input e in qualche modo confirmedit si prende
            // solo quello che gli serve... mi sembra comunque terribilmente inefficiente... che facciamo?
            // bb
            this.delegateEvents(_.extend(this.events, {'keypress .edit': 'confirmEdit'}));



            return this;


        },
        visib: function () {
            if (ProjectView.paper.selectedCell)
                this.$el.html(ProjectView.paper.selectedCell.getMethods());
        },

         getDescendantProp: function(obj, desc) {
        var arr = desc.split(".");
        while(arr.length && (obj = obj[arr.shift()]));
        return obj;
        },



         confirmEdit: function (e) {

            if (e.which == 13) {

             // fai controllo di dati corretti e aggiorna il graph
             //this.model.set("",this.$('#'));
                console.log(e.target.id);
                console.log(e.target.value);
                console.log(ProjectView.paper.selectedCell);
                //ProjectView.paper.selectedCell.set();

            }
         }



    });
    return DetailsView;
});
