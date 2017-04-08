/**
 * Created by matte on 21/03/2017.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'models/celltypes/celltypes'
], function ($, _, Backbone, joint, celltypes) {

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
        addCell: function (cell) {
            //meglio aggiungere sia a current graph o solo al graph e poi fare export in json?

            // necessario per sistemare bug fastidioso di riordine (jsjoint assegna z=2 a qualche cella)
            _.each(this.graph.get("cells").models, function (el) {
               el.set("z",1);
            });

            this.graph.addCell(cell);

            this.trigger('addcell', cell);

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
