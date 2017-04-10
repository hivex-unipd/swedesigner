require.config({
	baseUrl: 'js/',
	paths: {
		jquery: 'libs/jquery/jquery',
		lodash: 'libs/lodash/lodash',
		backbone: 'libs/backbone/backbone',
		text: 'libs/require/text',
		joint: 'libs/jointjs/joint',
		material: 'libs/mdl/material',
		jqueryui: 'libs/jqueryui/jquery-ui'
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
	'models/newcellfactory'
], function (backbone, joint, AppView, NewCellFactory) {

	// testing function:
	var assert = function (condition, message) {
		if (!condition)
			throw "non vale che " + message;
	}



	var app_view = new AppView; // AppView

	var views = app_view.views;
	assert(views != undefined, 'AppView.views è un oggetto');



	var pview = views.project; // ProjectView
	assert(pview instanceof backbone.View, 'AppView.views.project è una backbone.View');

	var paper = pview.paper;
	assert(paper instanceof joint.dia.Paper, 'ProjectView.paper è un joint.dia.Paper');



	var dview = views.details; // DetailsView
	assert(dview instanceof backbone.View, 'AppView.views.details è una backbone.View');



	var ncview = views.newCell; // NewCellView
	assert(ncview instanceof backbone.View, 'AppView.views.newCell è una backbone.View');



	var ncfactory = NewCellFactory; // NewCellFactory

	assert(ncfactory.getCell('HxClass').defaults.type == 'class.HxClass', 'NewCellFactory è in grado di fornire una HxClass');
	assert(ncfactory.getCell('HxInterface').defaults.type == 'class.HxInterface', 'NewCellFactory è in grado di fornire una HxInterface');
	assert(ncfactory.getCell('HxComment').defaults.type == 'class.HxComment', 'NewCellFactory è in grado di fornire un HxComment');
	assert(ncfactory.getCell('HxGeneralization').defaults.type == 'class.HxGeneralization', 'NewCellFactory è in grado di fornire una HxGeneralization');
	assert(ncfactory.getCell('HxAssociation').defaults.type == 'class.HxAssociation', 'NewCellFactory è in grado di fornire una HxAssociation');
	assert(ncfactory.getCell('HxImplementation').defaults.type == 'class.HxImplementation', 'NewCellFactory è in grado di fornire una HxImplementation');

	assert(ncfactory.getCell('HxCustom').defaults.type == 'activity.HxCustom', 'NewCellFactory è in grado di fornire un HxCustom');
	assert(ncfactory.getCell('HxElse').defaults.type == 'activity.HxElse', 'NewCellFactory è in grado di fornire un HxElse');
	assert(ncfactory.getCell('HxFor').defaults.type == 'activity.HxFor', 'NewCellFactory è in grado di fornire un HxFor');
	assert(ncfactory.getCell('HxIf').defaults.type == 'activity.HxIf', 'NewCellFactory è in grado di fornire un HxIf');
	assert(ncfactory.getCell('HxVariable').defaults.type == 'activity.HxVariable', 'NewCellFactory è in grado di fornire una HxVariable');
	assert(ncfactory.getCell('HxReturn').defaults.type == 'activity.HxReturn', 'NewCellFactory è in grado di fornire un HxReturn');
	assert(ncfactory.getCell('HxWhile').defaults.type == 'activity.HxWhile', 'NewCellFactory è in grado di fornire un HxWhile');
});
