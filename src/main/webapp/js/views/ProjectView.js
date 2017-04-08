define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'models/ProjectModel',
    'models/celltypes/celltypes'
], function ($, _, Backbone, joint, ProjectModel, celltypes) {

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
         * The main drawing area, contained in the HTML `#paper` div.
         * @name ProjectView#paper
         * @type {joint.dia.Paper}
         */
        paper: {},

        /**
         * It contains variables and methods visible inside the selected method scope.
         * @name ProjectView#visibleElements
         * @type {String, String}[]
         */
        visibleElements: [],



        deleteCell: function(e){
          //console.log(e.which==46);
            if(e.which==46){//ha premuto tasto canc
                if(this.paper.selectedCell){
                    this.model.deleteCell(this.paper.selectedCell);
                }
            }
        },

        /**
         * Updates the drawing area by placing the activity blocks.
         * @name ProjectView#renderActivity
         * @function
         */
        renderActivity: function () {
            // CODICE OK
            //console.log(this);
            var debug = function () {
                var x = "";

                for (var d = 0; d < g.length; d++) {
                    x += "|" + g[d].get("values").comment[0] + "|";
                }
                console.log(x);
            };
            //var g = this.paper.attributes.cells.models;
            var m = this.model;
            var p = this.paper;
            //console.log(m);
            var g = m.graph.get("cells").models;
            console.log("RENDER");
            if (g && m.options.currentindex != 'class') {
                debug();

                var offsetY = 50;

                for (i = 0; i < g.length; i++) {
                    var hidden = false;

                    g[i].getAncestors().every(function (el) {
                        if (!el.get("expanded")) {
                            hidden = true;
                            g[i].set("hidden", true);
                        }
                        return !hidden; // se every ritorna false, esce dal loop (per efficienza)
                    });


                    if (!hidden) {
                        g[i].set("hidden", false);
                        g[i].attributes.offsetY = offsetY;

                        if (!g[i].get("expanded")) {
                            offsetY += 50;// se è ridotto ho bisogno di meno spazio
                        }

                        else {
                            offsetY += 100;
                        }

                    }
                    /*else
                     {
                     g[i].set("hidden", true);
                     }*/

                }

                var l = g.length;
                //console.log(g);
                //console.log(l);

                for (ii = 0; ii < l; ii++) {

                    if (true) {//g[ii].get("type").startsWith("activity") == "uml.ActivityDiagramElement") {
                        g[ii].updateRectangles();
                        console.log(this);
                        p.removeView(g[ii]);
                        p.renderView(g[ii]); // per qualche ragione è necessario..

                    }

                    else {
                        console.log(g[ii]);
                        console.log("questo no :(");
                    }
                }
            }
        },

        /**
         * Manages the moment when the user is attempting
         * to drag the cell with the pointer; this is a callback
         * to the 'pointerdown' event on the view.
         * @name ProjectView#pointerUpFunction
         * @function
         * @param {joint.dia.ElementView} cellView the dragged cell's view
         * @param {event} evt the action event
         * @param {number} x the horizontal position of the cell (?)
         * @param {number} y the vertical position of the cell (?)
         */
        pointerDownFunction: function (cellView, evt, x, y) {

            if (cellView) {
                console.log(this);
                if (this.selectedCell != cellView.model) {
                    changed = true;
                    this.selectedCell = cellView.model;
                    if (true) {//cellView.model instanceof joint.shapes.uml.ClassDiagramElement) {
                        this.trigger("changed-cell");
                        console.log("ho cambiato la selectedcell");
                        console.log(this.selectedCell);
                    }
                }
            }

            console.log(ProjectModel.options.currentindex);
            if (cellView.model.get("type").startsWith("activity")) {
                var cell = cellView.model;

                if (!cell.get('embeds') || cell.get('embeds').length === 0) {
                    // Show the dragged element above all the other cells (except when the
                    // element is a parent).
                    //cell.toFront();
                }

                if (cell.get('parent')) {
                    this.model.getCell(cell.get('parent')).unembed(cell);
                }
                var g = this.model.attributes.cells.models;

                var currentCell = this.selectedCell;
                console.log(this.selectedCell);
                var currentIndex = g.indexOf(currentCell);
                var figli = currentCell.getEmbeddedCells({deep: true});

                var move = function (a, old_index, new_index) {
                    if (new_index >= a.length) {
                        var k = new_index - a.length;
                        while ((k--) + 1) {
                            a.push(undefined);
                        }
                    }
                    a.splice(new_index, 0, a.splice(old_index, 1)[0]);
                    return a; // for testing purposes
                };
                // funzione di debug
                var debug = function () {
                    var x = "";

                    for (var d = 0; d < g.length; d++) {
                        x += "|" + g[d].get("values").comment[0] + "|";
                    }
                    console.log(x);
                };

                debug();
                console.log("SPOSTO", g[currentIndex].get("values").comment[0]);

                move(g, currentIndex, g.length - 1);

                for (var i = 0; i < figli.length; i++) {
                    console.log("SPOSTO", g[currentIndex].get("values").comment[0]);

                    move(g, currentIndex, g.length - 1);
                    debug();
                }
                debug();

            }

        },

        /**
         * Manages the release of the pointer from a cell
         * (i.e. when the user has finished dragging the cell);
         * this is a callback to the 'pointerup' event on the view.
         * @name ProjectView#pointerUpFunction
         * @function
         * @param {joint.dia.ElementView} cellView the dragged cell's view
         * @param {event} evt the action event
         * @param {number} x the horizontal position of the cell (?)
         * @param {number} y the vertical position of the cell (?)
         */
        pointerUpFunction: function (cellView, evt, x, y) {
            if (cellView.model.get("type").startsWith("activity")) {
                var parentCell = null;
                var embedded = false;
                // EMBED e selectedcell
                if (cellView) {
                    var cell = cellView.model;
                    var cellViewsBelow = this.findViewsFromPoint(cell.getBBox().center());

                    if (cellViewsBelow.length) {
                        // Note that the findViewsFromPoint() returns the view for the `cell` itself.

                        // ho modificato il comportamento di default descritto nelle API perché sennò prendeva sempre il
                        /// primo trovato (_.find).
                        // prendendo l'ultimo sono sicuro che sia quello più interessante per l'user.

                        var index = _.findLastIndex(cellViewsBelow, function (c) {
                            return c.model.id !== cell.id
                        });
                        cellViewBelow = cellViewsBelow[index];


                        // Prevent recursive embedding.
                        if (cellViewBelow && cellViewBelow.model.get('parent') !== cell.id) {

                            cellViewBelow.model.embed(cell);
                            embedded = true;
                            parentCell = cellViewBelow.model;
                        }
                    }

                }

                var g = this.model.attributes.cells.models;

                // cella corrente
                var curr = this.selectedCell;
                var figli = curr.getEmbeddedCells({deep: true});

                // funzione per muovere l'array (è fatta bene)
                var move = function (a, old_index, new_index) {
                    if (new_index >= a.length) {
                        var k = new_index - a.length;
                        while ((k--) + 1) {
                            a.push(undefined);
                        }
                    }
                    a.splice(new_index, 0, a.splice(old_index, 1)[0]);
                    return a; // for testing purposes
                };

                // indice cella corrente
                var currentIndex = g.indexOf(curr); // è necessario cercare a che indice vorrebbe mettere la cosa

                // funzione di debug
                var debug = function () {
                    var x = "";

                    for (var d = 0; d < g.length; d++) {
                        x += "|" + g[d].get("values").comment[0] + "|";
                    }
                    console.log(x);
                };

                // necessaria per fixare problemi di ordine
                var correctEmbedding = function (index, parent, cell) {
                    var embcells = parent.getEmbeddedCells();

                    //console.log("correggo embed");

                    // deeembeddo ogni cella
                    parent.unembed(embcells.pop(cell));

                    for (var i = 0; i < embcells.length; i++) {
                        parent.unembed(embcells[i]);
                        //console.log(embcells[i].id, "deembedded");
                    }
                    //console.log(parent, "parent");

                    // embeddo celle da i ad index
                    for (var i = 0; i < index && i < embcells.length; i++) {
                        //console.log("e1", embcells[i].get("values").comment[0]);
                        parent.embed(embcells[i]);
                        //console.log(parent);
                    }

                    // embeddo la cella in input
                    //console.log("c", cell.get("values").comment[0]);
                    parent.embed(cell);


                    // embeddo le celle rimanenti
                    for (var i = index; i < embcells.length; i++) {
                        //console.log("e2", embcells[i].get("values").comment[0]);
                        parent.embed(embcells[i]);
                    }
                    //console.log("corretti embed");
                };

                // se parentCell esiste
                if (parentCell) {
                    // se parentCell ha solo me come figlio: yee! apposto, ho trovato del posto.
                    if (parentCell.get("embeds").length == 1 && parentCell.get("embeds")[0] == this.selectedCell.id) {
                        console.log("non ho fratelli :(");
                        debug();
                        var dest = g.indexOf(parentCell) + 1;
                        //move(g, g.length-1-figli.length, dest);

                        console.log("caso con unico figlio e parentcell");
                        for (var i = 0; i <= figli.length; i++) {
                            move(g, g.length - 1 - figli.length + i, dest + i);
                            debug();
                        }
                    }
                    // altrimenti: sono disponibili più di un posto e dobbiamo trovare quello migliore.
                    else {

                        //console.log(g);
                        //console.log("i miei fratelli sono:");
                        var ff = parentCell.get("embeds");
                        //console.log(ff);
                        ///console.log(this.model.getCell(ff[0]));
                        var found = false;

                        fratelli = [];
                        //var frad = [];
                        for (var i = 0; i < ff.length; i++) {
                            if (ff[i] != curr.id) {
                                fratelli.push(ff[i]);
                                //frad.push(this.model.getCell(ff[i]).get("values").comment[0]);
                            }
                        }
                        //console.log(frad);

                        for (var i = 0; i < fratelli.length && !found; i++) {
                            // i miei fratelli sono in ordine di y crescente.
                            // il primo fratello che mi supera in y è quello che mi seguirà
                            //console.log(y, " < ", this.model.getCell(fratelli[i]).get("position").y);
                            if (y < this.model.getCell(fratelli[i]).get("position").y) {

                                found = true;
                                if (i != 0) {
                                    // console.log("pezzo buggato?");
                                    // bad
                                    // se non è il primo dentro il blocco
                                    var dest = g.indexOf(this.model.getCell(fratelli[i - 1]));
                                    dest += this.model.getCell(fratelli[i - 1]).getEmbeddedCells({deep: true}).length;
                                    //dest = dest + this.model.getCell(fratelli[i]).getEmbeddedCells({deep: true}).length;
                                    //dest--;
                                    // correctEmbedding(i-1,parentCell,curr);
                                    for (var j = 0; j <= figli.length; j++) {
                                        move(g, g.length - 1 - figli.length + j, dest + j + 1);
                                        debug();
                                    }
                                }
                                else {
                                    //console.log("i=0");
                                    var dest = g.indexOf(parentCell);
                                    dest++;

                                    // correctEmbedding(0,parentCell,curr);

                                    for (var j = 0; j <= figli.length; j++) {
                                        move(g, g.length - 1 - figli.length + j, dest + j);
                                        debug();
                                    }

                                }
                            }
                        }
                        // non ho trovato posto perché ho la y più grande di tutti i miei fratelli
                        if (!found) {
                            //console.log("y grande");
                            //var dest = getNextIndexByID(this.model, fratelli,fratelli.length-1);
                            //dest--;
                            var index = 0;
                            if (fratelli[fratelli.length - 1] == curr.id) {
                                index = fratelli.length - 2;
                            }
                            else {
                                // bad
                                //console.log("non dovrebbe mai accadere?");
                                index = fratelli.length - 1;
                            }


                            var dest = g.indexOf(this.model.getCell(fratelli[index]));

                            console.log(this.model.getCell(fratelli[index]).getEmbeddedCells({deep: true}).length);
                            dest = dest + this.model.getCell(fratelli[index]).getEmbeddedCells({deep: true}).length;
                            dest++;

                            // correctEmbedding(index,parentCell,curr);

                            for (var w = 0; w <= figli.length; w++) {
                                move(g, g.length - 1 - figli.length + w, dest + w);
                                debug();
                            }
                        }
                    }
                }
                // è a livello 0
                else {
                    //console.log("caso livello 0");
                    var fratelli = [];
                    for (var i = 0; i < g.length; i++) {
                        if (!g[i].get("parent")) {
                            fratelli.push(g[i]);
                        }
                    }

                    var found2 = false;
                    for (var i = 0; i < fratelli.length && !found2; i++) {
                        if (fratelli[i] != curr.id && y < this.model.getCell(fratelli[i]).get("position").y) {
                            console.log("trovato");
                            found2 = true;
                            var dest = g.indexOf(this.model.getCell(fratelli[i]));
                            //console.log(dest);

                            //console.log(figli);
                            //console.log(figli.length);
                            var k = 0;
                            //correctEmbedding(i,parentCell,curr);

                            for (k = 0; k <= figli.length; k++) {
                                //console.log("ciclo", k);
                                move(g, g.length - 1 - figli.length + k, dest + k);
                                debug();
                            }
                            //console.log(k, "<=", figli.length, k <= figli.length);
                            //console.log(figli.length);

                           //console.log(figli);

                        } else {
                           // console.log("avanti");
                        }
                    }

                }

                if (parentCell) {
                    console.log(g.indexOf(curr));
                    correctEmbedding(g.indexOf(curr) - g.indexOf(parentCell) - 1, parentCell, curr);

                }

                //console.log(this);
                console.log(this);
                //this.renderActivity();
                this.trigger("renderActivity");
            }
        },

        /**
         * Manages the movement of the pointer when
         * the user is dragging the cell, highlighting the cell
         * under the pointer; this is a
         * callback to the 'pointermove' event on the view.
         * @name ProjectView#pointerMoveFunction
         * @function
         * @param {joint.dia.ElementView} cellView the dragged cell's view
         */
        pointerMoveFunction: function (cellView) {
            var cell = cellView.model;
            if (cell.get("type").startsWith("activity")) {

                var cellViewsBelow = this.findViewsFromPoint(cell.getBBox().center());

                if (cellViewsBelow.length > 0) {
                    // Note that the findViewsFromPoint() returns the view for the `cell` itself.

                    // ho modificato il comportamento di default descritto nelle API perché sennò prendeva sempre il
                    /// primo trovato (_.find).
                    // prendendo l'ultimo sono sicuro che sia quello più interessante per l'user.

                    var index = _.findLastIndex(cellViewsBelow, function (c) {
                        return c.model.id !== cell.id
                    });


                    v = this.model.getElements();


                    for (i = 0; i < v.length; i++) {

                        this.findViewByModel(v[i]).unhighlight();

                    }

                    if (index != -1) {
                        cellViewBelow = cellViewsBelow[index];
                        cellViewBelow.highlight();
                        this.isHighlighted = true;

                        //console.log("view highlight");
                        // console.log(cellViewBelow);

                    }
                    else {
                        this.isHighlighted = false;
                    }
                }
            }

        },

        // if this.model.currentIndex != 'class'

        /**
         * Initializes `model` with a new `ProjectModel`;
         * initializes `paper` with a new `joint.dia.Paper` object;
         * link mouse events to the correct callbacks.
         * Updates the paper with any existing cells.
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
                background: {
                    color: '#6764A7'
                },

                elementView: function (element) {
                    if (element.get("type").startsWith("class")) {
                        if(element.get("type")=="class.HxComment"){
                            return joint.shapes.basic.TextBlockView;
                        }
                        else{
                            return celltypes.class.ClassDiagramElementView;
                        }

                    } else {
                        return celltypes.activity.ActivityDiagramElementView;
                    }
                },

                highlighting: {
                    'default': {
                        name: 'stroke',
                        options: {
                            padding: 3
                        }
                    }
                },

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
                isHighlighted: false,

                interactive: function (cellView) {
                    if (cellView.model instanceof joint.dia.Link) {
                        // Disable the default vertex add functionality on pointerdown.
                        return {vertexAdd: false};
                    }


                    return true;
                }
            });


            this.paper.on('cell:pointerup', this.pointerUpFunction);
            this.paper.on('cell:pointermove', this.pointerMoveFunction);
            this.paper.on('cell:pointerdown', this.pointerDownFunction);

            console.log(this);
            var m = this.model;

            this.renderActivity();

            $(document).on('keydown',$.proxy(this.deleteCell,this));

            this.listenTo(this.paper, 'renderActivity', this.renderActivity);
            this.listenTo(this.model, 'renderActivity', function () {
                this.pointerDownFunction(this.paper.findView(this.graph.get("cells").models[0]), {}, 0, 0);
                this.pointerUpFunction({}, {}, 0, 0);
                //this.renderActivity();
            });
            this.listenTo(this.model, 'addcell', function () {
                this.renderActivity();
            });
        },

        /**
         * ...
         * @name ProjectView#switch
         * @function
         * @param {number} index which graph to switch to
         * @param {?} selectedCell ?
         */
        switch: function (id) {
            this.model.switchToGraph(id);
            if (id != "class") {
                this.visibleElements = this.model.getClassVisibileElements(this.paper.selectedCell);
            }
            else {
                this.visibleElements = [];
            }

            console.log("elementi: ", this.visibleElements);
            this.paper.selectedCell = null;
            //console.log("ah oh perchè non triggeri");
            this.paper.trigger("changed-cell");
            this.trigger("Switchgraph");
        },

        /**
         * ...
         * @name ProjectView#getCurrentDiagramType
         * @function
         */
        getCurrentDiagramType: function () {
            return this.model.getCurrentDiagramType();
        },
        deleteMethodAt: function (ind) {
            this.model.deleteMethodDiagram(this.paper.selectedCell.getValues().methods[ind].id);
        }

    });
    return new ProjectView;
});
