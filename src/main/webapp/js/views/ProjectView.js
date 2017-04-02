define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'models/ProjectModel'

], function ($, _, Backbone, joint, ProjectModel) {


    /**
     * @classdesc `ProjectView` represents the drawing area.
     * It can be the main class diagram or the activity diagram
     * of a particular method.
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
         * Initializes the view's `model` with a new `ProjectModel`;
         * initializes the view's `paper` with a new `joint.dia.Paper` object;
         * links mouse dragging events to the right callbacks.
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
                        // Disable the default vertexAdd functionality on 'pointerdown' event.
                        return {vertexAdd: false};
                    }

                    return true;
                }
            });

            //_.bindAll();


            // per qualche satanica ragione cell:pointerclick non funziona
            /// e pointerup funziona. FML.
            /*
             this.paper.on('cell:pointerclick', function (cellView, evt, x, y)
             {


             });*/

            this.paper.on('cell:pointerdown', this.pointerDownFunction);
            this.paper.on('cell:pointermove', this.pointerMoveFunction);
            this.paper.on('cell:pointerup', this.pointerUpFunction);
            /*
             this.paper.on('blank:pointerdown', function (evt, x, y) {
             //console.log(evt);
             //console.log(x,y);
             });*/

            this.model.addInitialsCells();
            //this.trigger("cell:pointerup"); // come faccio a triggerare la cosa che ho definito sopra?

            console.log(this);
            // this.pointerUpFunction();

        },

        /**
         * Manages the moment when the user is attempting
         * to drag the cell with the pointer; this is a callback
         * to the 'pointerdown' event on the view.
         * @name ProjectView#pointerUpFunction
         * @function
         */
        pointerDownFunction: function (cellView, evt, x, y) {
            var cell = cellView.model;

            if (!cell.get('embeds') || cell.get('embeds').length === 0) {
                // Show the dragged element above all the other cells (except when the
                // element is a parent).
                //cell.toFront();
            }

            if (cell.get('parent')) {
                this.model.getCell(cell.get('parent')).unembed(cell);
            }
        },

        /**
         * Manages the release of the pointer from a cell
         * (i.e. when the user has finished dragging the cell);
         * this is a callback to the 'pointerup' event on the view.
         * @name ProjectView#pointerUpFunction
         * @function
         */
        pointerUpFunction: function (cellView, evt, x, y) {
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

            var g = this.model.attributes.cells.models;

            // cella corrente
            var curr = this.selectedCell;

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

            // questi sono gli indici di destinazione
            var nextIndex = currentIndex;
            var prevIndex = currentIndex;

            // se non è highlighted, butto tutto a livello 0 di profondità (senza parent)
            // da fare

            // funzione di debug
            var debug = function () {
                var x = "";

                for (j = 0; j < g.length; j++) {
                    x += "|" + g[j].get("keyvalues").comment[0] + "|";
                }
                console.log(x);
            };

            var getNextIndex = function (g, c) {
                var l = g[c].getEmbeddedCells({deep: true}).length;
                return c+l+1;
            };

            var getNext = function (g, c) {
                var l = g[c].getEmbeddedCells({deep: true}).length;
                return g[c+l+1];
            };

            var getPrev = function (m, g, c) {
                var p = g[c].get("parent");
                // se non esiste?
                if (p)
                {
                    p = m.getCell(p);

                    for (var i=0;i<p.getEmbeddedCells().length;i++)
                    {
                        if (getNext(g, c+i+1) == g[c])
                        {
                            return g[c+i+1];
                        }
                    }
                }
                else
                {
                    var i = c-1;
                    while (g[i] && g[i].get("parent")) { i--; }
                    //if (!g[i]) return g[0];
                    return g[i];
                }
            };

            var getPrevIndex = function (m, g, c) {
                var p = g[c].get("parent");
                // se non esiste?
                if (p)
                {
                    p = m.getCell(p);
                    for (var i=0;i<p.getEmbeddedCells().length;i++)
                    {
                        if (getNext(g, c+i+1) == g[c])
                        {
                            return c+i+1;
                        }
                    }
                }
                else
                {
                    var i = c-1;
                    while (g[i] && g[i].get("parent")) { i--; }
                    //if (!g[i]) return undefined;

                    console.log("previndex: ", i);
                    return i;
                }
            };

            // incremento indice di quanto necessario per spostarla visivamente

            var nextCell = getNext(g, currentIndex);
            var nextCellIndex = getNextIndex(g, currentIndex);

            //nextIndex = nextCellIndex;
            //var prevCell = getPrev(this.model, g,prevIndex);
            //var prevCellIndex = getPrevIndex(this.model, g, prevIndex);



            if (nextCellIndex < g.length && g[currentIndex].get("position").y > g[nextCellIndex].get("position").y)
            {
                console.log(curr.get("keyvalues").comment[0], g[nextIndex].get("keyvalues").comment[0]);
                console.log(g[currentIndex].get("position").y, ">", g[nextIndex].get("position").y);
                console.log(nextIndex,"<", g.length);

                nextIndex = nextCellIndex;
                while (nextIndex < g.length && g[currentIndex].get("position").y > g[nextIndex].get("position").y) {
                    //nextCell = getNext(g,currentIndex);
                    //nextCellIndex = getNextIndex(g, nextCellIndex);
                    //nextIndex = nextCellIndex;
                    console.log("wtf??");
                    //nextIndex = getNextIndex(g,nextIndex);
                    nextIndex++;
                }
                nextIndex--;
                //console.log(nextIndex<g.length, this.model.getCommonAncestor(g[currentIndex],g[nextIndex])
                //    , !parentCell.get("embeds").indexOf(g[nextIndex]) );


                // trovare algoritmo per saltare quelli non giusti
                while ( false &&
                    nextIndex<g.length
                    && parentCell.get("embeds").indexOf(g[nextIndex])==-1
                    // finché non trovo g[nextIndex] nel mio parent continuo a cercare
                    //&& !g[nextIndex] == getNext(g,parentCell)
                    // oppure nel caso sono andato troppo oltre, basta (ho raggiunto il prossimo blocco)

                //&& this.model.getCommonAncestor(g[currentIndex],g[nextIndex])
                //&& !parentCell.get("embeds").indexOf(g[nextIndex])
                    )
                {
                    console.log("avaanti");
                    nextIndex++;
                }
                // nextIndex--;


            }


            // decremento indice di quanto necessario per spostarla visivamente

            while (prevIndex-1 >= 0 && curr.get("position").y < g[prevIndex-1].get("position").y) {
                console.log(curr.get("keyvalues").comment[0], g[prevIndex-1].get("keyvalues").comment[0]);
                console.log(g[currentIndex].get("position").y, "<", g[prevIndex-1].get("position").y);
                console.log(prevIndex-1,"<", g.length);

                prevIndex--;
                // trovare algoritmo per saltare quelli non giusti

                while ( false &&
                    prevIndex>0
                && parentCell.get("embeds").indexOf(g[prevIndex])==-1
                    && !g[prevIndex] == parentCell

                    //&& g[prevIndex].get("parent") != g[currentIndex].get("parent")
                //&& !parentCell.get("embeds").indexOf(g[prevIndex])
                    )
                {

                    //console.log(prevIndex>0, g[prevIndex].get("parent") != g[currentIndex].get("parent") , !g[prevIndex].get("embeds"));

                    prevIndex--;
                    console.log("retro");

                }
                console.log(prevIndex>0, g[prevIndex].get("parent") != g[currentIndex].get("parent") , !g[prevIndex].get("embeds"));



                //prevIndex = getPrevIndex(this.model, g,prevIndex);
            }

            if (!nextCell) { }


            //console.log(nextCell.get("keyvalues").comment,
            //    prevCell.get("keyvalues").comment);

            console.log(currentIndex);
            console.log(nextIndex);
            console.log(prevIndex);

            var figli = g[currentIndex].getEmbeddedCells({deep: true});

            // controlla se ha embeddato senza muoversi in alto o basso
            if (nextIndex == prevIndex) {
                console.log("mosso ma non in alto/basso");
                if (embedded) {
                    // posiziona all'ultimo posto degli figli della cella
                    /*while (nextIndex < g.length
                    && this.model.getCommonAncestor(g[currentIndex], g[nextIndex]))
                    {
                        nextIndex++;
                    }
                    //move(g, currentIndex, nextIndex);

                    for (var i = 0; i < figli.length; i++) {
                        move(g, currentIndex, nextIndex);
                        debug();
                    }*/
                }
            }

            // se ho spostato in basso
            else if (nextIndex != currentIndex) {
                console.log("spostato in basso");
                // devo spostare solo blocchi dello stesso livello
                console.log(g[nextIndex].get("keyvalues").comment[0]);


                if (false &&
                nextIndex < g.length - 1
                && g[nextIndex].getEmbeddedCells({deep:true})



                // && g[nextIndex].get("parent") != g[currentIndex].get("parent")
                    // && !(g[currentIndex].get("parent") == g[nextIndex].id)
                    // && this.model.getCommonAncestor(g[currentIndex], g[nextIndex])
                    ) {
                    console.log(g[nextIndex].get("keyvalues").comment[0]);

                    nextIndex+=g[nextIndex].getEmbeddedCells({deep:true}).length;
                }

                debug();
                move(g, currentIndex, nextIndex);

                for (var i = 0; i < figli.length; i++) {
                    move(g, currentIndex, nextIndex);
                    debug();
                }
            }

            // controllo se la cella è andata in altro, oltre altri blocchi
            if (prevIndex != currentIndex) {
                console.log("spostato in alto");
                // se le celle non sono allo stesso livello blabla
                if ( false &&
                    prevIndex > 0

                    )
                {
                    prevIndex--;
                }


                debug();

                move(g, currentIndex, prevIndex);

                for (var i = 1; i <= figli.length; i++) {
                    debug();

                    move(g, currentIndex+i, prevIndex+i);
                }
                debug();
            }


            // CODICE OK
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

                if (g[ii].get("type") == "uml.ActivityDiagramElement") {
                    g[ii].updateRectangles();
                    this.removeView(g[ii]);
                    this.renderView(g[ii]); // per qualche ragione è necessario..

                }

                else {
                    console.log(g[ii]);
                    console.log("questo no :(");
                }

            }

        },

        /**
         * Manages the release of the pointer from a cell
         * (i.e. when the user has finished dragging the cell) - 3;
         * this is a callback to the 'pointerup' event on the view.
         * @name ProjectView#pointerUpFunction3
         * @function
         */
        pointerUpFunction3: function (cellView, evt, x, y) {
            var changed = false;

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
                    }
                }
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


            var g = this.model.attributes.cells.models;
            console.log(this.model.attributes.cells);


            // cella corrente
            var curr = this.selectedCell;

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

            // questi sono gli indici di destinazione
            var nextIndex = currentIndex + 1;
            var prevIndex = currentIndex - 1;

            // se non è highlighted, butto tutto a livello 0 di profondità (senza parent)
            if (!this.isHighlighted) {
                console.log("not high");
                /*while (nextIndex < g.length - 1 && g[nextIndex + 1].get("parent")) {
                    nextIndex++;
                }
                while (prevIndex > 1 && g[prevIndex].get("parent")) {
                    prevIndex--;
                }*/
                console.log(nextIndex);
                console.log(prevIndex);
            }


            // ehm boh


            while (nextIndex <= g.length - 1 && g[nextIndex].getAncestors().indexOf(g[currentIndex]) != -1) {
                //console.log(g[currentIndex]);
                //console.log(g[nextIndex].getAncestors());
                nextIndex++;
                //console.log("yup");
            }


            /*
             while (prevIndex > 1 && g[prevIndex].getAncestors().indexOf(g[currentIndex]) != -1) {
             //console.log(g[currentIndex]);
             //console.log(g[nextIndex].getAncestors());
             prevIndex--;
             //console.log("yup");
             }*/

            // funzione di debug
            var debug = function () {
                var x = "";

                for (j = 0; j < g.length; j++) {
                    x += "|" + g[j].get("keyvalues").comment[0] + "|";
                }
                console.log(x);
            };


            if (nextIndex <= g.length - 1 && curr.get("position").y > g[nextIndex].get("position").y) {
                while (nextIndex <= g.length - 1 && curr.get("position").y > g[nextIndex].get("position").y) {
                    nextIndex++;
                }

                // if (nextIndex >= g.length) { nextIndex = g.length-1;}
                if (nextIndex != currentIndex + 1) {
                    var figli = g[currentIndex].getEmbeddedCells({deep: true});
                    console.log("figli");
                    console.log(figli);

                    //var n = g.getCommonAncestor([g[currentIndex], g[nextIndex]]);
                    // passo tutti i (eventuali) figli del prossimo


                    // console.log(this.model.getCommonAncestor(g[currentIndex], g[nextIndex-1]).get("keyvalues").comment);

                    // console.log(g[nextIndex-1].get("keyvalues").comment);

                    // console.log(g[nextIndex-1].get("embeds"));


                    //se le due celle prese non sono allo stesso livello, allora percorri la nextindex fino a trovare una allo stesso livello
                    /// oppure trovare il padre

                    console.log("questo è g");
                    console.log(g);

                    //console.log(g[nextIndex].get("keyvalues").comment);
                    //console.log(g[currentIndex].get("keyvalues").comment);
                    //console.log(g[nextIndex].get("parent"));
                    //console.log(g[currentIndex].get("parent"));
                    if (nextIndex != g.length && g[nextIndex].get("parent") != g[currentIndex].get("parent")) {
                        console.log("i seguenti sono diversi");
                        console.log(g[nextIndex].get("parent"));
                        console.log(">>> ");
                        console.log(g[currentIndex].get("parent"));

                        while (nextIndex <= g.length - 1
                        && g[nextIndex].get("parent") != g[currentIndex].get("parent")
                        && !(g[currentIndex].get("parent") == g[nextIndex].id)
                        && this.model.getCommonAncestor(g[currentIndex], g[nextIndex])
                            )
                            //&& (g[nextIndex].get("parent")))
                        {
                            console.log("questo era diverso");
                            console.log(g[nextIndex].get("parent"));
                            console.log(g[nextIndex].get("keyvalues").comment);
                            //console.log(g[currentIndex].get("parent"));

                            nextIndex++;
                        }
                    }


                    console.log(currentIndex);
                    console.log(nextIndex);


                    /*
                     while (g[nextIndex-1].get("embeds") && this.model.getCommonAncestor(g[currentIndex], g[nextIndex-1]) && nextIndex< g.length )
                     {
                     console.log(this.model.getCommonAncestor(g[currentIndex], g[nextIndex-1]).get("keyvalues").comment);

                     nextIndex++;
                     console.log("+");
                     }*/
                    /*console.log(g[nextIndex-1].getAncestors()[0]);
                     console.log(g[nextIndex-1].getAncestors()[0].get("keyvalues").comment);
                     console.log(g[currentIndex].getAncestors()[0].get("keyvalues").comment);
                     while (g[nextIndex].getAncestors()[0]!=g[currentIndex].getAncestors()[0] && nextIndex < g.length)
                     {
                     nextIndex++;
                     console.log("+");
                     }*/

                    debug();
                    //move(g, currentIndex, nextIndex - 1);

                    // debug();
                    //console.log("sposto ");
                    //console.log(currentIndex);
                    //console.log(nextIndex-1);
                    console.log(figli.length);
                    for (i = 0; i <= figli.length; i++) {
                        move(g, currentIndex, nextIndex - 1);
                        debug();
                        //console.log("sposto ");
                        //console.log(currentIndex);
                        //console.log(nextIndex-1+i);

                    }
                }
                //console.log("finito di spostare");
                //console.log(currentIndex);
                //console.log(nextIndex);
            }


            // controllo se la cella è andata in altro, oltre altri blocchi

            //while (g[currentIndex] in g[nextIndex].getAncestors()) {nextIndex++;}

            else if (prevIndex >= 0 && curr.get("position").y < g[prevIndex].get("position").y) {
                while (prevIndex >= 0 && curr.get("position").y < g[prevIndex].get("position").y) {
                    //console.log(curr.get("position").y );
                    // console.log(g[prevIndex].get("position").y);
                    prevIndex--;
                    //console.log(prevIndex);

                }
                if (prevIndex != currentIndex - 1) {
                    var figli = g[currentIndex].getEmbeddedCells({deep: true});
                    console.log(figli);

                    /*
                     while (g[prevIndex].get("embeds") && this.model.getCommonAncestor(g[currentIndex], g[prevIndex]) && prevIndex > 0 )
                     {
                     prevIndex--;
                     }
                     */


                    // se le celle non sono allo stesso livello blabla


                    console.log(g[prevIndex].get("keyvalues").comment[0]);
                    console.log(g[currentIndex].get("keyvalues").comment[0]);

                    console.log(g[currentIndex].get("parent"));

                    /*
                     if (g[prevIndex + 1].get("parent") != g[currentIndex].get("parent")) {

                     while (prevIndex+1 > 0
                     && g[prevIndex+1].get("parent") != g[currentIndex].get("parent")
                     && !(g[currentIndex].get("parent") == g[prevIndex + 1].id)
                     && this.model.getCommonAncestor(g[currentIndex], g[prevIndex+1])
                     && g[prevIndex].get("parent") != g[prevIndex-1].id
                     )
                     //&& (g[nextIndex].get("parent")))
                     {

                     console.log("cane");
                     prevIndex--;
                     console.log(g[prevIndex].get("keyvalues").comment[0]);

                     }
                     console.log(g[prevIndex].get("keyvalues").comment[0]);
                     }
                     */


                    /*
                     if (g[prevIndex+1].get("parent") != g[currentIndex].get("parent"))
                     {
                     console.log("i seguenti sono diversi");
                     console.log(g[prevIndex+1].get("parent"));
                     console.log(">>> ");
                     console.log(g[currentIndex].get("parent"));

                     while (prevIndex+1 > 0
                     && g[prevIndex+1].get("parent") != g[currentIndex].get("parent")
                     && !(g[currentIndex].get("parent") == g[prevIndex+1].id)
                     && this.model.getCommonAncestor(g[currentIndex],g[prevIndex+1])
                     )
                     //&& (g[nextIndex].get("parent")))
                     {
                     console.log("questo era diverso");
                     console.log(g[prevIndex+1].get("parent"));
                     console.log(g[prevIndex+1].get("keyvalues").comment);
                     //console.log(g[currentIndex].get("parent"));

                     prevIndex--;
                     }
                     }*/


                    move(g, currentIndex, prevIndex + 1);
                    //console.log("sposto ");
                    //console.log(currentIndex);
                    //console.log(prevIndex+1);
                    debug();

                    for (i = 1; i <= figli.length; i++) {
                        move(g, currentIndex + i, prevIndex + i + 1);
                        debug();
                        //console.log("sposto ");
                        //console.log(currentIndex+i);
                        //console.log(prevIndex+1+i);

                    }
                }


                /*
                 if (index+1<=g.length-1 && curr.get("position").y > g[index+1].get("position").y)
                 {
                 //curr.set("index", index+1);
                 // g[index+1].set("index", index); // -1+1 mi raccomando
                 //console.log(g);

                 move(g,index,index+1);
                 // console.log(g);

                 console.log("sposto>");
                 console.log(index) ;
                 }*/

                // sarebbe >=1 ma c'è ancora il link in mezzo (senza sarebbe 0)
                /*
                 if (index-1>=1 && curr.get("position").y < g[index-1].get("position").y )
                 {
                 ///curr.set("index", index-1);
                 // g[index-1].set("index", index); // -1+1 mi raccomando
                 //console.log(g);

                 move(g, index,index-1);
                 // console.log(g);
                 console.log("sposto<");
                 console.log(index) ;

                 }*/

            }


            // CODICE OK
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

                if (g[ii].get("type") == "uml.ActivityDiagramElement") {
                    g[ii].updateRectangles();
                    this.removeView(g[ii]);
                    this.renderView(g[ii]); // per qualche ragione è necessario..

                }

                else {
                    console.log(g[ii]);
                    console.log("questo no :(");
                }

            }

        },

        /**
         * Manages the movement of the pointer when
         * the user is dragging the cell; this is a
         * callback to the 'pointermove' event on the view.
         * @name ProjectView#pointerMoveFunction
         * @function
         */
        pointerMoveFunction: function (cellView) {
            var cell = cellView.model;

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

        },

        /**
         * Switches between different graph views.
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
