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
         * @name ClassDiagramElement#executemethod
         * @function
         * @param {function} met the method to be executed
         */
        executemethod: function (met) {
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
                console.log("update interfaccia");
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
            'mousedown .togglemethods': 'togglemethods',
            'mousedown .toggleattributes': 'toggleattributes'
        },

        /**
         * Toggles the display of the class attributes.
         * @name ClassDiagramElementView#toggleattributes
         * @function
         */
        toggleattributes: function () { //non so se sia giusto tenerli qua...boh vedremo
            this.model.set("attributesexpanded", !this.model.get("attributesexpanded"));
            _.each(this.model.graph.getConnectedLinks(this.model),function(){
                this.reparent();
            });
            this.model.updateRectangles();
            this.update(); // ecco cosa dovevi fare, le cose funzionavano già
        },

        /**
         * Toggles the display of the class methods.
         * @name ClassDiagramElementView#togglemethods
         * @function
         */
        togglemethods: function () {
            this.model.set("methodsexpanded", !this.model.get("methodsexpanded"));
            this.model.updateRectangles();
            this.update(); // ecco cosa dovevi fare, le cose funzionavano già
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

            attributesexpanded: false,

            methodsexpanded: false,

            values: {
                name: "classedefault",
                attributes: [
                    {
                        name: "variabileDefault",
                        type: "TipoDefault"
                    },
                    {
                        name: "variabileDefault2",
                        type: "TipoDefault2"
                    }
                ],
                methods: [
                    {
                        name: "metodoDefault",
                        visibility: "public",
                        id: joint.util.uuid(),
                        returntype: "tipoRitorno",
                        parameters: ["param1:int"]
                    }
                ]
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
                    text: this.get('attributesexpanded') ? this.getValues().attributes : "Attributes (click to expand)"
                },
                {
                    type: 'methods',
                    text: this.get('methodsexpanded') ? this.getValues().methods : "Methods (click to expand)"
                }
            ];
            /*_.each(rects, function (rect) {

             var lines = _.isArray(rect.text) ? rect.text : [rect.text];
             //console.log(lines);
             var rectHeight = lines.length * 15 + 1;

             attrs['.uml-class-' + rect.type + '-text'].text = lines.map(function (e) {
             //console.log(e);
             if (e.hasOwnProperty('name')) {
             return e.name + ":" + e.value;
             }
             else {
             return e;
             }
             }).join('\n');
             attrs['.uml-class-' + rect.type + '-rect'].height = rectHeight;
             attrs['.uml-class-' + rect.type + '-rect'].transform = 'translate(0,' + offsetY + ')';

             offsetY += rectHeight + 1;

             });*/
            var rectHeight = 1 * 15 + 1;
            attrs['.uml-class-name-text'].text = rects[0].text;
            attrs['.uml-class-name-rect'].height = rectHeight;
            attrs['.uml-class-name-rect'].transform = 'translate(0,' + offsetY + ')';
            offsetY += rectHeight + 1;
            console.log(rects[1].text.length);
            rectHeight = _.isArray(rects[1].text) ? rects[1].text.length * 15 + 1 : 1 * 15 + 1;
            console.log(rects[1].text);
            attrs['.uml-class-attrs-text'].text = _.isArray(rects[1].text) ? rects[1].text.map(function (e) {
                    return e.name + ":" + e.type;
                }).join('\n') : rects[1].text;
            attrs['.uml-class-attrs-rect'].height = rectHeight;
            attrs['.uml-class-attrs-rect'].transform = 'translate(0,' + offsetY + ')';
            offsetY += rectHeight + 1;
            console.log(rects[2].text.length);
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
                    }
                    return vis + " " + e.name + ":" + e.returntype;
                }).join('\n') : rects[2].text;
            attrs['.uml-class-methods-rect'].height = rectHeight;
            attrs['.uml-class-methods-rect'].transform = 'translate(0,' + offsetY + ')';

            celltypes.class.ClassDiagramElement.prototype.updateRectangles.apply(this, arguments);
        },

        /**
         * Adds a new method to the class represented by the cell.
         * @name HxClass#addmethod
         * @function
         */
        addmethod: function () {
            this.getValues().methods.push({
                name: "",
                visibility: "",
                id: joint.util.uuid(),
                returntype: "",
                parameters: []
            });
        },

        /**
         * Adds a new attribute to the class represented by the cell.
         * @name HxClass#addmethod
         * @function
         */
        addattribute: function () {
            this.getValues().attributes.push({
                name: "",
                type: ""
            });
        },

        /**
         * Adds a new argument to the `ind`th method in
         * the class represented by the cell.
         * @name HxClass#addmethod
         * @function
         * @param {number} ind the method's position
         */
        addparameter: function (ind) {
            this.getValues().methods[ind].parameters.push("");
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
            size:{width: 100, height: 100},
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

            methodsexpanded: false,


            values: {
                name: "interfacciadefault",
                methods: [
                    {
                        name: "metodoDefault",
                        visibility: "public",
                        id: joint.util.uuid(),
                        returntype: "tipoRitorno",
                        parameters: ["param1:int"]
                    }
                ]

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
                    text: this.get('methodsexpanded') ? this.getValues().methods : "Methods (click to expand)"
                }
            ];
            /*_.each(rects, function (rect) {

             var lines = _.isArray(rect.text) ? rect.text : [rect.text];
             //console.log(lines);
             var rectHeight = lines.length * 15 + 1;

             attrs['.uml-class-' + rect.type + '-text'].text = lines.map(function (e) {
             //console.log(e);
             if (e.hasOwnProperty('name')) {
             return e.name + ":" + e.value;
             }
             else {
             return e;
             }
             }).join('\n');
             attrs['.uml-class-' + rect.type + '-rect'].height = rectHeight;
             attrs['.uml-class-' + rect.type + '-rect'].transform = 'translate(0,' + offsetY + ')';

             offsetY += rectHeight + 1;

             });*/
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
                    }
                    return vis + " " + e.name + ":" + e.returntype;
                }).join('\n') : rects[1].text;
            attrs['.uml-class-methods-rect'].height = rectHeight;
            attrs['.uml-class-methods-rect'].transform = 'translate(0,' + offsetY + ')';

            celltypes.class.ClassDiagramElement.prototype.updateRectangles.apply(this, arguments);
        },
        addmethod: function () {
            this.getValues().methods.push({
                name: "",
                visibility: "",
                id: joint.util.uuid(),
                returntype: "",
                parameters: []
            });
        },
        addparameter: function (ind) {
            this.getValues().methods[ind].parameters.push("");
        }
    });

    celltypes.class.ClassDiagramLink = joint.dia.Link.extend({
        defaults: _.defaultsDeep({
            type: 'class.ClassDiagramLink',
            source:{x:30,y:30},
            target:{x:150,y:120}
        },joint.dia.Link.prototype.defaults),
        initialize:function(){
            joint.dia.Link.prototype.initialize.apply(this,arguments);
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
        },celltypes.class.ClassDiagramLink.prototype.defaults)
    });

    celltypes.class.HxImplementation = celltypes.class.ClassDiagramLink.extend({
        defaults: _.defaultsDeep({
            type: 'class.HxImplementation',
            attrs: {
                '.marker-target': {d: 'M 20 0 L 0 10 L 20 20 z', fill: 'white'},
                '.connection': {'stroke-dasharray': '3,3'}
            }
        },celltypes.class.ClassDiagramLink.prototype.defaults)
    });

    /*

     per ora non servono ma nel caso ci sono

     celltypes.class.HxAggregation = celltypes.class.ClassDiagramLink.extend({
     defaults: {
     type: 'class.HxAggregation',
     attrs: { '.marker-target': { d: 'M 40 10 L 20 20 L 0 10 L 20 0 z', fill: 'white' }}
     }
     });

     celltypes.class.HxComposition = celltypes.class.ClassDiagramLink.extend({
     defaults: {
     type: 'class.HxComposition',
     attrs: { '.marker-target': { d: 'M 40 10 L 20 20 L 0 10 L 20 0 z', fill: 'black' }}
     }
     });

     */

    celltypes.class.HxAssociation = celltypes.class.ClassDiagramLink.extend({

        defaults:_.defaultsDeep({
            type: 'class.HxAssociation',
            labels: [
                {
                    position: 25,
                    attrs: {
                        text: {
                            text: ''
                        }
                    }
                }
            ],
            values: {
                pos: "destra",
                card: "default"
            }
        },celltypes.class.ClassDiagramLink.prototype.defaults),
        updatelabel: function () {

            this.label(0, {
                position:this.getpos(),
                attrs:
                    {

                        text:
                            {
                                text: this.getcard()
                            }
                    }
            });
        },
        getcard: function () {
            return this.get('values').card;
        },
        getpos: function(){
            if(this.get("values").pos=="target"){
                return -25;
            }
            else{
                return 25;
            }
            //return Number(this.get("values").pos);
        },
        initialize: function () {
            this.updatelabel();
            celltypes.class.ClassDiagramLink.prototype.initialize.apply(this,arguments);

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


            index: 0,
            expanded: true,
            hidden: false,
            offsetY: 0,

            values: {
                xtype: '[block type]',
                comment: '[new block]',
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
                    var text = this.getValues().xtype + "\n" + this.getValues().comment.slice(0, 20) + "...";

                }
                else {
                    var text = this.getValues().xtype + "\n" + this.getValues().comment;
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

    celltypes.activity.HxAssignement = celltypes.activity.ActivityDiagramElement.extend({
        defaults: _.defaultsDeep({

            type: 'activity.HxAssignement',

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
                xtype: "Assegnazione",
                name: "",
                operation: "",
                value: ""
            }


        }, celltypes.activity.ActivityDiagramElement.prototype.defaults),
        initialize: function () {
            celltypes.activity.ActivityDiagramElement.prototype.initialize.apply(this, arguments);
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
                xtype: 'Custom',
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
                xtype: 'Else'

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
                xtype: 'For',
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
                xtype: 'If',
                condition: ""

            }


        }, celltypes.activity.ActivityDiagramElement.prototype.defaults),
        initialize: function () {
            celltypes.activity.ActivityDiagramElement.prototype.initialize.apply(this, arguments);
        }
    });
    celltypes.activity.HxInitialization = celltypes.activity.ActivityDiagramElement.extend({
        defaults: _.defaultsDeep({

            type: 'activity.HxInitialization',

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
                xtype: 'Inizializzazione',
                name: "",
                type: "",
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
                xtype: 'Return',
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
                xtype: 'While',
                condition: ""

            }


        }, celltypes.activity.ActivityDiagramElement.prototype.defaults),
        initialize: function () {
            celltypes.activity.ActivityDiagramElement.prototype.initialize.apply(this, arguments);
        }
    });

    joint.shapes.uml.ActivityDiagramElement = joint.shapes.basic.Generic.extend({

        markup: [
            '<g class="activity">',
            '<rect class="activity-element-name-rect"/>',
            '<text class="activity-element-name-text"/>',
            '<rect class="activity-element-body-rect"/>',
            '<rect class="activity-toggle"/>',

            '</g>'
        ].join(''),

        defaults: _.defaultsDeep({

            type: 'uml.ActivityDiagramElement',

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


            index: 0,
            expanded: true,
            hidden: false,
            offsetY: 0,

            keyvalues: {
                xtype: '[block type]',
                comment: '[new block]',
                body: [],

            }


        }, joint.shapes.basic.Generic.prototype.defaults),

        initialize: function () {

            joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);

            //_.bindAll(this.setOffsetY,'setOffsetY');
            this.updateRectangles();
            //_.bindAll(this, 'getOffsetY');


        },

        setToValue: function (value, path) {
            obj = this.get('keyvalues');
            path = path.split('.');
            for (i = 0; i < path.length - 1; i++) {

                obj = obj[path[i]];

            }
            obj[path[i]] = value;
            console.log(this.get('keyvalues'));
            this.updateRectangles();
            this.trigger("uml-update");
        },

        getKeyvalues: function () {
            return this.get('keyvalues');
        },

        getValues:function(){
            return this.get('keyvalues');
        },


        setOffsetY: function (a) {
            this.offsetY = a;
        },

        getOffsetY: function () {
            return this.attributes.offsetY;
        },

        getOffsetX: function () {
            return this.getAncestors().length * 50;

        },

        getHeight: function () {
            return 35;
        },


        updateRectangles: function () {

            //console.log("updateRect");
            //console.log(this.get("keyvalues").xtype);
            var attrs = this.get('attrs');

            // this.set('size.height', (this.get('attributes') + this.get('methods')) * 20);

            if (this.get("hidden")) {
                // hack cattivissimo per evitare creazioni di nuovi oggetti e nascondere l'oggetto
                this.attributes.position = {x: -9999, y: -9999};
            }

            else {

                this.attributes.position = {x: this.getOffsetX(), y: this.getOffsetY()};


                if (this.get("keyvalues").comment.length > 20) {
                    var text = this.getKeyvalues().xtype + "\n" + this.getKeyvalues().comment.slice(0, 20) + "...";

                }
                else {
                    var text = this.getKeyvalues().xtype + "\n" + this.getKeyvalues().comment;
                }

                attrs['.activity-toggle'].transform = 'translate(180,0)';
                attrs['.activity-toggle'].height = 35;
                attrs['.activity-toggle'].width = 20;
                //attrs['.activity-toggle'].text = '+';


                attrs['.activity-element-name-text'].text = text;
                attrs['.activity-element-name-rect'].height = this.getHeight();

                //console.log(this.getEmbeddedCells({deep:true}));

                if (this.get("expanded")) {
                    //var l = _.where(this.getEmbeddedCells({deep:true}), {attributes.hidden: true})

                    var embedded = this.getEmbeddedCells({deep: true});
                    //console.log(embedded);
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


                    //console.log(h);
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
                ///console.log("valore offset: ");
                //console.log(this.getOffsetY());


                //attrs['.activity'].transform = 'translate(0,' + this.getOffsetY()+ ')';
                //console.log(this.getOffsetY());


            }


        },


    });


    joint.shapes.uml.ActivityDiagramElementView = joint.dia.ElementView.extend({

        initialize: function () {
            joint.dia.ElementView.prototype.initialize.apply(this, arguments);

            this.listenTo(this.model, 'uml-update', function () {
                console.log("update interfaccia");
                this.update();
                this.resize();
            });
            ///this.listenTo(this.model, 'click', toggl);

        },
        events: {
            'mousedown .activity-toggle': 'toggle',

        },
        toggle: function () {

            console.log("togglo!");
            this.model.set("expanded", !this.model.get("expanded"));
            this.model.updateRectangles();
            this.update(); // ecco cosa dovevi fare, le cose funzionavano già

        }

    });

    joint.shapes.uml.ClassDiagramElement = joint.shapes.basic.Generic.extend({

        markup: [
            '<g class="rotatable">',
            '<g class="">',
            '<rect class="uml-class-name-rect"/><rect class="uml-class-attrs-rect toggleattributes"/><rect class="uml-class-divider-rect"/><rect class="uml-class-methods-rect togglemethods"/>',
            '</g>',
            '<text class="uml-class-name-text"/><text class="uml-class-attrs-text toggleattributes"/><text class="uml-class-methods-text togglemethods"/>',
            '</g>'
        ].join(''),

        defaults: _.defaultsDeep({

            type: 'uml.ClassDiagramElement',

            attrs: {
                rect: {'width': 200},

                '.uml-class-name-rect': {'stroke': 'black', 'stroke-width': 0, 'fill': '#4db6ac'},
                '.uml-class-attrs-rect': {'stroke': 'black', 'stroke-width': 0, 'fill': '#ffffff', 'expanded': 'false'},
                '.uml-class-methods-rect': {
                    'stroke': 'black',
                    'stroke-width': 0,
                    'fill': '#eeeeee',
                    'expanded': 'false'
                },
                '.uml-class-divider-rect': {'stroke': 'black', 'stroke-width': 1, 'fill': 'black'},


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
                    'ref': '.uml-class-attrs-rect', 'ref-y': 5, 'ref-x': 5,
                    'fill': '#222222', 'font-size': 12, 'font-family': 'monospace'
                },
                '.uml-class-methods-text': {
                    'ref': '.uml-class-methods-rect', 'ref-y': 5, 'ref-x': 5,
                    'fill': '#222222', 'font-size': 12, 'font-family': 'monospace'
                }

            },

            name: [],
            attributes: [],
            methods: [],
            attributesexpanded: false,
            methodsexpanded: false,


            keyvalues: {
                name: "classedefault",
                attributes: [
                    {name: "variabileDefault", value: "valoreDefault"},
                    {name: "variabileDefault2", value: "valoreDefault2"}
                ],
                methods: [
                    {
                        name: "metodoDefault", visibility: "public", value: "id univoco blabla",
                        parameters: ["param1:int"]
                    }
                ]

            }

            // l'idea è che ogni cella abbia sto coso che contiene tutte le cose che vogliamo editare
            // quindi attributes e methods dovrebbero stare qua dentro


        }, joint.shapes.basic.Generic.prototype.defaults),

        initialize: function () {

            this.on('change:name change:attributes change:methods', function () {
                this.updateRectangles();
                this.trigger('uml-update');
            }, this);
            //this.on('cell:pointerup', function (cellView, evt, x, y) {        this.updateRectangles(); });


            this.updateRectangles();

            joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
        },

        getClassName: function () {
            return this.get('name');
        },

        getMethods: function () {
            return this.get('methods');
        },

        setToValue: function (value, path) {
            obj = this.get('keyvalues');
            path = path.split('.');
            for (i = 0; i < path.length - 1; i++) {

                obj = obj[path[i]];

            }
            obj[path[i]] = value;
            console.log(this.get('keyvalues'));
            this.updateRectangles();
            this.trigger("uml-update");
        },
        executemethod: function (met) {
            return this[met] && this[met].apply(this, [].slice.call(arguments, 1));
        },
        addmethod: function () {
            this.get('keyvalues').methods.push({
                name: "",
                visibility: "",
                id: joint.util.uuid(),
                returntype: "",
                parameters: []
            });
            console.log("added");
            console.log(this.get('keyvalues'));
        },
        addattribute: function () {
            this.get('keyvalues').attributes.push({name: "", type: ""});
        },
        addparameter: function (ind) {


            this.get('keyvalues').methods[ind].parameters.push("");
        },

        updateRectangles: function () {

            var attrs = this.get('attrs');

            /*var rects = [
             {type: 'name', text: this.getClassName()},
             {type: 'attrs', text: this.get('attributes')},
             {type: 'methods', text: this.get('methods')}
             ];*/

            var offsetY = 0;


            // this.set('size.height', (this.get('attributes') + this.get('methods')) * 20);


            /*var rects = [
             {type: 'name', text: this.getClassName()},
             ];*/

            /*
             if(attrs['uml-class-attrs-rect']){

             if(attrs['uml-class-attrs-rect'].expanded) {
             rects.push(
             { type: 'attrs', text: this.get('attributes')}
             );
             } else {
             rects.push(
             { type: 'attrs', text: "click to expand" }
             );
             }

             if(attrs['uml-class-methods-rect'].expanded) {
             rects.push(
             { type: 'attrs', text: this.get('methods')}
             );
             } else {
             rects.push(
             { type: 'methods', text: "click to expand" }
             );
             }
             }*/

//console.log( this.get('attributesexpanded'));

            rects = [
                {type: 'name', text: this.get('keyvalues').name},
                {

                    type: 'attrs',
                    text: this.get('attributesexpanded') ? this.get('keyvalues').attributes : "Attributes (click to expand)"
                },
                {
                    type: 'methods',
                    text: this.get('methodsexpanded') ? this.get('keyvalues').methods : "Methods (click to expand)"
                }
            ];
            console.log(this.get('keyvalues')['attributes']);

            _.each(rects, function (rect) {

                var lines = _.isArray(rect.text) ? rect.text : [rect.text];
                //console.log(lines);
                var rectHeight = lines.length * 15 + 1;

                attrs['.uml-class-' + rect.type + '-text'].text = lines.map(function (e) {
                    //console.log(e);
                    if (e.hasOwnProperty('name')) {
                        return e.name + ":" + e.value;
                    }
                    else {
                        return e;
                    }
                }).join('\n');
                attrs['.uml-class-' + rect.type + '-rect'].height = rectHeight;
                attrs['.uml-class-' + rect.type + '-rect'].transform = 'translate(0,' + offsetY + ')';

                offsetY += rectHeight + 1;

            });

        }


    });

    joint.shapes.uml.ClassDiagramElementView = joint.dia.ElementView.extend({

        initialize: function () {
            joint.dia.ElementView.prototype.initialize.apply(this, arguments);

            this.listenTo(this.model, 'uml-update', function () {
                console.log("update interfaccia");
                this.update();
                this.resize();
            });
            ///this.listenTo(this.model, 'click', toggl);

        },
        events: {
            'mousedown .togglemethods': 'togglemethods',
            'mousedown .toggleattributes': 'toggleattributes',
        },
        toggleattributes: function () {

            this.model.set("attributesexpanded", !this.model.get("attributesexpanded"));
            _.each(this.model.graph.getConnectedLinks(this.model), function (e) {
                e.trigger("change:markup");
            });


            this.model.updateRectangles();
            this.update(); // ecco cosa dovevi fare, le cose funzionavano già
            this.resize();
        },
        togglemethods: function () {

            this.model.set("methodsexpanded", !this.model.get("methodsexpanded"));
            this.model.updateRectangles();
            this.update(); // ecco cosa dovevi fare, le cose funzionavano già
            this.resize();
        },


    });


    // prova:
    joint.shapes.uml.HxInterface = joint.shapes.uml.ClassDiagramElement.extend({
        markup: [
            '<g class="rotatable">',
            '<g class="">',
            '<rect class="uml-class-name-rect"/><rect class="uml-class-divider-rect"/><rect class="uml-class-methods-rect togglemethods"/>',
            '</g>',
            '<text class="uml-class-name-text"/><text class="uml-class-methods-text togglemethods"/>',
            '</g>'
        ].join('')
    });

    joint.shapes.uml.HxClass = joint.shapes.uml.ClassDiagramElement.extend({});


    return celltypes;
});