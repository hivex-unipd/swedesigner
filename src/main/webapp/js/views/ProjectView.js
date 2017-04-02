define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'models/ProjectModel'

], function ($, _, Backbone, joint, ProjectModel) {


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

            //_.bindAll();


            // per qualche satanica ragione cell:pointerclick non funziona
            /// e pointerup funziona. FML.
            /*
             this.paper.on('cell:pointerclick', function (cellView, evt, x, y)
             {



             });*/

            this.paper.on('cell:pointerdown', function (cellView, evt, x, y) {

                if(cellView)
                {
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
                        x += "|" + g[d].get("keyvalues").comment[0] + "|";
                    }
                    console.log(x);
                };

                debug();
                console.log("SPOSTO", g[currentIndex].get("keyvalues").comment[0]);

                move(g, currentIndex, g.length-1);

                for (var i = 0; i < figli.length; i++) {
                    console.log("SPOSTO", g[currentIndex].get("keyvalues").comment[0]);

                    move(g, currentIndex, g.length-1);
                    debug();
                }
                debug();

            });

            var pointerUpFunction = function (cellView, evt, x, y) {
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
                        x += "|" + g[d].get("keyvalues").comment[0] + "|";
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


                var correctEmbedding = function(index, parent, cell)
                {
                    var embcells = parent.getEmbeddedCells();

                    console.log("correggo embed");
                    var deba = parent.get("embeds");

                    var deb = [];
                    for(var i=0;i<embcells.length;i++)
                    {
                        deb.push(embcells[i].get("keyvalues").comment[0]);
                    }
                    console.log(deb);


                    parent.unembed(embcells.pop(cell));
                    for(var i=0;i<embcells.length;i++)
                    {
                        parent.unembed(embcells[i]);
                        console.log(embcells[i].id, "deembedded");
                    }
                    console.log(parent, "parent");



                    for(var i=0; i<index+1;i++)
                    {
                        console.log("e1", embcells[i].get("keyvalues").comment[0]);
                        parent.embed(embcells[i]);
                        console.log(parent);
                    }
                    console.log("c", cell.get("keyvalues").comment[0]);
                    parent.embed(cell);
                    console.log(parent);

                    for (var i=index+1;i<embcells.length;i++)
                    {
                        console.log("e2", embcells[i].get("keyvalues").comment[0]);
                        parent.embed(embcells[i]);
                    }
                    console.log("corretti embed");

                    embcells = parent.getEmbeddedCells();
                    deb = [];
                    for(var i=0;i<embcells.length;i++)
                    {
                        deb.push(embcells[i].get("keyvalues").comment[0]);
                    }
                    console.log(deb);


                };

                // se parentCell esiste
                if(parentCell)
                {
                    // se parentCell ha solo me come figlio: yee! apposto, ho trovato del posto.
                    if(parentCell.get("embeds").length == 1 && parentCell.get("embeds")[0] == this.selectedCell.id)
                    {
                        console.log("non ho fratelli :(");
                        debug();
                        var dest = g.indexOf(parentCell)+1;
                        //move(g, g.length-1-figli.length, dest);

                        console.log("caso con unico figlio e parentcell");
                        for (var i = 0; i <= figli.length; i++) {
                            move(g, g.length-1-figli.length+i, dest+i);
                            debug();
                        }
                    }
                    // altrimenti: sono disponibili più di un posto e dobbiamo trovare quello migliore.
                    else
                    {

                        console.log(g);
                        console.log("i miei fratelli sono:");
                        var ff = parentCell.get("embeds");
                        console.log(ff);
                        console.log(this.model.getCell(ff[0]));
                        var found = false;

                        fratelli = [];
                        var frad = [];
                        for(var i=0; i<ff.length;i++)
                        {
                            if(ff[i]!=curr.id) {
                                fratelli.push(ff[i]);
                                frad.push(this.model.getCell(ff[i]).get("keyvalues").comment[0]);
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
                        for(var i=0; i < fratelli.length && !found;i++)
                        {
                            // i miei fratelli sono in ordine di y crescente.
                            // il primo fratello che mi supera in y è quello che mi seguirà
                            console.log(y, " < ", this.model.getCell(fratelli[i]).get("position").y);
                            if(y < this.model.getCell(fratelli[i]).get("position").y)
                            {

                                found = true;
                                if(i!=0) {
                                    console.log("pezzo buggato?");
                                    // bad
                                    // se non è il primo dentro il blocco
                                    var dest = g.indexOf(this.model.getCell(fratelli[i-1]));
                                    dest+= this.model.getCell(fratelli[i-1]).getEmbeddedCells({deep:true}).length;
                                    //dest = dest + this.model.getCell(fratelli[i]).getEmbeddedCells({deep: true}).length;
                                    //dest--;


                                    correctEmbedding(i-1,parentCell,curr);
                                    for (var j = 0; j <= figli.length; j++) {
                                        move(g, g.length - 1 - figli.length + j, dest + j +1);
                                        debug();
                                    }
                                }
                                else
                                {
                                    console.log("i=0");
                                    var dest = g.indexOf(parentCell);
                                    dest++;

                                    correctEmbedding(0,parentCell,curr);

                                    for (var j = 0; j <= figli.length; j++) {
                                        move(g, g.length - 1 - figli.length + j, dest + j);
                                        debug();
                                    }

                                }
                            }
                        }
                        // non ho trovato posto perché ho la y più grande di tutti i miei fratelli
                        if(!found){
                            console.log("y grande");
                            //var dest = getNextIndexByID(this.model, fratelli,fratelli.length-1);
                            //dest--;
                            var index = 0;
                            if(fratelli[fratelli.length-1] == curr.id)
                            {
                                index = fratelli.length-2;
                            }
                            else
                            {
                                // bad
                                //console.log("non dovrebbe mai accadere");
                                index = fratelli.length-1;
                            }


                            var dest = g.indexOf(this.model.getCell(fratelli[index]));

                            console.log(this.model.getCell(fratelli[index]).getEmbeddedCells({deep:true}).length);
                            dest = dest + this.model.getCell(fratelli[index]).getEmbeddedCells({deep:true}).length;
                            dest++;

                            correctEmbedding(index,parentCell,curr);

                            for (var w = 0; w <= figli.length; w++) {
                                move(g, g.length-1-figli.length+w, dest+w);
                                debug();
                            }
                        }
                    }
                }
                // è a livello 0
                else
                {
                    console.log("caso livello 0");
                    var fratelli = [];
                    for(var i = 0; i<g.length;i++)
                    {
                        if(!g[i].get("parent"))
                        {
                            fratelli.push(g[i]);
                        }
                    } console.log(fratelli.length);

                    var found2 = false;
                    for(var i=0;i<fratelli.length && ! found2; i++)
                    {
                        if(fratelli[i]!=curr.id && y<this.model.getCell(fratelli[i]).get("position").y)
                        {
                            console.log("trovato");
                            found2 = true;
                            var dest = g.indexOf(this.model.getCell(fratelli[i]));
                            console.log(dest);

                            console.log(figli);
                            console.log(figli.length);
                            var k =0;
                            //correctEmbedding(i,parentCell,curr);

                            for ( k = 0; k <= figli.length; k++) {
                                console.log("ciclo",k);
                                move(g, g.length-1-figli.length+k, dest+k);
                                debug();
                            }
                            console.log(k, "<=", figli.length, k<=figli.length);
                            console.log(figli.length);

                            console.log(figli);

                        } else {console.log("avanti");}
                    }

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





            };

            var pointerUpFunction2 = function (cellView, evt, x, y) {
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

                    for (var d = 0; d < g.length; d++) {
                        x += "|" + g[d].get("keyvalues").comment[0] + "|";
                    }
                    console.log(x);
                };

                var getNextIndex = function (g, c) {
                    var l = g[c].getEmbeddedCells({deep: true}).length;
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

                // incremento indice di quanto necessario per spostarla visivamente

                var nextCell = getNext(g, currentIndex);
                var nextCellIndex = getNextIndex(g, currentIndex);

                //nextIndex = nextCellIndex;
                //var prevCell = getPrev(this.model, g,prevIndex);
                //var prevCellIndex = getPrevIndex(this.model, g, prevIndex);


                if (nextCellIndex < g.length && g[currentIndex].get("position").y > g[nextCellIndex].get("position").y) {
                    console.log(curr.get("keyvalues").comment[0], g[nextIndex].get("keyvalues").comment[0]);
                    console.log(g[currentIndex].get("position").y, ">", g[nextIndex].get("position").y);
                    console.log(nextIndex, "<", g.length);

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
                    //while( false &&
                    //    nextIndex<g.length
                    //    && parentCell.get("embeds").indexOf(g[nextIndex])==-1
                    // finché non trovo g[nextIndex] nel mio parent continuo a cercare
                    //&& !g[nextIndex] == getNext(g,parentCell)
                    // oppure nel caso sono andato troppo oltre, basta (ho raggiunto il prossimo blocco)

                    /// da nextindex risalgo fino a trovare X tale che X e currentIndex sono fratelli


                    //&& this.model.getCommonAncestor(g[currentIndex],g[nextIndex])
                    //&& !parentCell.get("embeds").indexOf(g[nextIndex])

                    //{
                    //    console.log("avaanti");
                    //    nextIndex++;
                    //}
                    // nextIndex--;


                }


                // decremento indice di quanto necessario per spostarla visivamente

                while (prevIndex - 1 >= 0 && curr.get("position").y < g[prevIndex - 1].get("position").y) {
                    console.log(curr.get("keyvalues").comment[0], g[prevIndex - 1].get("keyvalues").comment[0]);
                    console.log(g[currentIndex].get("position").y, "<", g[prevIndex - 1].get("position").y);
                    console.log(prevIndex - 1, "<", g.length);

                    prevIndex--;
                    // trovare algoritmo per saltare quelli non giusti
                }
                /* while( false &&
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
                 */

                //prevIndex = getPrevIndex(this.model, g,prevIndex);


                if (!nextCell) {
                }


                //console.log(nextCell.get("keyvalues").comment,
                //    prevCell.get("keyvalues").comment);

                console.log(currentIndex);
                console.log(nextIndex);
                console.log(prevIndex);

                var figli = g[currentIndex].getEmbeddedCells({deep: true});


                // controlla se ha embeddato senza muoversi in alto o basso
                if (nextIndex == prevIndex) {
                    console.log("mosso ma non in alto/basso");


                }

                // se ho spostato in basso
                else if (nextIndex != currentIndex) {
                    console.log("spostato in basso");
                    // devo spostare solo blocchi dello stesso livello
                    console.log(g[nextIndex].get("keyvalues").comment[0]);

                    /*
                     if(parentCell != g[nextIndex] && parentCell)
                     {
                     while ( parentCell.get("embeds").indexOf(g[nextIndex].id) == -1 || g[currentIndex] == g[nextIndex])
                     // ovviamente g[currentCell] lo è già
                     // contrtollo pure che tra gli embed non ci sia la currentcell (non mi posso fidare di lei
                     {
                     console.log("non ho trovato ",
                     g[nextIndex].get("keyvalues").comment[0], " dentro ", parentCell.get("keyvalues").comment[0]);
                     nextIndex--;
                     }
                     console.log(" ho trovato ",
                     g[nextIndex].get("keyvalues").comment[0], " dentro ", parentCell.get("keyvalues").comment[0]);

                     nextIndex = getNextIndex(g, nextIndex);
                     console.log("seleziono", g[nextIndex].get("keyvalues").comment[0]);
                     nextIndex--;
                     console.log("seleziono", g[nextIndex].get("keyvalues").comment[0]);

                     }*/


                    // && g[nextIndex].get("parent") != g[currentIndex].get("parent")
                    // && !(g[currentIndex].get("parent") == g[nextIndex].id)
                    // && this.model.getCommonAncestor(g[currentIndex], g[nextIndex])
                    //  ) {
                    //  console.log(g[nextIndex].get("keyvalues").comment[0]);

                    //   nextIndex+=g[nextIndex].getEmbeddedCells({deep:true}).length;
                    //}

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

                    console.log(g[prevIndex].get("keyvalues").comment[0]);
                    //prevIndex--;
                    console.log(g[prevIndex].get("keyvalues").comment[0]);
                    /*
                     while (parentCell != g[prevIndex] && parentCell.get("embeds").indexOf(g[prevIndex].id) == -1) // ovviamente g[currentCell] lo è già
                     {
                     console.log("non ho trovato ",
                     g[prevIndex].get("keyvalues").comment[0], " dentro ", parentCell.get("keyvalues").comment[0]);

                     prevIndex--;
                     }
                     console.log("trovato ", g[prevIndex].get("keyvalues").comment[0], " dentro ", parentCell.get("keyvalues").comment[0]);

                     prevIndex = getNextIndex(g, prevIndex);
                     console.log("passo a ", g[prevIndex].get("keyvalues").comment[0]);
                     //prevIndex--;
                     */

                    debug();

                    move(g, currentIndex, prevIndex);

                    for (var i = 1; i <= figli.length; i++) {
                        debug();

                        move(g, currentIndex + i, prevIndex + i);
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

            };


            var pointerUpFunction3 = function (cellView, evt, x, y) {
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

                    for (var d = 0; j < g.length; d++) {
                        x += "|" + g[d].get("keyvalues").comment[0] + "|";
                    }
                    console.log(x);
                };


                if (nextIndex <= g.length - 1 && curr.get("position").y > g[nextIndex].get("position").y) {
                    while (nextIndex <= g.length - 1 && curr.get("position").y > g[nextIndex].get("position").y) {
                        nextIndex++;
                    }

                    // if(nextIndex >= g.length) { nextIndex = g.length-1;}
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
                         while(g[nextIndex-1].get("embeds") && this.model.getCommonAncestor(g[currentIndex], g[nextIndex-1]) && nextIndex< g.length )
                         {
                         console.log(this.model.getCommonAncestor(g[currentIndex], g[nextIndex-1]).get("keyvalues").comment);

                         nextIndex++;
                         console.log("+");
                         }*/
                        /*console.log(g[nextIndex-1].getAncestors()[0]);
                         console.log(g[nextIndex-1].getAncestors()[0].get("keyvalues").comment);
                         console.log(g[currentIndex].getAncestors()[0].get("keyvalues").comment);
                         while(g[nextIndex].getAncestors()[0]!=g[currentIndex].getAncestors()[0] && nextIndex < g.length)
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

                //while(g[currentIndex] in g[nextIndex].getAncestors()) {nextIndex++;}

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
                         while(g[prevIndex].get("embeds") && this.model.getCommonAncestor(g[currentIndex], g[prevIndex]) && prevIndex > 0 )
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
                         if(g[prevIndex+1].get("parent") != g[currentIndex].get("parent"))
                         {
                         console.log("i seguenti sono diversi");
                         console.log(g[prevIndex+1].get("parent"));
                         console.log(">>> ");
                         console.log(g[currentIndex].get("parent"));

                         while(prevIndex+1 > 0
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
                     if(index+1<=g.length-1 && curr.get("position").y > g[index+1].get("position").y)
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
                     if(index-1>=1 && curr.get("position").y < g[index-1].get("position").y )
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

            };

            this.paper.on('cell:pointermove', function (cellView) {
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

            });
            this.paper.on('cell:pointerup', pointerUpFunction);
            /*
             this.paper.on('blank:pointerdown', function (evt, x, y) {
             //console.log(evt);
             //console.log(x,y);
             });*/

            this.model.addInitialsCells();
            //this.trigger("cell:pointerup"); // come faccio a triggerare la cosa che ho definito sopra?

            console.log(this);
            // pointerUpFunction();

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