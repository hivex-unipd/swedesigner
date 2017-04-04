var assert = require('assert');
var requirejs = require('requirejs');

requirejs.config({
    baseUrl: '../',
    paths: {
        jquery: 'libs/jquery/jquery',
        lodash: 'libs/lodash/lodash',
        backbone: 'libs/backbone/backbone',
        text: 'libs/require/text',
        joint: 'libs/jointjs/joint',
        material: 'libs/mdl/material'
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

describe('AppView', function(done) {
	describe('views', function() {
		var app_view;
		before(function (done) {
			//requirejs(['../node_modules/cheerio/lib/cheerio.js'], function (document) {
				requirejs(['../views/AppView.js'], function (AppView) {
					app_view = new AppView;
					done();
				});
			//});
		});
		it('should be correct...', function() {
			assert.equal(app_view, {});
		});
	});
});
