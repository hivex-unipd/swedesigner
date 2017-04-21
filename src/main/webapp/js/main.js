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

require(['views/AppView'], function (AppView) {
    var app_view = new AppView;
});
