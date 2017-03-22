/**
 * Created by matte on 22/03/2017.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'models/ProjectModel',
],function ($, _, Backbone, ProjectModel) {
    var Commands ={
        saveDiagram: function () {
            ProjectModel.saveDiagram();
        },
        loadDiagram: function() {
                var files = window.event.target.files; // FileList object
                f = files[0];
                var reader = new FileReader();

                // Closure to capture the file information.
                reader.onload = function(e) {
                        // Render thumbnail.
                        JsonObj = e.target.result;
                        //console.log(JsonObj);
                        ProjectModel.loadDiagram(JsonObj);
                    };
            reader.readAsText(f);
            }
        };
    Commands.execute = function ( name ) {
        return Commands[name] && Commands[name].apply( Commands, [].slice.call(arguments, 1) );
    };
    return Commands;
});