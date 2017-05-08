define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'views/ProjectView',
    'material',
    'text!views/templates.html',
    'jqueryui',
], function ($, _, Backbone, joint, ProjectView, componentHandler, templates) {

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
        tagname: 'div',

        /**
         * The DOM element corresponding to `DetailsView`.
         * @name DetailsView#el
         * @type {Object}
         */
        el: {},

        /**
         * ?
         * @private
         * @name DetailsView#currentTemplate
         * @function
         */
        currentTemplate: {},

        /**
         * ?
         * @name DetailsView#events
         * @type {Object}
         */
        events:{},

        /**
         * Initializes `el` with a jQuery object that handles the `#details`
         * div and starts listening to the `ProjectView` events
         * 'Switchgraph' and 'changed-cell'.
         * @name DetailsView#initialize
         * @function
         */
        initialize: function () {
            //this.templates = require('text!views/templates.html');
            this.$el = $("#details");
            //console.log(ProjectView.paper);
            this.listenTo(ProjectView.paper, "changed-cell", this.render);
        },

        /**
         * Re-paints the `#details` div after a 'changed-cell' event was
         * fired by the `ProjectView` object. The cell to be rendered
         * is deduced from `ProjectView.paper.selectedCell`.
         * @name DetailsView#render
         * @function
         */
        render: function () {
            //console.log("i'm detailsview and i saw your change");
            if (ProjectView.paper.selectedCell) {
                //console.log(templates);
                //this.currentTemplate = _.template($('#' + ProjectView.paper.selectedCell.get("type").replace(/\./g, "\\.")).html());
                this.currentTemplate = _.template($(templates).filter('#' + ProjectView.paper.selectedCell.get("type").replace(/\./g, "\\.")).html());
                var c = ProjectView.paper.selectedCell;
                var output = "";
                output = this.currentTemplate(c.getValues());
                this.$el.html(output);
                componentHandler.upgradeDom(); //refresh material design
                this.delegateEvents(_.extend(this.events, {
                    'keypress .edit': 'confirmEdit',
                    'change .edit': 'confirmEdit',
                    'click .add': 'execCommand',
                    'click .switch': 'switch',
                    'click .togglable': 'toggle'
                }));
                if (ProjectView.getCurrentDiagramType() == "activity") {
                    var split = function (val) {
                        return val.split(/(,\s* | \s*)/);
                    };
                    var extractLast = function (term) {
                        return split(term).pop();
                    };

                    $('input.edit').autocomplete({
                        minLength: 0,
                        source: function (request, response) {
                            console.log(ProjectView.visibleElements);
                            response($.ui.autocomplete.filter(
                                ProjectView.visibleElements, extractLast(request.term)));
                        },

                        focus: function () {
                            return false;
                        },

                        select: function (event, ui) {
                            var terms = split(this.value);
                            terms.pop();
                            terms.push(ui.item.value);
                            terms.push("");
                            this.value = terms.join("");
                            return false;
                        }
                    });/*.data("ui-autocomplete")._renderItem = function (ul, item) {
                        return $('<li class="ui-menu-item-with-icon"></li>')
                            .data("item.autocomplete", item)
                            .append('<a><span class="' + item.icon + '-item-icon"></span>' + item.label + '</a>')
                            .appendTo(ul);
                    };*/

                    _.each($('input.edit'),function (el) {
                        $(el).data('ui-autocomplete')._renderItem = function (ul, item)
                        {
                            return $('<li class="ui-menu-item-with-icon"></li>')
                                .data("item.autocomplete", item)
                                .append('<a><span class="' + item.icon + '-item-icon"></span>' + item.label + '</a>')
                                .appendTo(ul);
                        }
                    });
                }
            } else {
                this.$el.html("");
            }
            return this;
        },

        toggle: function (e) {
            e.preventDefault();
            var elem = $(e.target).next();
            elem.toggle('slow');
        },

        switch: function (e) {
            ProjectView.switch(e.target.value);
        },

        /**
         * Re-paints the `#details` div after a 'Switchgraph' event
         * has been fired by the `ProjectView` object.
         * @name DetailsView#visib
         * @function
         */
        visib: function () {

            if (ProjectView.paper.selectedCell)
                this.$el.html(ProjectView.paper.selectedCell.getMethods());
        },

        /**
         * Execute a method of the model passing its
         * name as a string.
         * @param e the method name
         */
        execCommand: function (e) {
            var tmp = e.target.name.split(".");
            if (tmp[0] == "deleteMethod") {
                ProjectView.deleteMethodAt(tmp[1]);
            }
            ProjectView.paper.selectedCell.executeMethod(tmp[0], Array.prototype.slice.call(tmp, 1));
            this.render();
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
                if (e.target.type == "checkbox") {
                    ProjectView.paper.selectedCell.setToValue(e.target.checked ? "true" : "false", e.target.name);
                }
                else {
                    ProjectView.paper.selectedCell.setToValue(e.target.value, e.target.name);
                }
            }
        }
    });
    return DetailsView;
});
