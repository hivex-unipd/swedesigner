/*require(['js/views/detailsview.js'], function (DetailsView) {
	var dview = new DetailsView;
	var abc = dview.views;
	console.log("hola");
	var evt = document.createEvent('HTMLEvents');
	var result = !evt.initEvent('cell:pointerdown', true, true); // initEvent(event type, bubbling, cancelable)
	dview.paper.el.dispatchEvent(evt);
	assert(dview.model.attributes.cells.models == 'a');
});*/

require(['js/models/celltypes/celltypes.js'], function (celltypes) {
	var y = new celltypes.class.HxInterface;
	//throw "bla bla";
	console.log(y);
});
