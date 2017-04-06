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
        visibleElements:[],

        /**
         * Initializes `model` with a new `ProjectModel`;
         * initializes `paper` with a new `joint.dia.Paper` object;
         * links mouse events to the right actions
         * [...]
         * @name ProjectView#initialize
         * @function
         */


        renderActivity: function () {
            // CODICE OK
            //console.log(this);
            //var g = this.paper.attributes.cells.models;
            var m = this.model;
            var p = this.paper;
            console.log(m);
            var g = m.graph.get("cells").models;
            console.log(g);
            if (g && m.options.currentindex != 'class') {
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

        pointerUpFunction: function (cellView, evt, x, y) {
            if (cellView.model.get("type").startsWith("activity")) {
                var changed = false;
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
                var currentIndex = g.indexOf(curr);//curr.get("index"); // è necessario cercare a che indice vorrebbe mettere la cosa

                // funzione di debug
                var debug = function () {
                    var x = "";

                    for (var d = 0; d < g.length; d++) {
                        x += "|" + g[d].get("values").comment[0] + "|";
                    }
                    console.log(x);
                };

                var getNextIndex = function (g, c) {
                    var l = g[c].getEmbeddedCells({deep: true}).length;
                    return c + l + 1;
                };
                var getNextIndexByID = function (graph, g, c) {
                    var l = graph.getCell(g[c]).getEmbeddedCells({deep: true}).length;
                    return c + l + 1;
                };

                var getNext = function (g, c) {
                    var l = g[c].getEmbeddedCells({deep: true}).length;
                    return g[c + l + 1];
                };

                var getPrev = function (m, g, c) {
                    var p = g[c].get("parent");
                    // se non esiste?
                    if (p) {
                        p = m.getCell(p);

                        for (var i = 0; i < p.getEmbeddedCells().length; i++) {
                            if (getNext(g, c + i + 1) == g[c]) {
                                return g[c + i + 1];
                            }
                        }
                    }
                    else {
                        var i = c - 1;
                        while (g[i] && g[i].get("parent")) {
                            i--;
                        }
                        //if(!g[i]) return g[0];
                        return g[i];
                    }
                };
                var getPrevIndex = function (m, g, c) {
                    var p = g[c].get("parent");
                    // se non esiste?
                    if (p) {
                        p = m.getCell(p);
                        for (var i = 0; i < p.getEmbeddedCells().length; i++) {
                            if (getNext(g, c + i + 1) == g[c]) {
                                return c + i + 1;
                            }
                        }
                    }
                    else {
                        var i = c - 1;
                        while (g[i] && g[i].get("parent")) {
                            i--;
                        }
                        //if(!g[i]) return undefined;

                        console.log("previndex: ", i);
                        return i;
                    }
                };


                var correctEmbedding = function (index, parent, cell) {
                    var embcells = parent.getEmbeddedCells();

                    console.log("correggo embed");
                    var deba = parent.get("embeds");

                    var deb = [];
                    for (var i = 0; i < embcells.length; i++) {
                        deb.push(embcells[i].get("values").comment[0]);
                    }
                    console.log(deb);


                    parent.unembed(embcells.pop(cell));
                    for (var i = 0; i < embcells.length; i++) {
                        parent.unembed(embcells[i]);
                        console.log(embcells[i].id, "deembedded");
                    }
                    console.log(parent, "parent");


                    //if(index==0)
                    //{
                    //	console.log("c", cell.get("keyvalues").comment[0]);
                    //	parent.embed(cell);
                    //	for (var i=index+1;i<embcells.length;i++)
                    //	{
                    //		console.log("e2", embcells[i].get("keyvalues").comment[0]);
                    //		parent.embed(embcells[i]);
                    //	}
                    //	console.log("corretti embed");
                    //
                    //}
                    //else
                    //{


                    for (var i = 0; i < index && i < embcells.length; i++) {
                        console.log("e1", embcells[i].get("values").comment[0]);
                        parent.embed(embcells[i]);
                        console.log(parent);
                    }
                    console.log("c", cell.get("values").comment[0]);
                    parent.embed(cell);
                    console.log(parent);

                    for (var i = index; i < embcells.length; i++) {
                        console.log("e2", embcells[i].get("values").comment[0]);
                        parent.embed(embcells[i]);
                    }
                    console.log("corretti embed");

                    //}

                    embcells = parent.getEmbeddedCells();
                    deb = [];
                    for (var i = 0; i < embcells.length; i++) {
                        deb.push(embcells[i].get("values").comment[0]);
                    }
                    console.log(deb);


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

                        console.log(g);
                        console.log("i miei fratelli sono:");
                        var ff = parentCell.get("embeds");
                        console.log(ff);
                        console.log(this.model.getCell(ff[0]));
                        var found = false;

                        fratelli = [];
                        var frad = [];
                        for (var i = 0; i < ff.length; i++) {
                            if (ff[i] != curr.id) {
                                fratelli.push(ff[i]);
                                frad.push(this.model.getCell(ff[i]).get("values").comment[0]);
                            }
                        }
                        console.log(frad);
                        /*
                         var fratelliOrdinati = [];
                         for(var i=0;i < g.length;i++)
                         {
                         if(fratelli.indexOf(g[i])!=-1)
                         {
                         fratelliOrdinati.push(g[i]);
                         }
                         }
                         fratelli = fratelliOrdinati;
                         */
                        for (var i = 0; i < fratelli.length && !found; i++) {
                            // i miei fratelli sono in ordine di y crescente.
                            // il primo fratello che mi supera in y è quello che mi seguirà
                            console.log(y, " < ", this.model.getCell(fratelli[i]).get("position").y);
                            if (y < this.model.getCell(fratelli[i]).get("position").y) {

                                found = true;
                                if (i != 0) {
                                    console.log("pezzo buggato?");
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
                                    console.log("i=0");
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
                            console.log("y grande");
                            //var dest = getNextIndexByID(this.model, fratelli,fratelli.length-1);
                            //dest--;
                            var index = 0;
                            if (fratelli[fratelli.length - 1] == curr.id) {
                                index = fratelli.length - 2;
                            }
                            else {
                                // bad
                                //console.log("non dovrebbe mai accadere");
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
                    console.log("caso livello 0");
                    var fratelli = [];
                    for (var i = 0; i < g.length; i++) {
                        if (!g[i].get("parent")) {
                            fratelli.push(g[i]);
                        }
                    }
                    console.log(fratelli.length);

                    var found2 = false;
                    for (var i = 0; i < fratelli.length && !found2; i++) {
                        if (fratelli[i] != curr.id && y < this.model.getCell(fratelli[i]).get("position").y) {
                            console.log("trovato");
                            found2 = true;
                            var dest = g.indexOf(this.model.getCell(fratelli[i]));
                            console.log(dest);

                            console.log(figli);
                            console.log(figli.length);
                            var k = 0;
                            //correctEmbedding(i,parentCell,curr);

                            for (k = 0; k <= figli.length; k++) {
                                console.log("ciclo", k);
                                move(g, g.length - 1 - figli.length + k, dest + k);
                                debug();
                            }
                            console.log(k, "<=", figli.length, k <= figli.length);
                            console.log(figli.length);

                            console.log(figli);

                        } else {
                            console.log("avanti");
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
                        return celltypes.class.ClassDiagramElementView;
                    }
                    else {
                        return celltypes.activity.ActivityDiagramElementView;
                    }
                },


                highlighting: {
                    'default': {
                        name: 'stroke',
                        options: {
                            padding: 3
                        }
                    },

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
                },


            });


            this.paper.on('cell:pointerup', this.pointerUpFunction);
            this.paper.on('cell:pointermove', this.pointerMoveFunction);


            this.paper.on('cell:pointerdown', this.pointerDownFunction);

            console.log(this);
            var m = this.model;

            this.renderActivity();


            this.listenTo(this.paper, 'renderActivity', this.renderActivity);
            this.listenTo(this.model, 'renderActivity', function () {
                this.pointerDownFunction(this.paper.findView(this.graph.get("cells").models[0]), {}, 0, 0);
                this.pointerUpFunction({}, {}, 0, 0);
            });
            this.listenTo(this.model, 'addcell', this.renderActivity);
            //pointerDownFunction();


            //zoom in futuro
            /*graphscale =1;
             this.paper.on('blank:mousewheel',function (evt, x, y, delta) {
             console.log(delta);
             graphscale+=delta*0.1;
             this.scale(graphscale,graphscale);
             });*/

            /*
             this.paper.on('blank:pointerdown', function (evt, x, y) {
             //console.log(evt);
             //console.log(x,y);
             });*/

            //this.model.addInitialsCells();
            //this.trigger("cell:pointerup"); // come faccio a triggerare la cosa che ho definito sopra?

            // console.log(this);
            // pointerUpFunction();

        },

        /**
         * ...
         * @name ProjectView#switch
         * @function
         * @param {number} index which graph to swith to
         * @param {?} selectedCell ?
         */
        switch: function (id) {
            this.model.switchToGraph(id);
            this.visibleElements = this.model.getClassVisibileElements(this.paper.selectedCell);
            console.log("elementi: ",this.visibleElements);
            this.paper.selectedCell= null;
            //console.log("ah oh perchè non triggeri");
            this.paper.trigger("changed-cell");
            this.trigger("Switchgraph");
        },
        getCurrentDiagramType: function () {
            return this.model.getCurrentDiagramType();
        }

    });
    return new ProjectView;
});