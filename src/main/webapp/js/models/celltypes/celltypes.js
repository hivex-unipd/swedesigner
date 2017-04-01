define([
    'jquery',
    'underscore',
    'backbone',
    'joint'
], function ($, _, Backbone, joint) {

    /**
     * @classdesc `ActivityDiagramElement` is the base class
     * for all the block elements in the activity diagram of a method.
     *
     * @module client.models.celltypes
     * @name ActivityDiagramElement
     * @class ActivityDiagramElement
     * @extends {joint.shapes.basic.Generic}
     */
    joint.shapes.uml.ActivityDiagramElement = joint.shapes.basic.Generic.extend({

        /**
         * The SVG markup for rendering the element on the page.
         * @name ActivityDiagramElement#markup
         * @type {string}
         */
        markup: [
            '<g class="activity">',
            '<rect class="activity-element-name-rect"/>',
            '<text class="activity-element-name-text"/>',
            '<rect class="activity-element-body-rect"/>',
            '<rect class="activity-toggle"/>',
            '</g>'
        ].join(''),

        /**
         * The base class default attributes.
         * @name ActivityDiagramElement#defaults
         * @type {Object}
         */
        defaults: _.defaultsDeep({

            /**
             * The type of the element.
             * @name ActivityDiagramElement#defaults#type
             * @type {string}
             */
            type: 'uml.ActivityDiagramElement',

            /**
             * The CSS attributes for the diagram element.
             * @name ActivityDiagramElement#defaults#attrs
             * @type {Object}
             */
            attrs: {
                rect: {'width': 200},

                '.activity-toggle': {
                    'fill': '#eedd99'
                },

                '.activity-element-name-rect': {
                    'stroke': 'black',
                    'stroke-width': 0,
                    'fill': '#4db6ac'
                },

                '.activity-element-body-rect': {
                    'stroke': 'black',
                    'stroke-width': 2,
                    'fill': '#ffffff'
                },

                '.activity': {
                    'stroke': 'black',
                    'stroke-width': 0,
                    'fill': '#ffffff'
                },

                '.activity-element-name-text': {
                    'ref': '.activity-element-name-rect',
                    'ref-y': .5,
                    'ref-x': .5,
                    'text-anchor': 'middle',
                    'y-alignment': 'middle',
                    'fill': 'white',
                    'font-size': 16,
                    'font-family': 'Roboto'
                }
            },

            /**
             * ?
             * @name ActivityDiagramElement#defaults#index
             * @type {number}
             */
            index: 0,

            /**
             * Whether the element is expanded. (?)
             * @name ActivityDiagramElement#defaults#expanded
             * @type {boolean}
             */
            expanded: true,

            /**
             * Whether the element is hidden. (?)
             * @name ActivityDiagramElement#defaults#hidden
             * @type {boolean}
             */
            hidden: false,

            /**
             * Vertical offset from the top of the diagram. (?)
             * @name ActivityDiagramElement#defaults#offsetY
             * @type {number}
             */
            offsetY: 0,

            /**
             * ?
             * @name ActivityDiagramElement#defaults#keyvalues
             * @type {Object}
             */
            keyvalues: {
                xtype: '[block type]',
                comment: '[new block]',
                body : []
            }
        }, joint.shapes.basic.Generic.prototype.defaults),

        /**
         * Initializes the CSS attributes.
         * @name ActivityDiagramElement#initialize
         * @function
         */
        initialize: function () {

            joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);

            //_.bindAll(this.setOffsetY,'setOffsetY');
            this.updateRectangles();
            //_.bindAll(this, 'getOffsetY');


        },

        /**
         * Sets the cell to a given state.
         * @name ActivityDiagramElement#setToValue
         * @param {string} value the desired state
         * @param {string} path the path to the cell (?)
         */
        setToValue: function (value, path) {
            obj = this.get('keyvalues');
            path = path.split('.');
            for (i = 0; i < path.length - 1; i++) {

                obj = obj[path[i]];

            }
            obj[path[i]] = value;
            console.log( this.get('keyvalues'));
            this.updateRectangles();
            this.trigger("uml-update");
        },

        /**
         * Returns KeyValues.
         * @name ActivityDiagramElement#getKeyvalues
         * @return {Object} KeyValues
         */
        getKeyvalues: function () {
            return this.get('keyvalues');
        },

        /**
         * Sets the vertical offset from the top to `a` pixels.
         * @name ActivityDiagramElement#setOffsetY
         * @param {number} a vertical offset
         */
        setOffsetY: function (a) {
            this.offsetY = a;
        },

        /**
         * Returns the vertical offset of the element from the top.
         * @name ActivityDiagramElement#getOffsetY
         * @return {number} the vertical offset
         */
        getOffsetY: function () {
            return this.attributes.offsetY;
        },

        /**
         * Returns the indentation level of the element (in pixels).
         * @name ActivityDiagramElement#getOffsetX
         * @return {number} the indentation level
         */
        getOffsetX: function () {
            return this.getAncestors().length * 50;

        },

        /**
         * Returns the element height (in pixels).
         * @name ActivityDiagramElement#getHeight
         * @return {number} the height
         */
        getHeight: function () {
            return 35;
        },

        /**
         * Updates the CSS attributes, based on the state of the object.
         * @name ActivityDiagramElement#updateRectangles
         * @function
         */
        updateRectangles: function () {

            //console.log("updateRect");
            //console.log(this.get("keyvalues").xtype);
            var attrs = this.get('attrs');

            // this.set('size.height', (this.get('attributes') + this.get('methods')) * 20);

            if(this.get("hidden"))
            {
                // hack cattivissimo per evitare creazioni di nuovi oggetti e nascondere l'oggetto
                this.attributes.position = {x: -9999, y: -9999};
            }

            else {

                this.attributes.position = {x: this.getOffsetX(), y: this.getOffsetY()};


                if (this.get("keyvalues").comment.length > 20) {
                    var text = this.getKeyvalues().xtype + "\n" + this.getKeyvalues().comment.slice(0, 20) + "...";

                }
                else
                {
                    var text = this.getKeyvalues().xtype + "\n" + this.getKeyvalues().comment;
                }

                attrs['.activity-toggle'].transform = 'translate(180,0)';
                attrs['.activity-toggle'].height = 35;
                attrs['.activity-toggle'].width = 20;
                //attrs['.activity-toggle'].text = '+';


                attrs['.activity-element-name-text'].text = text;
                attrs['.activity-element-name-rect'].height = this.getHeight();

                //console.log(this.getEmbeddedCells({deep:true}));

                if(this.get("expanded"))
                {
                    //var l = _.where(this.getEmbeddedCells({deep:true}), {attributes.hidden: true})

                    var embedded = this.getEmbeddedCells({deep:true});
                    //console.log(embedded);
                    var h = 0;
                    for(i=0;i<embedded.length;i++)
                    {
                        if(embedded[i].get("hidden")) {h+=0;}
                        if(!embedded[i].get("hidden") && embedded[i].get("expanded")) {h+=100;}
                        if(!embedded[i].get("hidden") && !embedded[i].get("expanded")) {h+=50;}
                    }



                    //console.log(h);
                    if(h!=0)
                    {
                        attrs['.activity-element-body-rect'].height =  35+20+ h ;
                    }
                    else{
                        attrs['.activity-element-body-rect'].height =  35+ 20;
                    }
                }

                else
                {
                    attrs['.activity-element-body-rect'].height = 0;
                }

                attrs['.activity-element-name-rect'].transform = 'translate(0,0)';
                attrs['.activity-element-body-rect'].transform = 'translate(0,35)';
                ///console.log("valore offset: ");
                //console.log(this.getOffsetY());



                //attrs['.activity'].transform = 'translate(0,' + this.getOffsetY()+ ')';
                //console.log(this.getOffsetY());


            }

        }

    });



    /**
     * @classdesc [...]
     *
     * @module client.models.celltypes
     * @name ActivityDiagramElementView
     * @class ActivityDiagramElementView
     * @extends {joint.dia.ElementView}
     */
    joint.shapes.uml.ActivityDiagramElementView = joint.dia.ElementView.extend({

        /**
         * Sets the view to listen to its model;
         * in particular, the view listens to the
         * 'uml-update' event from the model.
         * @name ActivityDiagramElementView#initialize
         * @function
         */
        initialize: function () {
            joint.dia.ElementView.prototype.initialize.apply(this, arguments);

            this.listenTo(this.model, 'uml-update', function () {
                console.log("update interfaccia");
                this.update();
                this.resize();
            });
            ///this.listenTo(this.model, 'click', toggl);

        },

        /**
         * The activity diagram events, each one linked to the desired action.
         * @name ActivityDiagramElementView#events
         * @type {Object}
         */
        events: {
            'mousedown .activity-toggle': 'toggle',
        },

        /**
         * Toggles the expansion of a cell, given its state.
         * @name ActivityDiagramElementView#toggle
         * @function
         */
        toggle: function () {

            console.log("togglo!");
            this.model.set("expanded", !this.model.get("expanded"));
            this.model.updateRectangles();
            this.update(); // ecco cosa dovevi fare, le cose funzionavano già

        }

    });



    joint.shapes.uml.ClassDiagramElement = joint.shapes.basic.Generic.extend({

        markup: '',
/*        markup: [
            '<g class="rotatable">',
            '<g class="">',
            '<rect class="uml-class-name-rect"/><rect class="uml-class-attrs-rect toggleattributes"/><rect class="uml-class-divider-rect"/><rect class="uml-class-methods-rect togglemethods"/>',
            '</g>',
            '<text class="uml-class-name-text"/><text class="uml-class-attrs-text toggleattributes"/><text class="uml-class-methods-text togglemethods"/>',
            '</g>'
        ].join(''),*/

        defaults: _.defaultsDeep({

            type: 'uml.ClassDiagramElement',

            attrs: {},
/*            attrs: {
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
            },*/

            name: [],
            attributes: [],
            methods: [],
            attributesexpanded: false,
            methodsexpanded: false,

            keyvalues: {}
/*            keyvalues: {
                name: "classedefault",
                attributes: [
                    {name: "variabileDefault", value: "valoreDefault"},
                    {name: "variabileDefault2", value: "valoreDefault2"}
                ],
                methods: [
                    {name: "metodoDefault", visibility: "public", value: "id univoco blabla",
                        parameters:["param1:int"]}
                ]
            }*/

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
            console.log( this.get('keyvalues'));
            this.updateRectangles();
            this.trigger("uml-update");
        },

        executemethod: function (met) {
            return this[met] && this[met].apply(this, [].slice.call(arguments, 1));
        },

        addmethod: function() {
            this.get('keyvalues').methods.push({name:"",value:"",parameters:[]});
            console.log("added");
            console.log(this.get('keyvalues'));
        },

        addattribute: function () {
            this.get('keyvalues').attributes.push({name:"",type:""});
        },

        addparameter: function (ind) {


            this.get('keyvalues').methods[ind].parameters.push("");
        },

        updateRectangles: function () {

            //var attrs = this.get('attrs');

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

            // così gestisce sottoclassi che non abbiano attrs:
            var rects = [];
            rects.push({
                type: 'name',
                text: this.get('keyvalues').name
            });
            if (this.get('keyvalues').attributes != undefined) {
                rects.push({
                    type: 'attrs', text: this.get('attributesexpanded') ? this.get('keyvalues').attributes : "Attributes (click to expand)"
                });
            }
            rects.push({
                type: 'methods', text: this.get('methodsexpanded') ? this.get('keyvalues').methods : "Methods (click to expand)"
            });

/*            rects = [
                {type: 'name', text: this.get('keyvalues').name},
                {

                    type: 'attrs',
                    text: this.get('attributesexpanded') ? this.get('keyvalues').attributes : "Attributes (click to expand)"
                },
                {
                    type: 'methods',
                    text: this.get('methodsexpanded') ? this.get('keyvalues').methods : "Methods (click to expand)"
                }
            ];*/
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
            this.model.updateRectangles();
            this.update(); // ecco cosa dovevi fare, le cose funzionavano già

        },

        togglemethods: function () {
            this.model.set("methodsexpanded", !this.model.get("methodsexpanded"));
            this.model.updateRectangles();
            this.update(); // ecco cosa dovevi fare, le cose funzionavano già
        }
    });





    joint.shapes.uml.HxClass = joint.shapes.basic.Generic.extend({

        markup: [
            '<g class="rotatable">',
            '<g class="">',
            '<rect class="uml-class-name-rect"/><rect class="uml-class-attrs-rect toggleattributes"/><rect class="uml-class-divider-rect"/><rect class="uml-class-methods-rect togglemethods"/>',
            '</g>',
            '<text class="uml-class-name-text"/><text class="uml-class-attrs-text toggleattributes"/><text class="uml-class-methods-text togglemethods"/>',
            '</g>'
        ].join(''),

        defaults: _.defaultsDeep({

            type: 'uml.HxClass',

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
                    {name: "metodoDefault", visibility: "public", value: "id univoco blabla",
                        parameters:["param1:int"]}
                ]
            }
            // l'idea è che ogni cella abbia sto coso che contiene tutte le cose che vogliamo editare
            // quindi attributes e methods dovrebbero stare qua dentro


        }, joint.shapes.basic.Generic.prototype.defaults)
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







    return joint.shapes.uml;
});
