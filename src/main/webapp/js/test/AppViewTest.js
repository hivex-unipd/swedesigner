var assert = require('assert');
var requirejs = require('requirejs');

describe('AppView', function() {
	describe('views', function() {
		it('should contain three elements (all three defined)', function() {
			requirejs(['../main.js'], function(main) {
				var app_view = new main.AppView;
				assert.equal(app_view.views.length == 3);
				for (var i = 0; i < app_view.views.length; i++)
					assert.equal(app_view.views[i] != undefined);
			});
		});
	});
});
