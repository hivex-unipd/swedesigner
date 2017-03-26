/**
 * Created by matte on 21/03/2017.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'collection/DiagramsCollection',
    'models/celltypes/celltypes'
],function ($, _, Backbone, joint, DiagramsCollection) {

    var ProjectModel = Backbone.Model.extend({

        graph:{},

        options:{
            currentindex:0,
            id:new Date().getMilliseconds(),
            currentgraph:{},
            graphs:[
                {
                    type:"class",
                    "cells":[
                        {
                            "type":"link",
                            "source":{
                                "x":10,
                                "y":20
                            },
                            "target":{
                                "x":350,
                                "y":20
                            },
                            "id":"26ff1d7e-671d-4add-a74f-a0172e5270c9",
                            "attrs":{
                                ".connection":{
                                    "stroke":"#222138"
                                },
                                ".marker-source":{
                                    "fill":"#31d0c6",
                                    "stroke":"none",
                                    "d":"M 10 0 L 0 5 L 10 10 z"
                                },
                                ".marker-target":{
                                    "fill":"#fe854f",
                                    "stroke":"#7c68fc",
                                    "d":"M 10 0 L 0 5 L 10 10 z"
                                }
                            }
                        }
                    ]
                },
                {
                    type:"method",
                    method:"nomeclasse.nomemetodo",
                    "cells":[
                        {
                            "type":"link",
                            "source":{
                                "x":80,
                                "y":80
                            },
                            "target":{
                                "x":350,
                                "y":20
                            },
                            "id":"26ff1d7e-671d-4add-a74f-a0172e5270c9",
                            "attrs":{
                                ".connection":{
                                    "stroke":"#222138"
                                },
                                ".marker-source":{
                                    "fill":"#31d0c6",
                                    "stroke":"none",
                                    "d":"M 10 0 L 0 5 L 10 10 z"
                                },
                                ".marker-target":{
                                    "fill":"#fe854f",
                                    "stroke":"#7c68fc",
                                    "d":"M 10 0 L 0 5 L 10 10 z"
                                }
                            }
                        }
                    ]
                }
            ]
        },
        initialize: function(){

            this.graph = new joint.dia.Graph();
            //var a = new joint.shapes.uml.Class();
            //console.log("--------");
            //console.log(a);
            //console.log("--------");
            //this.options.graphs= new DiagramsCollection();
            //this.options.graphs.add(new joint.dia.Graph());
            //this.options.graphs.add(new joint.dia.Graph());
            //this.options.currentgraph = this.options.graphs.at(0);



        },
        addCell: function (cell) {
            //meglio aggiungere sia a current graph o solo al graph e poi fare export in json?
            this.options.graphs[this.options.currentindex].push(cell);
            this.graph.addCell(cell);
        },
        addCellFromType: function(type) {
            var newClass;
            var newPosition = {x: 200, y: 200};
            var newSize = {width: 100, height: 100};

            // stub!
            if (type == 'HxInterface') {
                newClass = new joint.shapes.uml.HxInterface({
                    position: newPosition,
                    size: newSize,
                    name: 'MyInterface3',
                    methods: ['+ setAttr(): bool']
                });
            } else {
                newClass = new joint.shapes.uml.ClassDiagramElement({
                    position: newPosition,
                    size: newSize,
                    name: 'MyClass3',
                    attributes: ['- attr: type'],
                    methods: ['+ setAttr(): bool']
                });
            }

            this.graph.addCell(newClass);
        },
        addInitialsCells: function(){
            /*var link = new joint.dia.Link({
                source: { x: 10, y: 20 },
                target: { x: 350, y: 20 },
                attrs: {}
            });
            link.attr({
                '.connection': { stroke: '#222138' },
                '.marker-source': { fill: '#31d0c6', stroke: 'none', d: 'M 10 0 L 0 5 L 10 10 z' },
                '.marker-target': { fill: '#fe854f', stroke: '#7c68fc', d: 'M 10 0 L 0 5 L 10 10 z' }
            });
            this.options.currentgraph.push(link);*/
            //this.options.currentgraph = this.options.graphs[0];
            this.graph.fromJSON(this.options.graphs[this.options.currentindex]);

	        var class2 = new joint.shapes.uml.ClassDiagramElement({
            position: {x: 120, y: 190},
            size: {width: 100, height: 100},
            name: 'MyClass2',
            attributes: ['- fruit: int', '+ animal: Dog', '+ animal: Dog', '+ animal: Dog', '+ animal: Dog', '+ animal: Dog'],
            methods: ['+ HasBanana(): bool', '- pet(): void', '- pet(): void', '- pet(): void', '- pet(): void', '- pet(): void', '- pet(): void', '- pet(): void', '- pet(): void', '- pet(): void', '- pet(): void', '- pet(): void'],
            keyvalues: {
                attributes: [
                    {name: "variabileDefault", value: "valoreDefault"},
                    {name: "variabileDefault2", value: "valoreDefault2"}
                ],
                methods: [
                    {name: "metodoDefault", visibility: "public", value: "id univoco blabla"}
                ]

            },
            });

            /*var class3 = new uml.ClassDiagramElement({
                position: {x: 120, y: 190},
                size: {width: 100, height: 100},
                name: 'MyClass3rda',
                attributes: ['- fruit: int', '+ animal: Dog', '+ animal: Dog', '+ animal: Dog', '+ animal: Dog', '+ animal: Dog'],
                methods: ['+ HasBanana(): bool', '- pet(): void', '- pet(): void', '- pet(): void', '- pet(): void', '- pet(): void', '- pet(): void', '- pet(): void', '- pet(): void', '- pet(): void', '- pet(): void', '- pet(): void'],

            });*/
            /*var class2 = new joint.shapes.uml.Class({
                position: { x:200  , y: 500 },
                size: { width: 180, height: 50 },
                name: 'Man',
                attrs: {
                    '.uml-class-name-rect': {
                        fill: '#ff8450',
                        stroke: '#fff',
                        'stroke-width': 0.5
                    },
                    '.uml-class-attrs-rect, .uml-class-methods-rect': {
                        fill: '#fe976a',
                        stroke: '#fff',
                        'stroke-width': 0.5
                    }
                }
            });*/
            this.graph.addCell(class2);
	        //this.graph.addCell(class2);
            //this.graph.addCell(class3);
            //this.graph.resetCells(this.options.currentgraph.cells);
        },
        switchToGraph: function(index){

            this.options.graphs[this.options.currentindex] = this.graph.toJSON();
            this.options.currentindex = index;//this.options.graphs[index] || {}
            this.graph.resetCells(this.options.graphs[this.options.currentindex].cells);
            //console.log(this.options.currentgraph);
            //console.log(JSON.stringify(this.graph.toJSON()));
        },
        saveDiagram: function () {
            this.options.graphs[this.options.currentindex] = this.graph.toJSON();
            return JSON.stringify(this.options.graphs);
        },
        loadDiagram:function (diag){
            console.log("switch");
            this.options.graphs=JSON.parse(diag);
            
            this.options.currentindex =0;
            this.graph.resetCells(this.options.graphs[this.options.currentindex].cells);
        }
    });
    return  new ProjectModel;
});
