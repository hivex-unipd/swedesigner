/*! JointJS v1.0.3 (2016-11-22) - JavaScript diagramming library


 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'joint'
], function ($, _, Backbone, joint) {



    joint.shapes.uml.ActivityDiagramElement = joint.shapes.basic.Generic.extend({

        markup: [
            '<g class="activity">',
            '<rect class="activity-element-name-rect"/>',
            '<text class="activity-element-name-text"/>',
            '</g>'
        ].join(''),

        defaults: _.defaultsDeep({

            type: 'uml.ActivityDiagramElement',

            attrs: {
                rect: {'width': 200},



                '.activity-element-name-rect': {'stroke': 'black', 'stroke-width': 0, 'fill': '#4db6ac'},

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
            offsetY: 0,

            keyvalues: {
                xtype: '[block type]',
                comment: '[new block]',
                body : [],

            }


        }, joint.shapes.basic.Generic.prototype.defaults),

        initialize: function () {

            joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);

            //_.bindAll(this.setOffsetY,'setOffsetY');
            this.updateRectangles();
            //_.bindAll(this, 'getOffsetY');


        },

        getKeyvalues: function () {
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


            var attrs = this.get('attrs');

            // this.set('size.height', (this.get('attributes') + this.get('methods')) * 20);

            this.attributes.position = {x: this.getOffsetX(), y: this.getOffsetY()};


            if (this.get("keyvalues").comment.length > 20) {
                var text = this.getKeyvalues().xtype + "\n" + this.getKeyvalues().comment.slice(0, 20) + "...";

            }
            else
            {
                var text = this.getKeyvalues().xtype + "\n" + this.getKeyvalues().comment;
            }

            attrs['.activity-element-name-text'].text = text;
            attrs['.activity-element-name-rect'].height = this.getHeight();
            attrs['.activity-element-name-rect'].transform = 'translate(0,0)';
            console.log("valore offset: ");
            console.log(this.getOffsetY());



            //attrs['.activity'].transform = 'translate(0,' + this.getOffsetY()+ ')';
            //console.log(this.getOffsetY());


        },







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
                    {name: "metodoDefault", visibility: "public", value: "id univoco blabla",
                        parameters:["param1:int"]}
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
            console.log( this.get('keyvalues'));
            this.trigger("uml-update");
        },
        executemethod:function(met){
            return this[met] && this[met].apply(this, [].slice.call(arguments, 1));
        },
        addmethod: function() {
            this.get('keyvalues').methods.push({name:"",value:"",parameters:[]});
            console.log("added");
            console.log(this.get('keyvalues'));
        },
        addattribute:function(){
            this.get('keyvalues').attributes.push({name:"",type:""});
        },
        addparameter:function(ind){


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
            'click .togglemethods': 'togglemethods',
            'click .toggleattributes': 'toggleattributes',



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







    return joint.shapes.uml;
});
