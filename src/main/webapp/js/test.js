require.config({
	baseUrl: 'js/',
	paths: {
		jquery: 'libs/jquery/jquery',
		lodash: 'libs/lodash/lodash',
		backbone: 'libs/backbone/backbone',
		text: 'libs/require/text',
		joint: 'libs/jointjs/joint',
		material: 'libs/mdl/material',
		jqueryui: 'libs/jqueryui/jquery-ui',
		jstree:'libs/jquery/jstree',
        'svg-pan-zoom': 'libs/svgpanzoom/svg-pan-zoom'
	},
	shim: {
		'material': {
			exports: 'componentHandler'
		}
	},
	map: {
		'*': {
			'underscore': 'lodash'
		}
	}
});



require([
	'backbone',
	'joint',
	'views/AppView',
	'models/newcellfactory',
	'models/ProjectModel',
	'models/Command'
], function (backbone, joint, AppView, NewCellFactory, ProjectModel, Command) {

	// --- testing function:
	var assert = function (condition, message) {
		if (!condition)
			throw 'Non vale che "' + message + '"';
	}



	var app_view = new AppView; // AppView
	assert(app_view instanceof backbone.View, 'Una AppView è una backbone.View.');

	var views = app_view.views;
	assert(views != undefined, 'Una AppView possiede un oggetto views.');



	var pview = views.project; // ProjectView
	assert(pview instanceof backbone.View, 'Una ProjectView è una backbone.View.');

	pview.renderActivity(); assert(true, 'Una ProjectView è in grado di disegnare un diagramma di attività.');

	var paper = pview.paper;
	assert(paper instanceof joint.dia.Paper, 'Una ProjectView possiede un joint.dia.Paper.');



	var dview = views.details; // DetailsView
	assert(dview instanceof backbone.View, 'Una DetailsView è una backbone.View.');

	dview.render(); assert(true, 'Una DetailsView è in grado di disegnare il riquadro dei dettagli.');



	var ncview = views.newCell; // NewCellView
	assert(ncview instanceof backbone.View, 'Una NewCellView è una backbone.View.');

	ncview.render(); assert(true, 'Una NewCellView è in grado di disegnare il riquadro di creazione.');



	pmodel = ProjectModel; // ProjectModel
	assert(pmodel instanceof backbone.Model, 'Un ProjectModel è un backbone.Model.');

	pmodel.newProject(); assert(true, 'Un ProjectModel è in grado di creare un nuovo progetto.');



	ncmodel = ncview.model; // NewCellModel
	assert(ncmodel instanceof backbone.Model, 'Un NewCellModel è un backbone.Model.');



	var ncfactory = NewCellFactory; // NewCellFactory

	assert(ncfactory.getCell('HxClass').defaults.type == 'class.HxClass', 'Una NewCellFactory è in grado di fornire una HxClass.');
	assert(ncfactory.getCell('HxInterface').defaults.type == 'class.HxInterface', 'Una NewCellFactory è in grado di fornire una HxInterface.');
	assert(ncfactory.getCell('HxComment').defaults.type == 'class.HxComment', 'Una NewCellFactory è in grado di fornire un HxComment.');
	assert(ncfactory.getCell('HxGeneralization').defaults.type == 'class.HxGeneralization', 'Una NewCellFactory è in grado di fornire una HxGeneralization.');
	assert(ncfactory.getCell('HxAssociation').defaults.type == 'class.HxAssociation', 'Una NewCellFactory è in grado di fornire una HxAssociation.');
	assert(ncfactory.getCell('HxImplementation').defaults.type == 'class.HxImplementation', 'Una NewCellFactory è in grado di fornire una HxImplementation.');

	assert(ncfactory.getCell('HxCustom').defaults.type == 'activity.HxCustom', 'Una NewCellFactory è in grado di fornire un HxCustom.');
	assert(ncfactory.getCell('HxElse').defaults.type == 'activity.HxElse', 'Una NewCellFactory è in grado di fornire un HxElse.');
	assert(ncfactory.getCell('HxFor').defaults.type == 'activity.HxFor', 'Una NewCellFactory è in grado di fornire un HxFor.');
	assert(ncfactory.getCell('HxIf').defaults.type == 'activity.HxIf', 'Una NewCellFactory è in grado di fornire un HxIf.');
	assert(ncfactory.getCell('HxVariable').defaults.type == 'activity.HxVariable', 'Una NewCellFactory è in grado di fornire una HxVariable.');
	assert(ncfactory.getCell('HxReturn').defaults.type == 'activity.HxReturn', 'Una NewCellFactory è in grado di fornire un HxReturn.');
	assert(ncfactory.getCell('HxWhile').defaults.type == 'activity.HxWhile', 'Una NewCellFactory è in grado di fornire un HxWhile.');



	cmd = Command; // Command

	cmd.newProject({}); assert(true, 'Un Command è in grado di creare un nuovo progetto.');
});
