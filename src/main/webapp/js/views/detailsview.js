define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'views/ProjectView',
    'material',
    'jqueryui'
], function ($, _, Backbone, joint, ProjectView, componentHandler) {

    /**
     * @classdesc `DetailsView` shows the details of an element in one diagram.
     * The diagram can be the main class diagram or a method diagram.
     * In the first case the elements are classes or links between them,
     * so `DetailsView` shows the class name, its attributes and methods, etcetera.
     * In the second case the elements are instruction blocks, so `DetailsView`
     * shows the operands, parameters, or conditions of a block.
     *
     * @module client.view
     * @name DetailsView
     * @class DetailsView
     * @extends {Backbone.View}
     */
    var DetailsView = Backbone.View.extend({

        /**
         * The HTML tag populated by `DetailsView`.
         * @name DetailsView#tagname
         * @type {string}
         */
        tagname: "div",

        /**
         * The class name.
         * @name DetailsView#className
         * @type {string}
         */
        className: "details-view", // inutile?

        /**
         * The DOM element corresponding to `DetailsView`.
         * @name DetailsView#el
         * @type {Object}
         */
        el: {},

        /**
         * ?
         * @private
         * @name DetailsView#mytemplate
         * @function
         */
        mytemplate: {},

        /**
         * ?
         * @name DetailsView#inputs
         * @type {Object}
         */
        inputs: {},

        /*events: {
         "click .adda":   "addAttribute",
         "click .addm":  "addMethod",
         "keydown" : "confirm"
         },*/

        //paper: null,

        //templ: _.template($('#class-template').html()),

        /**
         * ?
         * @name DetailsView#events
         * @type {Object}
         */
        events: {
            //'blur .edit': 'confirmEdit'
        },

        visibleElements: [],

        /**
         * Initializes `el` with a jQuery object that handles the `#details`
         * div and starts listening to the `ProjectView` events
         * 'Switchgraph' and 'changed-cell'.
         * @name DetailsView#initialize
         * @function
         */
        initialize: function () {

            this.$el = $("#details");
            console.log(ProjectView.paper);
            //this.listenTo(paper, "cellChanged", this.changeModel);
            //this.mytemplate = _.template($('#uml.ClassDiagramElement').html());

            // occhio
            this.listenTo(ProjectView.paper, "changed-cell", this.render);
            //this.listenTo(ProjectView, "Switchgraph", this.visib);
            // si riesce a passare paper come parametro?
        },

        /**
         * Re-paints the `#details` div after a 'changed-cell' event was
         * fired by the `ProjectView` object. The cell to be rendered
         * is deduced from `ProjectView.paper.selectedCell`.
         * @name DetailsView#render
         * @function
         */
        render: function () {
            console.log("i'm detailsview and i saw your change");
            //this.$el.html(ProjectView.paper.selectedCell.getClassName());
            //console.log("sele", _.template($('#'+ProjectView.paper.selectedCell.get("type").replace(/\./g, "\\.")).html()));
            //this.$el.html(this.mytemplate({title: "titolo molto divino", val:"valore molto animale"}));
            if (ProjectView.paper.selectedCell) {
                this.mytemplate = _.template($('#' + ProjectView.paper.selectedCell.get("type").replace(/\./g, "\\.")).html());
                //this.mytemplate = _.template($('#uml\\.ClassDiagramElement').html()),
                //console.log(this.mytemplate);
                // console.log(ProjectView.paper.selectedCell.get("type"));
                //   console.log(ProjectView.paper.selectedCell);
                //console.log(ProjectView.paper.selectedCell.attributes.keyvalues);
                var c = ProjectView.paper.selectedCell;


                var output = "";


                /*var fn = function (element) {
                 //console.log("no lazy?");
                 if(_.isArray(element)) {console.log(element); console.log("è array"); _.each(element, fn, this) }
                 else  {console.log(element); output += this.mytemplate(element);}
                 };*/

                //console.log("ripperoni");
                //c.attributes.keyvalues.forEach(fn);
                // _.each(c.attributes.keyvalues, fn, this);

                //console.log("finironi");

                console.log(c);


                output = this.mytemplate(c.getValues());

                // this.$el.html(this.mytemplate({title: "titolo molto divino", val:"valore molto animale"}));
                this.$el.html(output);

                componentHandler.upgradeDom(); //refresh material design

                // idee per il binding a due vie: salvarsi in un array inputs i vari input e in qualche modo confirmedit si prende
                // solo quello che gli serve... mi sembra comunque terribilmente inefficiente... che facciamo?
                // bb
                this.delegateEvents(_.extend(this.events,
                    {
                        'keypress .edit': 'confirmEdit',
                        'change .edit': 'confirmEdit',
                        'click .add': 'execmod',
                        'click .switch': 'switch',
                        'click .togglable': 'toggle'
                    }
                ));
                console.log("currentdiag ",ProjectView.getCurrentDiagramType());
                if (ProjectView.getCurrentDiagramType() == "activity") {
                    console.log("sto facendo qualcosa");
                    var split = function (val) {
                        return val.split(/(,\s* | \s*)/);
                    };
                    var extractLast = function (term) {
                        return split(term).pop();
                    };
                    $('input.edit').autocomplete({
                            minLength: 0,
                            source: function (request, response) {
                                console.log( ProjectView.visibleElements);
                                response($.ui.autocomplete.filter(
                                    ProjectView.visibleElements, extractLast(request.term)));
                            },
                            focus: function () {
                                return false;
                            },

                            select: function (event, ui) {
                                var terms = split(this.value);
                                // remove the current input
                                terms.pop();
                                // add the selected item
                                terms.push(ui.item.value);
                                // add placeholder to get the comma-and-space at the end
                                terms.push("");
                                this.value = terms.join("");
                                return false;
                            }
                        }
                    );
                }
            }
            else {
                this.$el.html("");
            }


            return this;

        },
        toggle:function (e) {
            //console.log("sto togglolando");
            e.preventDefault();
            console.log($(e.target).next());
            var elem = $(e.target).next();
            console.log(elem);
            //$('.toggle').not(elem).hide('slow');
            elem.toggle('slow');
        },
        switch: function (e) {
            ProjectView.switch(e.target.value);
        },

        /**
         * Re-paints the `#details` div after a 'Switchgraph' event was
         * fired by the `ProjectView` object.
         * @name DetailsView#visib
         * @function
         */
        visib: function () {
            if (ProjectView.paper.selectedCell)
                this.$el.html(ProjectView.paper.selectedCell.getMethods());
        },
        /**
         * Execute a method of the model passing its name as string
         * @param e The method name
         */
        execmod: function (e) {
            var tmp = e.target.name.split(".");
            if(tmp[0]=="deleteMethod"){
                ProjectView.deleteMethodAt(tmp[1]);
            }
            ProjectView.paper.selectedCell.executemethod(tmp[0], Array.prototype.slice.call(tmp, 1));
            //ProjectView.paper.selectedCell.executemethod.apply(this,[].slice.call(tmp));
            this.render();
        },

        /**
         * ?
         * @name DetailsView#getDescendantProp
         * @function
         * @param {Object} obj ?
         * @param {Object} desc ?
         */
        getDescendantProp: function (obj, desc) {
            var arr = desc.split(".");
            while (arr.length && (obj = obj[arr.shift()]));
            return obj;
        },

        /**
         * Confirms the edits performed in a given field
         * inside the `#details` div and updates the
         * corresponding cell of the diagram.
         * @name DetailsView#confirmEdit
         * @function
         * @param {event} e the action event
         * @private
         */
        confirmEdit: function (e) {
            if ((e.type == "keypress" && e.which == 13) || e.type == "change") {
                // fai controllo di dati corretti e aggiorna il graph
                //this.model.set("",this.$('#'));

                console.log(e.target.id);
                console.log(e.target.value);
                console.log(ProjectView.paper.selectedCell);
                if (e.target.type == "checkbox") {
                    console.log(e.target.checked);
                    ProjectView.paper.selectedCell.setToValue(e.target.checked ? "true" : "false", e.target.name);

                }
                else {
                    ProjectView.paper.selectedCell.setToValue(e.target.value, e.target.name);
                }


                //ProjectView.paper.selectedCell.set();
            }
        }
    });
    return DetailsView;
});
