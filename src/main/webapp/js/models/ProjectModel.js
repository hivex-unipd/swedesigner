/**
 * Created by matte on 21/03/2017.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'collection/DiagramsCollection',
    'libs/jointjs/joint.shapes.uml'
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
            var a = new joint.shapes.uml.Class();
            console.log("--------");
            console.log(a);
            console.log("--------");
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
            var blob = new Blob([JSON.stringify(this.options.graphs)], {type: "application/octet-stream"});
            var url  = window.URL.createObjectURL(blob);
            window.open(url);
            //console.log(JSON.stringify(this.options.graphs));
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