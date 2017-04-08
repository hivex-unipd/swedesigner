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
], function ($, _, Backbone, joint, DiagramsCollection, celltypes) {

    var ProjectModel = Backbone.Model.extend({

        graph: {},

		urlRoot: '/generate',
		
        options: {
            currentindex: "class",
            id: new Date().getMilliseconds(),
            currentgraph: {},
            graphs: {
                classes: {
                    id: new Date().getMilliseconds(),
                    classesArray: [],
                    relationshipsArray: []
                },
                methods: []
            }
            /*graphs: [
             {
             type: "class",
             id: '9999',
             "cells": [
             {
             "type": "link",
             "source": {
             "x": 10,
             "y": 20
             },
             "target": {
             "x": 350,
             "y": 20
             },
             "id": "26ff1d7e-671d-4add-a74f-a0172e5270c9",
             "attrs": {
             ".connection": {
             "stroke": "#222138"
             },
             ".marker-source": {
             "fill": "#31d0c6",
             "stroke": "none",
             "d": "M 10 0 L 0 5 L 10 10 z"
             },
             ".marker-target": {
             "fill": "#fe854f",
             "stroke": "#7c68fc",
             "d": "M 10 0 L 0 5 L 10 10 z"
             }
             }
             }
             ]
             },
             {
             type: "method",
             method: "nomeclasse.nomemetodo",
             id: "1234",
             "cells": [
             /*{
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
             ]*/
        },
        initialize: function () {

            this.graph = new joint.dia.Graph({}, {cellNamespace: Swedesigner.client.model.celltypes});

            console.log(this.graph);
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
            //this.options.graphs[this.options.currentindex].push(cell);
console.log("PRIMA");
console.log(this.graph);
            var x = "";

            for (var d = 0; d < this.graph.get("cells").models.length; d++) {
                x += "|" + this.graph.get("cells").models[d].get("values").comment[0] + "|";
            }
            console.log(x);


            _.each(this.graph.get("cells").models, function (el) {
               el.set("z",1);
            });
            this.graph.addCell(cell);

            //this.graph.attributes.cells.push(cell);
            console.log("DOPO ADD");
            var x = "";

            for (var d = 0; d < this.graph.get("cells").models.length; d++) {
                x += "|" + this.graph.get("cells").models[d].get("values").comment[0] + "|";
            }
            console.log(x);
            console.log("cella aggiunta!", this.graph);
            this.trigger('addcell', cell);
            console.log("DOPO TRIGGER");
            var x = "";

            for (var d = 0; d < this.graph.get("cells").models.length; d++) {
                x += "|" + this.graph.get("cells").models[d].get("values").comment[0] + "|";
            }
            console.log(x);
        },
        deleteCell:function (cell) {
            if(cell.getValues().hasOwnProperty("methods")){
                for(var met in cell.getValues().methods){
                    this.deleteMethodDiagram(cell.getValues().methods[met].id);
                }
            }
            this.graph.removeCells([cell]);
            //console.log("ohi perché non rimmuovi");
            this.trigger('addcell');
        },
        addCellFromType: function (type) {
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
                newClass = new joint.shapes.uml.HxClass({
                    position: newPosition,
                    size: newSize,
                    name: 'MyClass3',
                    attributes: ['- attr: type'],
                    methods: ['+ setAttr(): bool']
                });
            }

            this.graph.addCell(newClass);
        },
        addInitialsCells: function () {
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
            //this.graph.fromJSON(this.options.graphs[this.options.currentindex]);

            /*var class2 = new joint.shapes.uml.ClassDiagramElement({
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
             });*/

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
            //this.graph.addCell(class2);
            //this.graph.addCell(class2);
            //this.graph.addCell(class3);
            //this.graph.resetCells(this.options.currentgraph.cells);


            // OLD
            //console.log(class2);
            //class2.attributes.keyvalues.methods[0].diagram = '1234';


            console.log(this.options);

            var x = _.find(this.options.graphs, function (obj) {
                console.log(obj);
                return obj.id == '1234';
            });

            console.log(x);

            var a = new joint.shapes.uml.ActivityDiagramElement({
                offsetY: 50,
                keyvalues: {
                    xtype: 'FOR',
                    comment: 'A Qua faccio un ciclo',
                    body: [],

                },
                //index: 1
            });

            var b = new joint.shapes.uml.ActivityDiagramElement({

                offsetY: 200,
                keyvalues: {
                    xtype: 'ASSEGNAZIONE',
                    comment: 'B Qua faccio una cosa interessante',
                    body: [],

                },
                //index: 2
            });

            var c = new joint.shapes.uml.ActivityDiagramElement({

                offsetY: 350,
                keyvalues: {
                    xtype: 'ASSEGNAZIONE',
                    comment: 'C Qua faccio un\'altra cosa',
                    body: [],

                },
                //index: 2
            });

            var d = new joint.shapes.uml.ActivityDiagramElement({

                offsetY: 500,
                keyvalues: {
                    xtype: 'IF',
                    comment: 'D iffone',
                    body: [],

                },
                //index: 2
            });

            var ee = new joint.shapes.uml.ActivityDiagramElement({

                offsetY: 500,
                keyvalues: {
                    xtype: 'WHILE',
                    comment: 'E girogirogiro',
                    body: [],

                },
                //index: 2
            });

            var f = new joint.shapes.uml.ActivityDiagramElement({

                offsetY: 500,
                keyvalues: {
                    xtype: 'CUSTOM',
                    comment: 'F scribscrib',
                    body: [],

                },
                //index: 2
            });

            var g = new joint.shapes.uml.ActivityDiagramElement({

                offsetY: 500,
                keyvalues: {
                    xtype: 'RETURN',
                    comment: 'G fine',
                    body: [],

                },
                //index: 2
            });


            x.cells.push(a);
            x.cells.push(b);
            x.cells.push(c);
            x.cells.push(d);
            x.cells.push(ee);
            x.cells.push(f);
            x.cells.push(g);


            console.log(x);


            this.switchToGraph(1);

            //this.trigger("cell:pointerdown");
//            this.trigger("cell:pointerup");


            //console.log(x.cells[1]);

            //x.cells[1]
            // x.cells[1].updateRectangles();


            //a.updateRectangles();


            /*
             this.graph.on('change:position', function(cell) {

             var parentId = cell.get('parent');
             if (!parentId) return;

             var parent = graph.getCell(parentId);
             var parentBbox = parent.getBBox();
             var cellBbox = cell.getBBox();

             if (parentBbox.containsPoint(cellBbox.origin()) &&
             parentBbox.containsPoint(cellBbox.topRight()) &&
             parentBbox.containsPoint(cellBbox.corner()) &&
             parentBbox.containsPoint(cellBbox.bottomLeft())) {

             // All the four corners of the child are inside
             // the parent area.
             return;
             }

             // Revert the child position.
             cell.set('position', cell.previous('position'));
             });

             */


        },
        switchToGraph: function (id) {

            //this.options.graphs[this.options.currentindex] = this.graph.toJSON();
            //this.options.currentindex = id;//this.options.graphs[index] || {}
            //this.graph.resetCells(this.options.graphs[this.options.currentindex].cells);

            //parte nuova in fase di implementazione
            console.log("id:", id);
            this.saveCurrentDiagram();
            if (id == "class") {
                this.options.currentindex = id;
                this.graph.resetCells(this.options.graphs.classes.classesArray.concat(this.options.graphs.classes.relationshipsArray));
            }
            else {
                var index = this.getIndexFromId(id);
                this.options.currentindex = id;
                if (index != -1) {
                    this.graph.resetCells(this.options.graphs.methods[index].cells);
                }
                else {
                    this.graph.resetCells([]);
                }
            }


        },
        saveCurrentDiagram : function () {

            if (this.options.currentindex == "class") {
                this.options.graphs.classes.classesArray = (this.graph.getElements());
                this.options.graphs.classes.relationshipsArray = (this.graph.getLinks());
            }
            else {
                var index = this.getIndexFromId(this.options.currentindex);
                if (index != -1) {
                    this.options.graphs.methods[index].cells = this.graph.getCells();
                }
                else {
                    this.options.graphs.methods.push({
                        id: this.options.currentindex,
                        cells: this.graph.getCells()
                    });
                }
            }
        },
        saveDiagram: function () {
            this.saveCurrentDiagram();
            //this.options.graphs[this.options.currentindex] = this.graph.toJSON();
            return JSON.stringify(this.options.graphs);
        },
        loadDiagram: function (diag) {
            /*console.log("switch");
             this.options.graphs = JSON.parse(diag);

             this.options.currentindex = 0;
             this.graph.resetCells(this.options.graphs[this.options.currentindex].cells);*/
            //console.log(diag);
            this.options.graphs = JSON.parse(diag);
            console.log(this.options.graphs);
            this.options.currentindex = "class";
            this.graph.resetCells(this.options.graphs.classes.classesArray.concat(this.options.graphs.classes.relationshipsArray));
            this.trigger("renderActivity");

        },
		sendDiagram: function () {
			var data = {};
			
			
			// construct an HTTP request
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "/generate", true);
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			
			// send the collected data as JSON
			xhr.send(saveDiagram());
			
			xhr.onloadend = function () {
				// done
			};

		},
        getIndexFromId: function (id) {
            return this.options.graphs.methods.findIndex((x) => x.id == id);
        },
        getClassVisibileElements: function (cell) {
            var elems = [];
            for (var attr in cell.getValues().attributes) {
                elems.push(
                    {
                        label: cell.getValues().attributes[attr].name+":"+cell.getValues().attributes[attr].type,
                        value: cell.getValues().attributes[attr].name
                    });
            }
            for (var met in cell.getValues().methods) {
                elems.push(
                    {
                        label: cell.getValues().methods[met].name+"("+cell.getValues().methods[met].parameters.map(function (e) {
                            return e.name;
                        }).join(',')+")",
                        value: cell.getValues().methods[met].name+"("
                    });
            }
            return elems;
        },
        getCurrentDiagramType: function () {
            return this.options.currentindex == "class" ? "class" : "activity";
        },
        getCurrentGraph: function () {
            return this.get("graph");
        },
        deleteMethodDiagram:function(id){
            this.options.graphs.methods.splice(this.getIndexFromId(id),1);
        }

    });
    return new ProjectModel;
});
