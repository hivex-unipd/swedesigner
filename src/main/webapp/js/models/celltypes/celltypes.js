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
            //non fare niente sulla classe astratta
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
     * each`ClassDiagramElement`.
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
         *///
        events: {
            'mousedown .togglemethods': 'toggleMethods',
            'mousedown .toggleattributes': 'toggleAttributes'
        },

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
                    'stroke': 'black',
                    'stroke-width': 0,
                    'fill': '#4db6ac'
                },
                '.uml-class-attrs-rect': {
                    'stroke': 'black',
                    'stroke-width': 0,
                    'fill': '#ffffff',
                    'expanded': 'false'
                },
                '.uml-class-methods-rect': {
                    'stroke': 'black',
                    'stroke-width': 0,
                    'fill': '#eeeeee',
                    'expanded': 'false'
                },
                '.uml-class-divider-rect': {
                    'stroke': 'black',
                    'stroke-width': 1,
                    'fill': 'black'
                },

                '.uml-class-name-text': {
                    'ref': '.uml-class-name-rect',
                    'ref-y': .5,
                    'ref-x': .5,
                    'text-anchor': 'middle',
                    'y-alignment': 'middle',
                    'fill': 'white',
                    'font-size': 16,
                    'font-family': 'Roboto'
                },
                '.uml-class-attrs-text': {
                    'ref': '.uml-class-attrs-rect',
                    'ref-y': 5,
                    'ref-x': 5,
                    'fill': '#222222',
                    'font-size': 12,
                    'font-family': 'monospace'
                },
                '.uml-class-methods-text': {
                    'ref': '.uml-class-methods-rect',
                    'ref-y': 5,
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
            var rectHeight = 1 * 15 + 1;
            attrs['.uml-class-name-text'].text = rects[0].text;
            attrs['.uml-class-name-rect'].height = rectHeight;
            attrs['.uml-class-name-rect'].transform = 'translate(0,' + offsetY + ')';
            offsetY += rectHeight + 1;
            rectHeight = _.isArray(rects[1].text) ? rects[1].text.length * 15 + 1 : 1 * 15 + 1;
            attrs['.uml-class-attrs-text'].text = _.isArray(rects[1].text) ? rects[1].text.map(function (e) {
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
                        case "package":
                            vis = "#";
                            break;
                    }
                    return vis + " " + e.name + ":" + e.type;
                }).join('\n') : rects[1].text;
            attrs['.uml-class-attrs-rect'].height = rectHeight;
            attrs['.uml-class-attrs-rect'].transform = 'translate(0,' + offsetY + ')';
            offsetY += rectHeight + 1;
            rectHeight = _.isArray(rects[2].text) ? rects[2].text.length * 15 + 1 : 1 * 15 + 1;

            attrs['.uml-class-methods-text'].text = _.isArray(rects[2].text) ? rects[2].text.map(function (e) {
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
                        case "package":
                            vis = "#";
                            break;
                    }
                    var params = e.parameters.map(function (f) {
                        return f.name;
                    }).join(",");
                    return vis + " " + e.name + "(" + params + ")" + ":" + e.returnType;
                }).join('\n') : rects[2].text;
            attrs['.uml-class-methods-rect'].height = rectHeight;
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
                visibility: "",
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
                visibility: "",
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
        },
        deleteAttribute: function (ind) {
            this.getValues().attributes.splice(ind, 1);
        },
        deleteMethod: function (ind) {
            this.getValues().methods.splice(ind, 1);
        }
    });


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

                '.uml-class-name-rect': {'stroke': 'black', 'stroke-width': 0, 'fill': '#4db6ac'},

                '.uml-class-methods-rect': {
                    'stroke': 'black',
                    'stroke-width': 0,
                    'fill': '#eeeeee',
                    'expanded': 'false'
                },
                '.uml-class-name-text': {
                    'ref': '.uml-class-name-rect',
                    'ref-y': .5,
                    'ref-x': .5,
                    'text-anchor': 'middle',
                    'y-alignment': 'middle',
                    'fill': 'white',
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
            attrs['.uml-class-name-text'].text = ['<<Interface>>', rects[0].text].join('\n');
            attrs['.uml-class-name-rect'].height = rectHeight;
            attrs['.uml-class-name-rect'].transform = 'translate(0,' + offsetY + ')';
            offsetY += rectHeight + 1;
            rectHeight = _.isArray(rects[1].text) ? rects[1].text.length * 15 + 1 : 1 * 15 + 1;

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
                        case "package":
                            vis = "#";
                            break;
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
                visibility: "",
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
        }
    });

    celltypes.class.HxComment = joint.shapes.basic.TextBlock.extend({
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

    celltypes.class.HxGeneralization = celltypes.class.ClassDiagramLink.extend({
        defaults: _.defaultsDeep({
            type: 'class.HxGeneralization',
            attrs: {'.marker-target': {d: 'M 20 0 L 0 10 L 20 20 z', fill: 'white'}}
        }, celltypes.class.ClassDiagramLink.prototype.defaults)
    });

    celltypes.class.HxImplementation = celltypes.class.ClassDiagramLink.extend({
        defaults: _.defaultsDeep({
            type: 'class.HxImplementation',
            attrs: {
                '.marker-target': {d: 'M 20 0 L 0 10 L 20 20 z', fill: 'white'},
                '.connection': {'stroke-dasharray': '3,3'}
            }
        }, celltypes.class.ClassDiagramLink.prototype.defaults)
    });

    celltypes.class.HxAssociation = celltypes.class.ClassDiagramLink.extend({

        defaults: _.defaultsDeep({
            type: 'class.HxAssociation',
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

    celltypes.activity.ActivityDiagramElement = joint.shapes.basic.Generic.extend({
        markup: [
            '<g class="activity">',
            '<rect class="activity-element-name-rect"/>',
            '<text class="activity-element-name-text"/>',
            '<rect class="activity-element-body-rect"/>',
            '<rect class="activity-toggle"/>',

            '</g>'
        ].join(''),
        defaults: _.defaultsDeep({

            type: 'activity.ActivityDiagramElement',

            attrs: {
                rect: {'width': 200},


                '.activity-toggle': {'fill': '#eedd99'},
                '.activity-element-name-rect': {'stroke': 'black', 'stroke-width': 0, 'fill': '#4db6ac'},
                '.activity-element-body-rect': {'stroke': 'black', 'stroke-width': 2, 'fill': '#ffffff'},

                '.activity': {'stroke': 'black', 'stroke-width': 0, 'fill': '#ffffff'},

                '.activity-element-name-text': {
                    'ref': '.activity-element-name-rect',
                    'ref-y': .5,
                    'ref-x': .5,
                    'text-anchor': 'middle',
                    'y-alignment': 'middle',
                    'fill': 'white',
                    'font-size': 16,
                    'font-family': 'Roboto'
                },

            },

            expanded: true,
            hidden: false,
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
            return this.getAncestors().length * 50;

        },
        getHeight: function () {
            return 35;
        },
        updateRectangles: function () {
            var attrs = this.get('attrs');

            if (this.get("hidden")) {
                // hack cattivissimo per evitare creazioni di nuovi oggetti e nascondere l'oggetto
                this.attributes.position = {x: -9999, y: -9999};
            }
            else {

                this.attributes.position = {x: this.getOffsetX(), y: this.getOffsetY()};

                if (this.getValues().comment.length > 20) {
                    var text = this.getValues().xType + "\n" + this.getValues().comment.slice(0, 20) + "...";

                }
                else {
                    var text = this.getValues().xType + "\n" + this.getValues().comment;
                }

                attrs['.activity-toggle'].transform = 'translate(180,0)';
                attrs['.activity-toggle'].height = 35;
                attrs['.activity-toggle'].width = 20;
                attrs['.activity-element-name-text'].text = text;
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
                    }
                    else {
                        attrs['.activity-element-body-rect'].height = 35 + 20;
                    }
                }
                else {
                    attrs['.activity-element-body-rect'].height = 0;
                }
                attrs['.activity-element-name-rect'].transform = 'translate(0,0)';
                attrs['.activity-element-body-rect'].transform = 'translate(0,35)';

            }
        }

    });

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
        toggle: function () {
            this.model.set("expanded", !this.model.get("expanded"));
            this.model.updateRectangles();
            this.update(); // ecco cosa dovevi fare, le cose funzionavano già

        }
    });

    celltypes.activity.HxCustom = celltypes.activity.ActivityDiagramElement.extend({
        defaults: _.defaultsDeep({

            type: 'activity.HxCustom',

            attrs: {
                rect: {'width': 200},


                '.activity-toggle': {'fill': '#eedd99'},
                '.activity-element-name-rect': {'stroke': 'black', 'stroke-width': 0, 'fill': '#4db6ac'},
                '.activity-element-body-rect': {'stroke': 'black', 'stroke-width': 2, 'fill': '#ffffff'},

                '.activity': {'stroke': 'black', 'stroke-width': 0, 'fill': '#ffffff'},

                '.activity-element-name-text': {
                    'ref': '.activity-element-name-rect',
                    'ref-y': .5,
                    'ref-x': .5,
                    'text-anchor': 'middle',
                    'y-alignment': 'middle',
                    'fill': 'white',
                    'font-size': 16,
                    'font-family': 'Roboto'
                },

            },

            values: {
                xType: 'Custom',
                code: ""

            }


        }, celltypes.activity.ActivityDiagramElement.prototype.defaults),
        initialize: function () {
            celltypes.activity.ActivityDiagramElement.prototype.initialize.apply(this, arguments);
        }
    });
    celltypes.activity.HxElse = celltypes.activity.ActivityDiagramElement.extend({
        defaults: _.defaultsDeep({

            type: 'activity.HxElse',

            attrs: {
                rect: {'width': 200},


                '.activity-toggle': {'fill': '#eedd99'},
                '.activity-element-name-rect': {'stroke': 'black', 'stroke-width': 0, 'fill': '#4db6ac'},
                '.activity-element-body-rect': {'stroke': 'black', 'stroke-width': 2, 'fill': '#ffffff'},

                '.activity': {'stroke': 'black', 'stroke-width': 0, 'fill': '#ffffff'},

                '.activity-element-name-text': {
                    'ref': '.activity-element-name-rect',
                    'ref-y': .5,
                    'ref-x': .5,
                    'text-anchor': 'middle',
                    'y-alignment': 'middle',
                    'fill': 'white',
                    'font-size': 16,
                    'font-family': 'Roboto'
                },

            },
            values: {
                xType: 'Else'

            }
        }, celltypes.activity.ActivityDiagramElement.prototype.defaults),
        initialize: function () {
            celltypes.activity.ActivityDiagramElement.prototype.initialize.apply(this, arguments);
        }
    });
    celltypes.activity.HxFor = celltypes.activity.ActivityDiagramElement.extend({
        defaults: _.defaultsDeep({

            type: 'activity.HxFor',

            attrs: {
                rect: {'width': 200},


                '.activity-toggle': {'fill': '#eedd99'},
                '.activity-element-name-rect': {'stroke': 'black', 'stroke-width': 0, 'fill': '#4db6ac'},
                '.activity-element-body-rect': {'stroke': 'black', 'stroke-width': 2, 'fill': '#ffffff'},

                '.activity': {'stroke': 'black', 'stroke-width': 0, 'fill': '#ffffff'},

                '.activity-element-name-text': {
                    'ref': '.activity-element-name-rect',
                    'ref-y': .5,
                    'ref-x': .5,
                    'text-anchor': 'middle',
                    'y-alignment': 'middle',
                    'fill': 'white',
                    'font-size': 16,
                    'font-family': 'Roboto'
                },

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
        }
    });
    celltypes.activity.HxIf = celltypes.activity.ActivityDiagramElement.extend({
        defaults: _.defaultsDeep({

            type: 'activity.HxIf',

            attrs: {
                rect: {'width': 200},


                '.activity-toggle': {'fill': '#eedd99'},
                '.activity-element-name-rect': {'stroke': 'black', 'stroke-width': 0, 'fill': '#4db6ac'},
                '.activity-element-body-rect': {'stroke': 'black', 'stroke-width': 2, 'fill': '#ffffff'},

                '.activity': {'stroke': 'black', 'stroke-width': 0, 'fill': '#ffffff'},

                '.activity-element-name-text': {
                    'ref': '.activity-element-name-rect',
                    'ref-y': .5,
                    'ref-x': .5,
                    'text-anchor': 'middle',
                    'y-alignment': 'middle',
                    'fill': 'white',
                    'font-size': 16,
                    'font-family': 'Roboto'
                },

            },

            values: {
                xType: 'If',
                condition: ""

            }


        }, celltypes.activity.ActivityDiagramElement.prototype.defaults),
        initialize: function () {
            celltypes.activity.ActivityDiagramElement.prototype.initialize.apply(this, arguments);
        }
    });
    celltypes.activity.HxVariable = celltypes.activity.ActivityDiagramElement.extend({
        defaults: _.defaultsDeep({

            type: 'activity.HxVariable',

            attrs: {
                rect: {'width': 200},


                '.activity-toggle': {'fill': '#eedd99'},
                '.activity-element-name-rect': {'stroke': 'black', 'stroke-width': 0, 'fill': '#4db6ac'},
                '.activity-element-body-rect': {'stroke': 'black', 'stroke-width': 2, 'fill': '#ffffff'},

                '.activity': {'stroke': 'black', 'stroke-width': 0, 'fill': '#ffffff'},

                '.activity-element-name-text': {
                    'ref': '.activity-element-name-rect',
                    'ref-y': .5,
                    'ref-x': .5,
                    'text-anchor': 'middle',
                    'y-alignment': 'middle',
                    'fill': 'white',
                    'font-size': 16,
                    'font-family': 'Roboto'
                },

            },

            values: {
                xType: 'Variabile',
                name: "",
                type: "",
                operation: "",
                value: ""

            }


        }, celltypes.activity.ActivityDiagramElement.prototype.defaults),
        initialize: function () {
            celltypes.activity.ActivityDiagramElement.prototype.initialize.apply(this, arguments);
        }
    });
    celltypes.activity.HxReturn = celltypes.activity.ActivityDiagramElement.extend({
        defaults: _.defaultsDeep({

            type: 'activity.HxReturn',

            attrs: {
                rect: {'width': 200},


                '.activity-toggle': {'fill': '#eedd99'},
                '.activity-element-name-rect': {'stroke': 'black', 'stroke-width': 0, 'fill': '#4db6ac'},
                '.activity-element-body-rect': {'stroke': 'black', 'stroke-width': 2, 'fill': '#ffffff'},

                '.activity': {'stroke': 'black', 'stroke-width': 0, 'fill': '#ffffff'},

                '.activity-element-name-text': {
                    'ref': '.activity-element-name-rect',
                    'ref-y': .5,
                    'ref-x': .5,
                    'text-anchor': 'middle',
                    'y-alignment': 'middle',
                    'fill': 'white',
                    'font-size': 16,
                    'font-family': 'Roboto'
                },

            },

            values: {
                xType: 'Return',
                value: ""

            }


        }, celltypes.activity.ActivityDiagramElement.prototype.defaults),
        initialize: function () {
            celltypes.activity.ActivityDiagramElement.prototype.initialize.apply(this, arguments);
        }
    });
    celltypes.activity.HxWhile = celltypes.activity.ActivityDiagramElement.extend({
        defaults: _.defaultsDeep({

            type: 'activity.HxWhile',

            attrs: {
                rect: {'width': 200},


                '.activity-toggle': {'fill': '#eedd99'},
                '.activity-element-name-rect': {'stroke': 'black', 'stroke-width': 0, 'fill': '#4db6ac'},
                '.activity-element-body-rect': {'stroke': 'black', 'stroke-width': 2, 'fill': '#ffffff'},

                '.activity': {'stroke': 'black', 'stroke-width': 0, 'fill': '#ffffff'},

                '.activity-element-name-text': {
                    'ref': '.activity-element-name-rect',
                    'ref-y': .5,
                    'ref-x': .5,
                    'text-anchor': 'middle',
                    'y-alignment': 'middle',
                    'fill': 'white',
                    'font-size': 16,
                    'font-family': 'Roboto'
                },

            },

            values: {
                xType: 'While',
                condition: ""

            }


        }, celltypes.activity.ActivityDiagramElement.prototype.defaults),
        initialize: function () {
            celltypes.activity.ActivityDiagramElement.prototype.initialize.apply(this, arguments);
        }
    });
    return celltypes;
});