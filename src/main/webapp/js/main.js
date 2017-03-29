/**
 * Created by matte on 21/03/2017.
 */
require.config({
    baseUrl:'js/',
    paths: {
        jquery: 'libs/jquery/jquery',
        lodash: 'libs/lodash/lodash',
        backbone: 'libs/backbone/backbone',
        text: 'libs/require/text',
        joint: 'libs/jointjs/joint',
        material: 'libs/mdl/material'

    },
    shim:{
        'material': {
            exports: "componentHandler"
        }
    },
    map: {
        "*": {
            "underscore": "lodash"
        }
    }
});

require(['views/AppView'], function(AppView){
    var app_view = new AppView;
});