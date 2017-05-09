define([
    'jquery',
    'underscore',
    'backbone',
    'joint'
], function ($, _, Backbone, joint) {

    Swedesigner = {};
    Swedesigner.client = {};
    Swedesigner.client.model = {};
    var celltypes = Swedesigner.client.model.celltypes = {};

    celltypes.activity = {};
    celltypes.class = {};


    /**
     * @classdesc `ClassDiagramElement` is the base class for every
     * element of the class diagram. Elements can be classes,
     * interfaces, annotations or links between them.
     *
     * @module client.model.celltypes.class
     * @name ClassDiagramElement
     * @class ClassDiagramElement
     * @extends {joint.shapes.basic.Generic}
     */
    celltypes.class.ClassDiagramElement = joint.shapes.basic.Generic.extend({

        toolMarkup: ['<g class="element-tools">',
            '<g class="element-tool-remove"><circle fill="red" r="11"/>',
            '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
            '<title>Remove</title>',
            '</g>',
            '</g>'].join(''),

        /**
         * Default attributes of a `ClassDiagramElement` object.
         * @name ClassDiagramElement#defaults
         * @type {Object}
         */
        defaults: _.defaultsDeep({
            type: 'uml.ClassDiagramElement'
        }, joint.shapes.basic.Generic.prototype.defaults),

        /**
         * Sets `updateRectangles()` as a callback to the `values`
         * member; then calls `updateRectangles()` for actually
         * rendering the cell for the first time.
         * @name ClassDiagramElement#initialize
         * @function
         */
        initialize: function () {
            this.on('change:values', function () {
                this.updateRectangles();
                this.trigger('uml-update');
            }, this);
            this.updateRectangles();
            joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
        },

        /**
         * Returns the values held by the cell,
         * i.e. the name, attributes, methods etcetera.
         * @name ClassDiagramElement#getValues
         * @function
         * @return {Object} the cell's contents
         */
        getValues: function () {
            return this.get("values");
        },

        /**
         * Renders the cell, based on its state.
         * @name ClassDiagramElement#updateRectangles
         * @function
         */
        updateRectangles: function () {
            // asbtract method
        },

        /**
         * Sets `values.<path>` to `<value>`.
         * @name ClassDiagramElement#setToValue
         * @function
         * @param {Object} value the value to be assigned
         * @param {string} path the member to be set
         */
        setToValue: function (value, path) {
            obj = this.getValues();
            path = path.split('.');
            for (i = 0; i < path.length - 1; i++) {
                obj = obj[path[i]];
            }
            obj[path[i]] = value;
            this.updateRectangles();
            this.trigger("uml-update");
        },

        /**
         * Executes the method whose name matches `met`.
         * @name ClassDiagramElement#executeMethod
         * @function
         * @param {function} met the method to be executed
         */
        executeMethod: function (met) {
            return this[met] && this[met].apply(this, [].slice.call(arguments, 1));
        }
    });


    /**
     * @classdesc `ClassDiagramElementView` is the view for
     * a `ClassDiagramElement` object.
     *
     * @module client.model.celltypes.class
     * @name ClassDiagramElementView
     * @class ClassDiagramElementView
     * @extends {joint.dia.ElementView}
     */
    celltypes.class.ClassDiagramElementView = joint.dia.ElementView.extend({

        /**
         * Calls the base class `initialize()` method
         * and sets the view to react to a model update
         * by calling `update()` and then `resize()`.
         * @name ClassDiagramElementView#initialize
         * @function
         */
        initialize: function () {
            joint.dia.ElementView.prototype.initialize.apply(this, arguments);

            this.listenTo(this.model, 'uml-update', function () {
                this.update();
                this.resize();
            });
        },

        /**
         * The events on the view, each one linked to its callback.
         * @name ClassDiagramElementView#events
         * @type {Object}
         */
        events: {
            'mousedown .togglemethods': 'toggleMethods',
            'mousedown .toggleattributes': 'toggleAttributes'
        },

        render: function () {
            joint.dia.ElementView.prototype.render.apply(this, arguments);

            this.renderTools();
            this.update();
            return this;
        },

        renderTools: function () {

            var toolMarkup = this.model.toolMarkup || this.model.get('toolMarkup');
            console.log("markup:", toolMarkup);
            if (toolMarkup) {

                var nodes = joint.V(toolMarkup);
                console.log("el:", joint.V(this.el));
                joint.V(this.el).append(nodes);

            }

            return this;
        },
        /*pointerclick: function (evt, x, y) {

         /*this._dx = x;
         this._dy = y;
         this._action = '';

         var className = evt.target.parentNode.getAttribute('class');

         switch (className) {

         case 'element-tool-remove':
         this.model.remove();
         return;
         break;

         default:
         }

         joint.dia.CellView.prototype.pointerclick.apply(this, arguments);
         },*/

        /**
         * Toggles the display of the class attributes.
         * @name ClassDiagramElementView#toggleattributes
         * @function
         */
        // tolta perché buggata
        toggleAttributes: function () { //non so se sia giusto tenerli qua...boh vedremo
            // this.model.set("attributesExpanded", !this.model.get("attributesExpanded"));
            // this.model.updateRectangles();
            // this.update(); // ecco cosa dovevi fare, le cose funzionavano già
        },

        /**
         * Toggles the display of the class methods.
         * @name ClassDiagramElementView#togglemethods
         * @function
         */
        // tolta perché buggata
        toggleMethods: function () {
            // this.model.set("methodsExpanded", !this.model.get("methodsExpanded"));
            // this.model.updateRectangles();
            // this.update(); // ecco cosa dovevi fare, le cose funzionavano già
        }
    });


    /**
     * @classdesc `HxClass` represents a UML class in a
     * class diagram.
     *
     * @module client.model.celltypes.class
     * @name HxClass
     * @class HxClass
     * @extends {celltypes.class.ClassDiagramElement}
     */
    celltypes.class.HxClass = celltypes.class.ClassDiagramElement.extend({

        /**
         * Calls the base class `initialize()` method.
         * @name HxClass#initialize
         * @function
         */
        initialize: function () {
            celltypes.class.ClassDiagramElement.prototype.initialize.apply(this, arguments);
        },

        /**
         * The HTML markup for the cell.
         * @name HxClass#markup
         * @type {string}
         */
        markup: [
            '<g class="rotatable">',
            '<g>',
            '<rect class="uml-class-name-rect"/><rect class="uml-class-attrs-rect toggleattributes"/><rect class="uml-class-divider-rect"/><rect class="uml-class-methods-rect togglemethods"/>',
            '</g>',
            '<text class="uml-class-name-text"/><text class="uml-class-attrs-text toggleattributes"/><text class="uml-class-methods-text togglemethods"/>',
            '</g>'
        ].join(''),

        /**
         * Default attributes of an `HxClass` object:
         * type, position in the canvas, CSS attributes,
         * and the state and contents of the cell.
         * @name ClassDiagramElement#defaults
         * @type {Object}
         */
        defaults: _.defaultsDeep({

            type: 'class.HxClass',

            position: {x: 200, y: 200},

            size: {width: 100, height: 100},

            attrs: {
                rect: {'width': 200},

                '.uml-class-name-rect': {
                    'stroke': '#d6b656',
                    'stroke-width': 1,
                    'fill': '#fff2cc'
                },
                '.uml-class-attrs-rect': {
                    'stroke': '#d6b656',
                    'stroke-width': 1,
                    'fill': '#fff2cc',
                    'expanded': 'true'
                },
                '.uml-class-methods-rect': {
                    'stroke': '#d6b656',
                    'stroke-width': 1,
                    'fill': '#fff2cc',
                    'expanded': 'true'
                },
                '.uml-class-divider-rect': {
                    'stroke': 'black',
                    'stroke-width': 1,
                    'fill': 'black'
                },

                '.uml-class-name-text': {
                    'ref': '.uml-class-name-rect',
                    'ref-y': .6,
                    'ref-x': .5,
                    'text-anchor': 'middle',
                    'y-alignment': 'middle',
                    'fill': '#222222',
                    'font-size': 16,
                    'font-family': 'Roboto'
                },
                '.uml-class-attrs-text': {
                    'ref': '.uml-class-attrs-rect',
                    'ref-y': 2,
                    'ref-x': 5,
                    'fill': '#222222',
                    'font-size': 12,
                    'font-family': 'monospace'
                },
                '.uml-class-methods-text': {
                    'ref': '.uml-class-methods-rect',
                    'ref-y': 2,
                    'ref-x': 5,
                    'fill': '#222222',
                    'font-size': 12,
                    'font-family': 'monospace'
                }
            },

            attributesExpanded: true,

            methodsExpanded: true,

            values: {
                name: "ClassName",
                abstract: "false",
                static: "false",
                attributes: [],
                methods: []
            }
        }, celltypes.class.ClassDiagramElement.prototype.defaults),

        /**
         * Renders the cell, based on its state.
         * @name HxClass#updateRectangles
         * @function
         */
        updateRectangles: function () {
            var attrs = this.get('attrs');
            var offsetY = 0;
            rects = [
                {
                    type: 'name',
                    text: this.getValues().name
                },
                {
                    type: 'attrs',
                    text: this.get('attributesExpanded') ? this.getValues().attributes : "Attributes (click to expand)"
                },
                {
                    type: 'methods',
                    text: this.get('methodsExpanded') ? this.getValues().methods : "Methods (click to expand)"
                }
            ];

            var rectWidth = this.getWidth();

            var rectHeight = 1 * 15 + 1;
            attrs['.uml-class-name-text'].text = rects[0].text;
            attrs['.uml-class-name-rect'].height = rectHeight;
            attrs['.uml-class-name-rect'].width = rectWidth;
            attrs['.uml-class-name-rect'].transform = 'translate(0,' + offsetY + ')';
            offsetY += rectHeight;
            //rectHeight = _.isArray(rects[1].text) ? rects[1].text.length * 15 + 1 : 1 * 15 + 1;
            if (_.isArray(rects[1].text)) {
                if (rects[1].text.length > 0) {
                    rectHeight = rects[1].text.length * 15 + 1;
                }
                else {
                    rectHeight = 1 * 15 + 1;
                }
            }
            else {
                rectHeight = 1 * 15 + 1;
            }
            attrs['.uml-class-attrs-text'].text = _.isArray(rects[1].text) ? rects[1].text.map(function (e) {
                    let vis = "";
                    switch (e.visibility) {
                        case "public":
                            vis = "+";
                            break;
                        case "private":
                            vis = "-";
                            break;
                        case "protected":
                            vis = "~";
                            break;
                        /*case "package":
                         vis = "#";
                         break;*/
                    }
                    return vis + " " + e.name + ":" + e.type;
                }).join('\n') : rects[1].text;
            attrs['.uml-class-attrs-rect'].height = rectHeight;
            attrs['.uml-class-attrs-rect'].width = rectWidth;
            attrs['.uml-class-attrs-rect'].transform = 'translate(0,' + offsetY + ')';
            offsetY += rectHeight;
            //rectHeight = _.isArray(rects[2].text) ? rects[2].text.length * 15 + 1 : 1 * 15 + 1;
            if (_.isArray(rects[2].text)) {
                if (rects[2].text.length > 0) {
                    rectHeight = rects[2].text.length * 15 + 1;
                }
                else {
                    rectHeight = 1 * 15 + 1;
                }
            }
            else {
                rectHeight = 1 * 15 + 1;
            }
            attrs['.uml-class-methods-text'].text = _.isArray(rects[2].text) ? rects[2].text.map(function (e) {
                    let vis = "";
                    switch (e.visibility) {
                        case "public":
                            vis = "+";
                            break;
                        case "private":
                            vis = "-";
                            break;
                        case "protected":
                            vis = "~";
                            break;
                        case "package":
                            vis = "#";
                            break;
                    }
                    let params = e.parameters.map(function (f) {
                        return f.name;
                    }).join(",");
                    return vis + " " + e.name + "(" + params + ")" + ":" + e.returnType;
                }).join('\n') : rects[2].text;
            attrs['.uml-class-methods-rect'].height = rectHeight;
            attrs['.uml-class-methods-rect'].width = rectWidth;
            attrs['.uml-class-methods-rect'].transform = 'translate(0,' + offsetY + ')';

            celltypes.class.ClassDiagramElement.prototype.updateRectangles.apply(this, arguments);
        },

        /**
         * Adds a new method to the class represented by the cell.
         * @name HxClass#addMethod
         * @function
         */
        addMethod: function () {
            this.getValues().methods.push({
                name: "",
                visibility: "private",
                id: joint.util.uuid(),
                returnType: "",
                static: "false",
                abstract: "false",
                parameters: []
            });
        },

        /**
         * Adds a new attribute to the class represented by the cell.
         * @name HxClass#addMethod
         * @function
         */
        addAttribute: function () {
            this.getValues().attributes.push({
                name: "",
                type: "",
                defaultValue: "",
                visibility: "private",
                static: "false"
            });
        },

        /**
         * Adds a new argument to the `ind`th method in
         * the class represented by the cell.
         * @name HxClass#addMethod
         * @function
         * @param {number} ind the method's position
         */
        addParameter: function (ind) {
            this.getValues().methods[ind].parameters.push({
                name: "",
                type: "",
                defaultValue: ""
            });
        },
        deleteParameter: function (met) {
            this.getValues().methods[met[0]].parameters.splice(met[1], 1);
            this.updateRectangles();
            this.trigger("uml-update");
        },
        deleteAttribute: function (ind) {
            this.getValues().attributes.splice(ind, 1);
            this.updateRectangles();
            this.trigger("uml-update");
        },
        deleteMethod: function (ind) {
            this.getValues().methods.splice(ind, 1);
            this.updateRectangles();
            this.trigger("uml-update");
        },
        getAttrsDesc: function () {
            let attrDesc = this.getValues().attributes.map(function (e) {
                let vis = "";
                switch (e.visibility) {
                    case "public":
                        vis = "+";
                        break;
                    case "private":
                        vis = "-";
                        break;
                    case "protected":
                        vis = "~";
                        break;
                    /*case "package":
                     vis = "#";
                     break;*/
                }
                return {'text': vis + e.name + ":" + e.type, 'icon': 'assets/attributeicon.png'};
            });
            return attrDesc;
        },
        getMetDesc: function () {
            let metDesc = this.getValues().methods.map(function (e) {
                let vis = "";
                switch (e.visibility) {
                    case "public":
                        vis = "+";
                        break;
                    case "private":
                        vis = "-";
                        break;
                    case "protected":
                        vis = "~";
                        break;
                    case "package":
                        vis = "#";
                        break;
                }
                let params = e.parameters.map(function (f) {
                    return f.name;
                }).join(",");
                return {
                    'text': vis + " " + e.name + "(" + params + ")" + ":" + e.returnType,
                    'icon': 'assets/methodicon.png'
                };
            });
            return metDesc;

        },
        getCellDesc: function () {
            return {
                'text': this.getValues().name,
                'icon': 'assets/classicon.png',
                'children': this.getAttrsDesc().concat(this.getMetDesc())
            }
        },
        getWidth: function () {

            let longest = rects[0].text.length;
            let tmp = this.getAttrsDesc();
            for (i = 0; i < tmp.length; i++) {

                if (tmp[i].text.length > longest) {
                    longest = tmp[i].text.length;
                }
            }
            console.log(longest);
            tmp = this.getMetDesc();
            for (i = 0; i < tmp.length; i++) {
                if (tmp[i].text.length > longest) {
                    longest = tmp[i].text.length;
                }
            }
            return longest*5+180;

        }
    });


    /**
     * @classdesc `HxInterface` represents a UML interface
     * in a class diagram.
     *
     * @module client.model.celltypes.class
     * @name HxInterface
     * @class HxInterface
     * @extends {celltypes.class.ClassDiagramElement}
     */
    celltypes.class.HxInterface = celltypes.class.ClassDiagramElement.extend({
        markup: [
            '<g class="rotatable">',
            '<g class="">',
            '<rect class="uml-class-name-rect"/><rect class="uml-class-methods-rect togglemethods"/>',
            '</g>',
            '<text class="uml-class-name-text"/><text class="uml-class-methods-text togglemethods"/>',
            '</g>'
        ].join(''),
        defaults: _.defaultsDeep({

            type: 'class.HxInterface',
            position: {x: 200, y: 200},
            size: {width: 100, height: 100},
            attrs: {
                rect: {'width': 200},

                '.uml-class-name-rect': {'stroke': '#d6b656', 'stroke-width': 1, 'fill': '#fff2cc'},

                '.uml-class-methods-rect': {
                    'stroke': '#d6b656',
                    'stroke-width': 1,
                    'fill': '#fff2cc',
                    'expanded': 'true'
                },
                '.uml-class-name-text': {
                    'ref': '.uml-class-name-rect',
                    'ref-y': .5,
                    'ref-x': .5,
                    'text-anchor': 'middle',
                    'y-alignment': 'middle',
                    'fill': '#222222',
                    'font-size': 16,
                    'font-family': 'Roboto'
                },
                '.uml-class-methods-text': {
                    'ref': '.uml-class-methods-rect', 'ref-y': 5, 'ref-x': 5,
                    'fill': '#222222', 'font-size': 12, 'font-family': 'monospace'
                }

            },

            methodsExpanded: true,

            values: {
                name: "InterfaceName",
                methods: []
            }
        }, celltypes.class.ClassDiagramElement.prototype.defaults),

        initialize: function () {
            celltypes.class.ClassDiagramElement.prototype.initialize.apply(this, arguments);
        },

        updateRectangles: function () {

            var attrs = this.get('attrs');
            var offsetY = 0;
            rects = [
                {type: 'name', text: this.getValues().name},
                {
                    type: 'methods',
                    text: this.get('methodsExpanded') ? this.getValues().methods : "Methods (click to expand)"
                }
            ];
            var rectHeight = 2 * 15 + 1;
            attrs['.uml-class-name-text'].text = ['<<interface>>', rects[0].text].join('\n');
            attrs['.uml-class-name-rect'].height = rectHeight;
            attrs['.uml-class-name-rect'].transform = 'translate(0,' + offsetY + ')';
            offsetY += rectHeight;
            //rectHeight = _.isArray(rects[1].text) ? rects[1].text.length * 15 + 1 : 1 * 15 + 1;
            if (_.isArray(rects[1].text)) {
                if (rects[1].text.length > 0) {
                    rectHeight = rects[1].text.length * 15 + 1;
                }
                else {
                    rectHeight = 1 * 15 + 1;
                }
            }
            else {
                rectHeight = 1 * 15 + 1;
            }
            attrs['.uml-class-methods-text'].text = _.isArray(rects[1].text) ? rects[1].text.map(function (e) {
                    var vis = "";
                    switch (e.visibility) {
                        case "public":
                            vis = "+";
                            break;
                        case "private":
                            vis = "-";
                            break;
                        case "protected":
                            vis = "~";
                            break;
                        /*case "package":
                         vis = "#";
                         break;*/
                    }
                    var params = e.parameters.map(function (f) {
                        return f.name;
                    }).join(",");
                    return vis + " " + e.name + "(" + params + ")" + ":" + e.returnType;
                }).join('\n') : rects[1].text;
            attrs['.uml-class-methods-rect'].height = rectHeight;
            attrs['.uml-class-methods-rect'].transform = 'translate(0,' + offsetY + ')';

            celltypes.class.ClassDiagramElement.prototype.updateRectangles.apply(this, arguments);
        },

        addMethod: function () {
            this.getValues().methods.push({
                name: "",
                visibility: "private",
                id: joint.util.uuid(),
                static: "false",
                abstract: "false",
                returnType: "",
                parameters: []
            });
        },

        addParameter: function (ind) {
            this.getValues().methods[ind].parameters.push({
                name: "",
                type: "",
                defaultValue: ""
            });
        },

        deleteParameter: function (met) {
            this.getValues().methods[met[0]].parameters.splice(met[1], 1);
        },

        deleteMethod: function (ind) {
            this.getValues().methods.splice(ind, 1);
        },

        getMetDesc: function () {
            let metDesc = this.getValues().methods.map(function (e) {
                let vis = "";
                switch (e.visibility) {
                    case "public":
                        vis = "+";
                        break;
                    case "private":
                        vis = "-";
                        break;
                    case "protected":
                        vis = "~";
                        break;
                    case "package":
                        vis = "#";
                        break;
                }
                let params = e.parameters.map(function (f) {
                    return f.name;
                }).join(",");
                return {
                    'text': vis + " " + e.name + "(" + params + ")" + ":" + e.returnType,
                    'icon': 'assets/methodicon.png'
                };
            });
            return metDesc;

        },

        getCellDesc: function () {
            return {
                'text': this.getValues().name,
                'icon': 'assets/interfaceicon.png',
                'children': this.getMetDesc()
            }
        }
    });


    /**
     * @classdesc `HxComment` represents a comment
     * in a UML class diagram.
     *
     * @module client.model.celltypes.class
     * @name HxComment
     * @class HxComment
     * @extends {joint.shapes.basic.TextBlock}
     */
    celltypes.class.HxComment = joint.shapes.basic.TextBlock.extend({
        toolMarkup: ['<g class="element-tools">',
            '<g class="element-tool-remove"><circle fill="red" r="11"/>',
            '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
            '<title>Remove</title>',
            '</g>',
            '</g>'].join(''),
        defaults: _.defaultsDeep({
            type: "class.HxComment",
            position: {x: 200, y: 200},
            size: {width: 100, height: 100},
            values: {
                comment: ""
            }
        }, joint.shapes.basic.TextBlock.prototype.defaults),

        initialize: function () {
            joint.shapes.basic.TextBlock.prototype.initialize.apply(this, arguments);
        },

        getValues: function () {
            return this.get("values");
        },

        setToValue: function (value, path) {
            obj = this.getValues();
            path = path.split('.');
            for (i = 0; i < path.length - 1; i++) {
                obj = obj[path[i]];
            }
            obj[path[i]] = value;
            this.updateContent();
            //this.get('content')=value;
            //this.updateRectangles();
            //this.trigger("uml-update");
        },

        updateContent: function () {
            if (joint.env.test('svgforeignobject')) {

                // Content element is a <div> element.
                this.attr({
                    '.content': {
                        html: joint.util.breakText(this.getValues().comment, this.get('size'), this.get('attrs')['.content'])
                    }
                });

            } else {

                // Content element is a <text> element.
                // SVG elements don't have innerHTML attribute.
                this.attr({
                    '.content': {
                        text: joint.util.breakText(this.getValues().comment, cell.get('size'), this.get('attrs')['.content'])
                    }
                });
            }
        }
    });


    /**
     * @classdesc `CommentView` is the view for
     * a`HxComment` object.
     *
     * @module client.model.celltypes.class
     * @name CommentView
     * @class CommentView
     * @extends {joint.shapes.basic.TextBlock}
     */
    celltypes.class.CommentView = joint.shapes.basic.TextBlockView.extend({

        initialize: function () {
            joint.shapes.basic.TextBlockView.prototype.initialize.apply(this, arguments);
        },

        render: function () {
            joint.shapes.basic.TextBlockView.prototype.render.apply(this, arguments);

            this.renderTools();
            this.update();
            return this;
        },

        renderTools: function () {

            var toolMarkup = this.model.toolMarkup || this.model.get('toolMarkup');
            console.log("markup:", toolMarkup);
            if (toolMarkup) {

                var nodes = joint.V(toolMarkup);
                console.log("el:", joint.V(this.el));
                joint.V(this.el).append(nodes);

            }

            return this;
        }
    });


    /**
     * @classdesc `ClassDiagramLink` represents a link
     * between two components in a UML class diagram.
     *
     * @module client.model.celltypes.class
     * @name ClassDiagramLink
     * @class ClassDiagramLink
     * @extends {joint.dia.Link}
     */
    celltypes.class.ClassDiagramLink = joint.dia.Link.extend({
        defaults: _.defaultsDeep({
            type: 'class.ClassDiagramLink',
            source: {x: 30, y: 30},
            target: {x: 150, y: 120}
        }, joint.dia.Link.prototype.defaults),

        initialize: function () {
            joint.dia.Link.prototype.initialize.apply(this, arguments);
        },

        getValues: function () {
            return this.get("values");
        },

        setToValue: function (value, path) {
            obj = this.getValues();
            path = path.split('.');
            for (i = 0; i < path.length - 1; i++) {
                obj = obj[path[i]];
            }
            obj[path[i]] = value;
            this.updateRectangles();
            this.trigger("uml-update");
        }
    });


    /**
     * @classdesc `HxGeneralization` represents a
     * generalization relationship between two components
     * of a UML class diagram.
     *
     * @module client.model.celltypes.class
     * @name HxGeneralization
     * @class HxGeneralization
     * @extends {celltypes.class.ClassDiagramLink}
     */
    celltypes.class.HxGeneralization = celltypes.class.ClassDiagramLink.extend({
        defaults: _.defaultsDeep({
            type: 'class.HxGeneralization',
            attrs: {'.marker-target': {d: 'M 20 0 L 0 10 L 20 20 z', fill: 'white'}}
        }, celltypes.class.ClassDiagramLink.prototype.defaults)
    });


    /**
     * @classdesc `HxImplementation` represents an
     * implementation relationship between two components
     * of a UML class diagram.
     *
     * @module client.model.celltypes.class
     * @name HxImplementation
     * @class HxImplementation
     * @extends {celltypes.class.ClassDiagramLink}
     */
    celltypes.class.HxImplementation = celltypes.class.ClassDiagramLink.extend({
        defaults: _.defaultsDeep({
            type: 'class.HxImplementation',
            attrs: {
                '.marker-target': {d: 'M 20 0 L 0 10 L 20 20 z', fill: 'white'},
                '.connection': {'stroke-dasharray': '3,3'}
            }
        }, celltypes.class.ClassDiagramLink.prototype.defaults)
    });


    /**
     * @classdesc `HxAssociation` represents a UML
     * association between two components of a
     * class diagram.
     *
     * @module client.model.celltypes.class
     * @name HxAssociation
     * @class HxAssociation
     * @extends {celltypes.class.ClassDiagramLink}
     */
    celltypes.class.HxAssociation = celltypes.class.ClassDiagramLink.extend({

        defaults: _.defaultsDeep({
            type: 'class.HxAssociation',
            attrs: {
                '.marker-target': {
                    d: 'M 50 10 L 60 3 M 50 10 L 60 16',
                    fill: 'white',
                    'fill-opacity': '0.4',
                    stroke: 'black'
                },
                /*'.marker-target':{d: 'M 35 0 L 20 10 L 35 20',fill:'white','fill-opacity':'0.4',stroke:'black'},*/
                '.connection': {'stroke-dasharray': '3,3'}
            },
            labels: [
                {
                    position: 0.5,
                    attrs: {
                        text: {
                            text: ''
                        }
                    }
                }
            ],
            values: {
                card: "default",
                attribute: ""
            }
        }, celltypes.class.ClassDiagramLink.prototype.defaults),

        updatelabel: function () {
            this.label(0, {
                attrs: {
                    text: {
                        text: this.getcard()
                    }
                }
            });
        },

        getcard: function () {
            return this.get('values').card;
        },

        initialize: function () {
            this.updatelabel();
            celltypes.class.ClassDiagramLink.prototype.initialize.apply(this, arguments);

        },

        setToValue: function (value, path) {
            obj = this.getValues();
            path = path.split('.');
            for (i = 0; i < path.length - 1; i++) {
                obj = obj[path[i]];
            }
            obj[path[i]] = value;
            this.updatelabel();

        }
    });


    /**
     * @classdesc `ActivityDiagramElement` is the base class
     * for every element of an activity diagram. Elements can
     * be statements, loops, assignments etcetera.
     *
     * @module client.model.celltypes.activity
     * @name ActivityDiagramElement
     * @class ActivityDiagramElement
     * @extends {joint.shapes.basic.Generic}
     */
    celltypes.activity.ActivityDiagramElement = joint.shapes.basic.Generic.extend({
        toolMarkup: ['<g class="element-tools">',
            '<g class="element-tool-remove"><circle fill="red" r="11"/>',
            '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
            '<title>Remove</title>',
            '</g>',
            '</g>'].join(''),

        markup: [
            '<g class="activity">',
            '<rect class="activity-element-name-rect"/>',
            '<text class="activity-element-type-text"/>',
            '<text class="activity-element-name-text"/>',
            '<rect class="activity-element-body-rect"/>',
            '<text class="activity-element-body-text"/>',


            '<rect class="activity-toggle"/>',
            '<rect class="activity-element-type-rect"/>',

            '</g>'
        ].join(''),

        defaults: _.defaultsDeep({

            type: 'activity.ActivityDiagramElement',

            attrs: {
                rect: {'width': 200},


                '.activity-toggle': {'fill': '#eedd99', 'stroke': 'd6b656', 'stroke-width': 1},
                '.activity-element-name-rect': {'stroke': '#d6b656', 'stroke-width': 1, 'fill': '#fff2cc'},

                '.activity-element-body-rect': {'stroke': '#d6b656', 'stroke-width': 1, 'fill': '#fff2cc'},
                '.activity-element-type-rect': {'stroke': '#ffffff', 'stroke-width': 0, 'fill': '#ffffff'},

                '.activity': {'stroke': '#d6b656', 'stroke-width': 0, 'fill': '#ffffff'},
                '.activity-element-type-text': {
                    'ref': '.activity-element-name-rect',
                    'ref-y': 5,
                    'ref-x': 5,
                    'text-anchor': 'start',
                    'y-alignment': 'text-before-edge',
                    'fill': '#ffffff',
                    'font-size': 11,
                    'font-family': 'Roboto',
                    'transform': 'translate(4,4)'

                },
                '.activity-element-body-text': {
                    'ref': '.activity-element-body-rect',
                    'ref-y': 5,
                    'ref-x': 10,
                    'text-anchor': 'start',
                    'y-alignment': 'text-before-edge',
                    'fill': '#000000',
                    'font-size': 12,
                    'font-family': 'monospace',
                    'width': 200


                },
                '.activity-element-name-text': {
                    'ref': '.activity-element-name-rect',
                    'ref-y': .5,
                    'ref-x': .5,
                    'text-anchor': 'middle',
                    'y-alignment': 'middle',
                    'fill': '#ffffff',
                    'font-size': 14,
                    'font-family': 'Roboto',

                }
            },

            expanded: true,
            hidden: false,
            canHaveChildren: true,
            offsetY: 0,

            values: {
                xType: '[block type]',
                comment: '',
                body: [],
            }

        }, joint.shapes.basic.Generic.prototype.defaults),

        initialize: function () {
            this.updateRectangles();
            joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);

        },

        getValues: function () {
            return this.get("values");
        },

        setToValue: function (value, path) {
            obj = this.getValues();
            path = path.split('.');
            for (i = 0; i < path.length - 1; i++) {
                obj = obj[path[i]];
            }
            obj[path[i]] = value;
            this.updateRectangles();
            this.trigger("uml-update");
        },

        getOffsetY: function () {
            return this.get("offsetY");
        },

        getOffsetX: function () {
            return this.getAncestors().length * 10 + 10;

        },

        getHeight: function () {
            return 35;
        },

        getDescription: function () {
            return this.getValues().xType;
        },

        updateRectangles: function () {
            var attrs = this.get('attrs');

            if (this.get("hidden")) {
                // hack cattivissimo per evitare creazioni di nuovi oggetti e nascondere l'oggetto
                //this.attributes.position = {x: -9999, y: -9999};
                attrs['.activity'].visibility = "hidden";
            }
            else {
                attrs['.activity'].visibility = "visible";
                this.attributes.position = {x: this.getOffsetX(), y: this.getOffsetY()};

                if (this.getValues().comment.length > 20) {
                    var text = "\n" + this.getValues().comment.slice(0, 20) + "...";
                } else {
                    var text = "\n" + this.getValues().comment;
                }

                attrs['.activity-toggle'].transform = 'translate(180,0)';
                attrs['.activity-toggle'].height = 35;
                attrs['.activity-toggle'].width = 20;
                attrs['.activity-element-name-text'].text = text;
                function chunk(str, n) {
                    var ret = [];
                    var i;
                    var len;

                    for (i = 0, len = str.length; i < len; i += n) {
                        ret.push(str.substr(i, n))
                    }

                    return ret;
                };
                attrs['.activity-element-body-text'].text = chunk(this.getDescription().slice(0, 100), 25).join('\n');
                attrs['.activity-element-type-text'].text = this.getValues().xType;
                attrs['.activity-element-type-text'].transform = 'translate(-180,0)';
                attrs['.activity-element-name-rect'].height = this.getHeight();


                if (this.get("expanded")) {
                    var embedded = this.getEmbeddedCells({deep: true});
                    var h = 0;
                    for (i = 0; i < embedded.length; i++) {
                        if (embedded[i].get("hidden")) {
                            h += 0;
                        }
                        if (!embedded[i].get("hidden") && embedded[i].get("expanded")) {
                            h += 100;
                        }
                        if (!embedded[i].get("hidden") && !embedded[i].get("expanded")) {
                            h += 50;
                        }
                    }
                    if (h != 0) {
                        attrs['.activity-element-body-rect'].height = 35 + 20 + h;
                    } else {
                        attrs['.activity-element-body-rect'].height = 35 + 20;
                    }
                } else {
                    attrs['.activity-element-body-rect'].height = 0;
                }
                attrs['.activity-element-name-rect'].transform = 'translate(0,0)';
                attrs['.activity-element-body-rect'].transform = 'translate(0,35)';
            }

            attrs['.activity-element-type-rect'].height =
                attrs['.activity-element-name-rect'].height
                + attrs['.activity-element-body-rect'].height;

            attrs['.activity-element-type-rect'].width = 5;
        }
    });


    /**
     * @classdesc `ActivityDiagramElementView` is the view for
     * an `ActivityDiagramElement` object.
     *
     * @module client.model.celltypes.activity
     * @name ActivityDiagramElementView
     * @class ActivityDiagramElementView
     * @extends {joint.dia.ElementView}
     */
    celltypes.activity.ActivityDiagramElementView = joint.dia.ElementView.extend({

        initialize: function () {
            joint.dia.ElementView.prototype.initialize.apply(this, arguments);

            this.listenTo(this.model, 'uml-update', function () {
                this.update();
                this.resize();
            });
        },

        events: {
            'mousedown .activity-toggle': 'toggle'
        },

        renderTools: function () {

            var toolMarkup = this.model.toolMarkup || this.model.get('toolMarkup');
            console.log("markup:", toolMarkup);
            if (toolMarkup) {

                var nodes = joint.V(toolMarkup);
                console.log("el:", joint.V(this.el));
                joint.V(this.el).append(nodes);

            }

            return this;
        },

        render: function () {
            joint.dia.ElementView.prototype.render.apply(this, arguments);

            this.renderTools();
            this.update();
            return this;
        },

        toggle: function () {
            this.model.set("expanded", !this.model.get("expanded"));
            this.model.updateRectangles();
            this.update(); // ecco cosa dovevi fare, le cose funzionavano già
        }
    });


    /**
     * @classdesc `HxCustom` represents custom code
     * by the user.
     *
     * @module client.model.celltypes.activity
     * @name HxCustom
     * @class HxCustom
     * @extends {celltypes.activity.ActivityDiagramElement}
     */
    celltypes.activity.HxCustom = celltypes.activity.ActivityDiagramElement.extend({
        defaults: _.defaultsDeep({

            type: 'activity.HxCustom',

            attrs: {
                rect: {'width': 200},
                '.activity-element-name-rect': {
                    'stroke': 'black', 'stroke-width': 0, 'fill': '#7c189d'
                },
                '.activity-element-type-rect': {'stroke': '#7c189d', 'stroke-width': 0, 'fill': '#7c189d'},
            },

            values: {
                xType: 'Custom',
                code: ""
            },

            canHaveChildren: false,

        }, celltypes.activity.ActivityDiagramElement.prototype.defaults),

        initialize: function () {
            celltypes.activity.ActivityDiagramElement.prototype.initialize.apply(this, arguments);
        },

        getDescription: function () {
            return this.getValues().code;
        }
    });


    /**
     * @classdesc `HxElse` represents the alternative
     * to a conditional statement.
     *
     * @module client.model.celltypes.activity
     * @name HxElse
     * @class HxElse
     * @extends {celltypes.activity.ActivityDiagramElement}
     */
    celltypes.activity.HxElse = celltypes.activity.ActivityDiagramElement.extend({
        defaults: _.defaultsDeep({

            type: 'activity.HxElse',

            attrs: {
                rect: {'width': 200},
                '.activity-element-name-rect': {
                    'stroke': 'black', 'stroke-width': 0, 'fill': '#00701d'
                },
                '.activity-element-type-rect': {'stroke': '#00701d', 'stroke-width': 0, 'fill': '#00701d'},

            },
            values: {
                xType: 'Else'
            }
        }, celltypes.activity.ActivityDiagramElement.prototype.defaults),

        initialize: function () {
            celltypes.activity.ActivityDiagramElement.prototype.initialize.apply(this, arguments);
        },

        getDescription: function () {
            return "";
        }
    });


    /**
     * @classdesc `HxFor` represents an iteration
     * over a sequence of statements.
     *
     * @module client.model.celltypes.activity
     * @name HxFor
     * @class HxFor
     * @extends {celltypes.activity.ActivityDiagramElement}
     */
    celltypes.activity.HxFor = celltypes.activity.ActivityDiagramElement.extend({
        defaults: _.defaultsDeep({

            type: 'activity.HxFor',

            attrs: {
                rect: {'width': 200},

                '.activity-element-name-rect': {
                    'stroke': 'black', 'stroke-width': 0, 'fill': '#ed341c'
                },

                '.activity-element-type-rect': {'stroke': '#ed341c', 'stroke-width': 1, 'fill': '#ed341c'},
            },

            values: {
                xType: 'For',
                initialization: "",
                termination: "",
                increment: ""
            }

        }, celltypes.activity.ActivityDiagramElement.prototype.defaults),

        initialize: function () {
            celltypes.activity.ActivityDiagramElement.prototype.initialize.apply(this, arguments);
        },

        getDescription: function () {
            return this.getValues().initialization + ";" + this.getValues().termination + ";" + this.getValues().increment;
        }
    });


    /**
     * @classdesc `HxIf` represents a conditional
     * statement.
     *
     * @module client.model.celltypes.activity
     * @name HxIf
     * @class HxIf
     * @extends {celltypes.activity.ActivityDiagramElement}
     */
    celltypes.activity.HxIf = celltypes.activity.ActivityDiagramElement.extend({
        defaults: _.defaultsDeep({

            type: 'activity.HxIf',

            attrs: {
                rect: {'width': 200},
                '.activity-element-name-rect': {
                    'stroke': 'black', 'stroke-width': 0, 'fill': '#15b13e'
                },
                '.activity-element-type-rect': {'stroke': '#15b13e', 'stroke-width': 0, 'fill': '#15b13e'},
            },

            values: {
                xType: 'If',
                condition: ""
            }

        }, celltypes.activity.ActivityDiagramElement.prototype.defaults),

        initialize: function () {
            celltypes.activity.ActivityDiagramElement.prototype.initialize.apply(this, arguments);
        },

        getDescription: function () {
            return "if (" + this.getValues().condition + ")";
        }
    });


    /**
     * @classdesc `HxVariable` represents a variable
     * declaration, initialization or an operation
     * on it.
     *
     * @module client.model.celltypes.activity
     * @name HxVariable
     * @class HxVariable
     * @extends {celltypes.activity.ActivityDiagramElement}
     */
    celltypes.activity.HxVariable = celltypes.activity.ActivityDiagramElement.extend({
        defaults: _.defaultsDeep({

            type: 'activity.HxVariable',

            attrs: {
                rect: {'width': 200},

                '.activity-element-name-rect': {
                    'stroke': 'black', 'stroke-width': 0, 'fill': '#edae1c'
                },
                '.activity-element-type-rect': {'stroke': '#edae1c', 'stroke-width': 1, 'fill': '#edae1c'},
            },

            values: {
                xType: 'Variabile',
                name: "",
                type: "",
                operation: "",
                value: ""
            },

            canHaveChildren: false,

        }, celltypes.activity.ActivityDiagramElement.prototype.defaults),

        initialize: function () {
            celltypes.activity.ActivityDiagramElement.prototype.initialize.apply(this, arguments);
        },

        getDescription: function () {
            return this.getValues().type + " " + this.getValues().name + this.getValues().operation + this.getValues().value;
        }
    });


    /**
     * @classdesc `HxReturn` represents a statement
     * for exiting a method and returning to the
     * caller.
     *
     * @module client.model.celltypes.activity
     * @name HxReturn
     * @class HxReturn
     * @extends {celltypes.activity.ActivityDiagramElement}
     */
    celltypes.activity.HxReturn = celltypes.activity.ActivityDiagramElement.extend({
        defaults: _.defaultsDeep({

            type: 'activity.HxReturn',

            attrs: {
                rect: {'width': 200},

                '.activity-element-name-rect': {
                    'stroke': 'black', 'stroke-width': 0, 'fill': '#ed841c'
                },
                '.activity-element-type-rect': {'stroke': '#ed841c', 'stroke-width': 0, 'fill': '#ed841c'},
            },

            values: {
                xType: 'Return',
                value: ""
            },

            canHaveChildren: false,

        }, celltypes.activity.ActivityDiagramElement.prototype.defaults),

        initialize: function () {
            celltypes.activity.ActivityDiagramElement.prototype.initialize.apply(this, arguments);
        },

        getDescription: function () {
            return "return " + this.getValues().value;
        }
    });


    /**
     * @classdesc `HxWhile` represents conditional
     * loop over a sequence a statements.
     *
     * @module client.model.celltypes.activity
     * @name HxWhile
     * @class HxWhile
     * @extends {celltypes.activity.ActivityDiagramElement}
     */
    celltypes.activity.HxWhile = celltypes.activity.ActivityDiagramElement.extend({
        defaults: _.defaultsDeep({

            type: 'activity.HxWhile',

            attrs: {
                rect: {'width': 200},

                '.activity-element-name-rect': {
                    'stroke': 'black', 'stroke-width': 0, 'fill': '#157b92'
                },
                '.activity-element-type-rect': {'stroke': '#157b92', 'stroke-width': 0, 'fill': '#157b92'},
            },

            values: {
                xType: 'While',
                condition: ""
            }

        }, celltypes.activity.ActivityDiagramElement.prototype.defaults),

        initialize: function () {
            celltypes.activity.ActivityDiagramElement.prototype.initialize.apply(this, arguments);
        },

        getDescription: function () {
            return "while (" + this.getValues().condition + ")";
        }
    });

    return celltypes;
});
