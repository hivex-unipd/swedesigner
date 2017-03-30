define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'models/ProjectModel',
    'models/celltypes/celltypes' // inutile?
], function ($, _, Backbone, joint, ProjectModel) {

    /*Array.prototype.move = function (old_index, new_index) {
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
        return this; // for testing purposes
    };*/

    /**
     * @classdesc `ProjectView` represents the drawing area.
     * It can be the main class diagram or a specific method diagram.
     *
     * @module client.view
     * @name ProjectView
     * @class ProjectView
     * @extends {Backbone.View}
     */
    var ProjectView = Backbone.View.extend({

        /**
         * details (?)
         * @name ProjectView#det
         * @type {Object}
         */
        det: {},

        /**
         * The main drawing area, contained in the HTML `#paper` div.
         * @name ProjectView#paper
         * @type {joint.dia.Paper}
         */
        paper: {},

        /**
         * Initializes `model` with a new `ProjectModel`;
         * initializes `paper` with a new `joint.dia.Paper` object;
         * links mouse events to the right actions
         * [...]
         * @name ProjectView#initialize
         * @function
         */
        initialize: function () {
            this.model = ProjectModel;//new ProjectModel();
            this.paper = new joint.dia.Paper({
                el: $('#paper'),
                model: this.model.graph,
                width: 1500,
                height: 1000,
                gridSize: 6,
                drawGrid: true,
                elementView: joint.shapes.uml.ClassDiagramElementView,

                //clickThreshold: 1,
                linkView: joint.dia.LinkView.extend({
                    pointerdblclick: function (evt, x, y) {
                        if (V(evt.target).hasClass('connection') || V(evt.target).hasClass('connection-wrap')) {
                            this.addVertex({x: x, y: y});
                        }
                    },
                    /*pointerclick: function (evt, x, y) {
                        console.log("you clicked a link");
                        // codice per dire a detailsview che è cambiato qualcosa
                    }*/
                }),

                selectedCell: null,

                interactive: function (cellView) {
                    if (cellView.model instanceof joint.dia.Link) {
                        // Disable the default vertex add functionality on pointerdown.
                        return {vertexAdd: false};
                    }


                    return true;
                },


            });

            //_.bindAll();





            // per qualche satanica ragione cell:pointerclick non funziona
            /// e pointerup funziona. FML.
/*
            this.paper.on('cell:pointerclick', function (cellView, evt, x, y)
            {



            });*/

            this.paper.on('cell:pointerdown', function(cellView, evt, x, y) {

                var cell = cellView.model;

                if (!cell.get('embeds') || cell.get('embeds').length === 0) {
                    // Show the dragged element above all the other cells (except when the
                    // element is a parent).
                    cell.toFront();
                }

                if (cell.get('parent')) {
                    this.model.getCell(cell.get('parent')).unembed(cell);
                }
            });







            this.paper.on('cell:pointerup', function (cellView, evt, x, y) {



                var cell = cellView.model;
                var cellViewsBelow = this.findViewsFromPoint(cell.getBBox().center());

                if (cellViewsBelow.length) {
                    // Note that the findViewsFromPoint() returns the view for the `cell` itself.
                    var cellViewBelow = _.find(cellViewsBelow, function(c) { return c.model.id !== cell.id });

                    // Prevent recursive embedding.
                    if (cellViewBelow && cellViewBelow.model.get('parent') !== cell.id) {
                        cellViewBelow.model.embed(cell);
                    }
                }



                if(this.selectedCell != cellView.model)
                {
                    this.selectedCell = cellView.model;
                    this.trigger("changed-cell");
                    console.log("ho cambiato la selectedcell");
                    console.log(this.selectedCell);

                }




                var offsetY = 0;

                //var g = this.model.options.graphs[this.model.options.currentindex] ;




                console.log(this);
                //var g = this.model.options.graphs;

                var g = this.model.attributes.cells.models;
                //var g = ;//this.getCurrentGraph();
                console.log("questo è g");
                console.log(g);
                console.log(typeof g);

                console.log(g[1]);


                var curr = this.selectedCell;

/*
                var xyz = Array.from(g);
                console.log(xyz);
                console.log(typeof xyz);

                var index = xyz.findIndex(curr);
*/

                console.log("questa è la cella selezionata: ");
                console.log(curr);




                var index = g.indexOf(curr);//curr.get("index"); // è necessario cercare a che indice vorrebbe mettere la cosa

                if(index+1<=g.length-1 && curr.get("position").y > g[index+1].get("position").y)
                {
                    //curr.set("index", index+1);
                    // g[index+1].set("index", index); // -1+1 mi raccomando
                    g.move(index,index+1);
                }

                // sarebbe >=1 ma c'è ancora il link in mezzo (senza sarebbe 0)
                if(index-1>=1 && curr.get("position").y < g[index-1].get("position").y )
                {
                    ///curr.set("index", index-1);
                    // g[index-1].set("index", index); // -1+1 mi raccomando
                    g.move(index,index-1);
                }





                var calcOffset = function(el)
                {
                    console.log(el);
                    if(el.body || el.body!= {}) {
                        //el.setOffsetY(offsetY);
                        console.log(el);
                        //el.offsetY = offsetY;

                        el.attributes.offsetY = offsetY;

                        //el.setOffsetY(offsetY);
                        offsetY += 150;
                        //calcOffset(el);
                    }
                    else {

                        //el.setOffsetY(offsetY);
                        el.attributes.offsetY = offsetY;

                        //el.offsetY = offsetY;
                        offsetY += 150;}
                };

                _.each(g, function(el) {
                    console.log(el);
                    calcOffset(el);
                });

                console.log (g);

                //g[0].updateRectangles();

                console.log("chiamo update");



                //console.log(this);


                //g[1].updateRectangles();


                for(i = 0; i<g.length; i++)
                {
                    if(g[i].get("type") == "uml.ActivityDiagramElement")
                    {
                        g[i].updateRectangles();

                        this.removeView(g[i]);
                        this.renderView(g[i]); // per qualche ragione è necessario..


                    }
                    else{console.log(g[i]); console.log("questo no :(");}

                }

                //this.removeView(g[1]);
                //this.renderView(g[1]); // per qualche ragione è necessario..





                //this.trigger("uml-update");
/*
                _.each(g, function(el){
                    console.log(el);
                    el.updateRectangles();
                });
*/


                //console.log(cellView.model.getClassName());
            });/*
            this.paper.on('blank:pointerdown', function (evt, x, y) {
                //console.log(evt);
               //console.log(x,y);
            });*/

            this.model.addInitialsCells();
            this.trigger("cell:pointerup"); // come faccio a triggerare la cosa che ho definito sopra?


        },

        /**
         * ...
         * @name ProjectView#switch
         * @function
         * @param {number} index which graph to swith to
         * @param {?} selectedCell ?
         */
        switch: function (index, selectedCell) {
            this.model.switchToGraph(index, selectedCell);
            this.trigger("Switchgraph");
        }
    });
    return new ProjectView;
});
