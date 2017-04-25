define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'models/ProjectModel',
    'models/celltypes/celltypes',
    'svg-pan-zoom',
    'jstree'
], function ($, _, Backbone, joint, ProjectModel, celltypes,svgPanZoom) {

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
         *
         */
        visibleElements: [],

        panAndZoom:{},


        deleteCell: function (e) {
            if (e.which == 46) {//ha premuto tasto canc
                if (this.paper.selectedCell) {
                    this.model.deleteCell(this.paper.selectedCell);

                    this.paper.selectedCell=null;
                    this.paper.trigger("changed-cell");
                }
            }
        },
        /**
         * Updates the drawing area by placing the activity blocks.
         * @name ProjectView#renderActivity
         * @function
         */
        renderActivity: function () {

            // piccolo bugfix orribile
            _.each(this.model.graph.get("cells").models, function (el) {
                el.set("z", 1);
            });

            // CODICE OK
            var debug = function () {
                var x = "";

                for (var d = 0; d < g.length; d++) {
                    x += "|" + g[d].get("values").comment[0] + "|";
                }
                console.log(x);
            };
            var m = this.model;
            var p = this.paper;
            var g = m.graph.get("cells").models;
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
                }

                var l = g.length;
                for (ii = 0; ii < l; ii++) {
                    g[ii].updateRectangles();
                    p.removeView(g[ii]);
                    p.renderView(g[ii]); // per qualche ragione è necessario..
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




            if(ProjectModel.options.cellToBeAdded && ProjectModel.options.cellToBeAdded.isLink()){
                console.log(ProjectModel.options.cellToBeAdded.get("source").id);
                if(ProjectModel.options.cellToBeAdded.get("source").id!=undefined){
                    console.log("set target");
                    ProjectModel.options.cellToBeAdded.set("target",{id:cellView.model.id});
                    ProjectModel.addCellToGraph();
                }
                else{
                    console.log("set source");
                    ProjectModel.options.cellToBeAdded.set("source",{id:cellView.model.id});
                }
            }


            if (cellView) {
                if (this.selectedCell != cellView.model) {
                    changed = true;
                    this.selectedCell = cellView.model;
                    if (true) {//cellView.model instanceof joint.shapes.uml.ClassDiagramElement) {
                        this.trigger("changed-cell");
                    }
                }
            }

            if (cellView.model.get("type").startsWith("activity")) {
                var cell = cellView.model;

                if (cell.get('parent')) {
                    this.model.getCell(cell.get('parent')).unembed(cell);
                }
                var g = this.model.attributes.cells.models;

                var currentCell = this.selectedCell;
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
            //panAndZoom.disablePan();
            if (cellView.model.get("type").startsWith("activity")) {
                var parentCell = null;
                var embedded = false;
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
                        if (cellViewBelow && cellViewBelow.model.get('parent') !== cell.id && cellViewBelow.model.get("canHaveChildren")) {

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

                    // deeembeddo ogni cella
                    parent.unembed(embcells.pop(cell));

                    for (var i = 0; i < embcells.length; i++) {
                        parent.unembed(embcells[i]);
                    }

                    // embeddo celle da i ad index
                    for (var i = 0; i < index && i < embcells.length; i++) {
                        parent.embed(embcells[i]);
                    }

                    // embeddo la cella in input
                    parent.embed(cell);


                    // embeddo le celle rimanenti
                    for (var i = index; i < embcells.length; i++) {
                        parent.embed(embcells[i]);
                    }
                };

                // se parentCell esiste
                if (parentCell) {
                    // se parentCell ha solo me come figlio: yee! apposto, ho trovato del posto.
                    if (parentCell.get("embeds").length == 1 && parentCell.get("embeds")[0] == this.selectedCell.id) {
                        console.log("non ho fratelli :(");
                        debug();
                        var dest = g.indexOf(parentCell) + 1;
                        for (var i = 0; i <= figli.length; i++) {
                            move(g, g.length - 1 - figli.length + i, dest + i);
                            debug();
                        }
                    }
                    // altrimenti: sono disponibili più di un posto e dobbiamo trovare quello migliore.
                    else {
                        var ff = parentCell.get("embeds");
                        var found = false;

                        fratelli = [];
                        for (var i = 0; i < ff.length; i++) {
                            if (ff[i] != curr.id) {
                                fratelli.push(ff[i]);
                            }
                        }

                        for (var i = 0; i < fratelli.length && !found; i++) {
                            // i miei fratelli sono in ordine di y crescente.
                            // il primo fratello che mi supera in y è quello che mi seguirà
                            if (y < this.model.getCell(fratelli[i]).get("position").y) {

                                found = true;
                                if (i != 0) {
                                    // bad
                                    // se non è il primo dentro il blocco
                                    var dest = g.indexOf(this.model.getCell(fratelli[i - 1]));
                                    dest += this.model.getCell(fratelli[i - 1]).getEmbeddedCells({deep: true}).length;
                                    // correctEmbedding(i-1,parentCell,curr);
                                    for (var j = 0; j <= figli.length; j++) {
                                        move(g, g.length - 1 - figli.length + j, dest + j + 1);
                                        debug();
                                    }
                                }
                                else {
                                    var dest = g.indexOf(parentCell);
                                    dest++;
                                    for (var j = 0; j <= figli.length; j++) {
                                        move(g, g.length - 1 - figli.length + j, dest + j);
                                        debug();
                                    }

                                }
                            }
                        }
                        // non ho trovato posto perché ho la y più grande di tutti i miei fratelli
                        if (!found) {
                            var index = 0;
                            if (fratelli[fratelli.length - 1] == curr.id) {
                                index = fratelli.length - 2;
                            }
                            else {
                                // bad
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
                            var k = 0;

                            for (k = 0; k <= figli.length; k++) {
                                move(g, g.length - 1 - figli.length + k, dest + k);
                                debug();
                            }

                        }
                    }

                }

                if (parentCell) {
                    console.log(g.indexOf(curr));
                    correctEmbedding(g.indexOf(curr) - g.indexOf(parentCell) - 1, parentCell, curr);

                }
                this.trigger("renderActivity");
            }
        },

        /**
         * Manages the movement of the pointer when
         * the user is dragging the cell, highlighting the cell
         * under the pointer;
         * this is a callback to the 'pointermove' event on the view.
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
                    

                    if (index != -1 && cellViewsBelow[index].model.get("canHaveChildren")) {
                        cellViewBelow = cellViewsBelow[index];
                        cellViewBelow.highlight();
                        this.isHighlighted = true;
                    }
                    else {
                        this.isHighlighted = false;
                    }
                }
            }

        },
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
                height: 2000,
                gridSize: 6,
                drawGrid: true,
                background: {
                    color: '#6764A7'
                },
                elementView: function (element) {
                    if (element.get("type").startsWith("class")) {
                        if (element.get("type") == "class.HxComment") {
                            return joint.shapes.basic.TextBlockView;
                        }
                        else {
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

                linkView: joint.dia.LinkView.extend({
                    pointerdblclick: function (evt, x, y) {
                        if (joint.V(evt.target).hasClass('connection') || joint.V(evt.target).hasClass('connection-wrap')) {
                            this.addVertex({x: x, y: y});
                        }
                    },
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

            var gridsize = 1;
            var currentScale = 1;
            var targetElement= $('#paper')[0];

            console.log(svgPanZoom);
            function setGrid(paper, size, color, offset) {
                // Set grid size on the JointJS paper object (joint.dia.Paper instance)
                paper.options.gridSize = gridsize;
                // Draw a grid into the HTML 5 canvas and convert it to a data URI image
                var canvas = $('<canvas/>', { width: size, height: size });
                canvas[0].width = size;
                canvas[0].height = size;
                var context = canvas[0].getContext('2d');
                context.beginPath();
                context.rect(1, 1, 1, 1);
                context.fillStyle = color || '#AAAAAA';
                context.fill();
                // Finally, set the grid background image of the paper container element.
                var gridBackgroundImage = canvas[0].toDataURL('image/png');
                $(paper.el.childNodes[0]).css('background-image', 'url("' + gridBackgroundImage + '")');
                if(typeof(offset) != 'undefined'){
                    $(paper.el.childNodes[0]).css('background-position', offset.x + 'px ' + offset.y + 'px');
                }
            }

              this.panAndZoom = svgPanZoom(targetElement.childNodes[0],
                {
                    viewportSelector: targetElement.childNodes[0].childNodes[0],
                    minZoom: 0.5,
                    maxZoom: 10,
                    fit: false,
                    center:false,
                    dblClickZoomEnabled:false,
                    zoomScaleSensitivity: 0.4,
                    controlIconsEnabled:true,
                    panEnabled: true,
                    onZoom: function(scale){
                        console.log(scale);
                        currentScale = scale;
                        //setGrid(this.paper, gridsize*15*currentScale, '#808080');
                    },
                    beforePan: function(oldpan, newpan){
                        $('.joint-paper').css('cursor', '-webkit-grabbing');
                        //setGrid(this.paper, gridsize*15*currentScale, '#808080', newpan);
                    }
                });
            //spostiamo a mano
            $('#svg-pan-zoom-controls').attr("transform",'translate(' + ( $('#paper').width() - 70 ) + ' ' + ( $('#paper').height() - 76 ) + ') scale(0.75)');
            //this.panAndZoom.enableControlIcons();


            var pAndZ= this.panAndZoom;

            this.paper.on('blank:pointerdown', function (evt, x, y) {
                console.log(ProjectModel.options.cellToBeAdded);
                if(ProjectModel.options.cellToBeAdded && ProjectModel.options.cellToBeAdded.isElement()){
                    console.log("blank add");
                    ProjectModel.options.cellToBeAdded.position(x,y);
                    ProjectModel.addCellToGraph();
                }

                pAndZ.enablePan();


            });
            this.paper.on('blank:pointerup', function(event,x,y) {
                console.log("pointeup",x,y);

                pAndZ.disablePan();
                $('.joint-paper').css('cursor', '-webkit-grab');

            });
            this.paper.on('cell:pointerup', this.pointerUpFunction);
            this.paper.on('cell:pointermove', this.pointerMoveFunction);
            this.paper.on('cell:pointerdown', this.pointerDownFunction);

            var m = this.model;

            this.renderActivity();

            $(document).on('keydown', $.proxy(this.deleteCell, this));

            this.listenTo(this.paper, 'renderActivity', this.renderActivity);
            this.listenTo(this.model, 'renderActivity', function () {
                this.pointerDownFunction(this.paper.findView(this.graph.get("cells").models[0]), {}, 0, 0);
                this.pointerUpFunction({}, {}, 0, 0);
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
            this.panAndZoom.reset();
            this.model.switchToGraph(id);
            if (id != "class") {
                this.visibleElements = this.model.getClassVisibleElements(this.paper.selectedCell);
            }
            else {
                this.visibleElements = [];
            }

            $('#classtree').jstree({'core':{
                'data':[
                    {
                        'text':"classe1",
                        'state':{
                          'opened':true
                        },
                        'children':[
                            {
                                'text':"metodo1(param1,param2):int"
                            },
                            {
                                'text':"attr1:int"
                            }
                        ]
                    }
                ]

            }});

            console.log("elementi: ", this.visibleElements);
            this.paper.selectedCell = null;
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
