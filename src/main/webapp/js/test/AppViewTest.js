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

require(['js/views/AppView.js'], function (AppView) {
	var app_view = new AppView;
	var x = app_view.views;
	throw "bla bla";
	console.log(x);
});
