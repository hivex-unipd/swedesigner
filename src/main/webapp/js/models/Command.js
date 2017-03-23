/**
 * Created by matte on 22/03/2017.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'models/ProjectModel',
], function ($, _, Backbone, ProjectModel) {
    var Commands = {
        saveDiagram: function () {
            var blob = new Blob([ProjectModel.saveDiagram()], {type: "application/json"});
            var url = window.URL.createObjectURL(blob);

            //hacky things
            var a = document.createElement('a');
            a.style = "display:none";
            a.download = "project.json";
            a.href = url;
            a.textContent = "Download backup.json";
            $('details').append(a);
            a.click();
            $('details').remove(a);

        },
        loadDiagram: function (evt) {
            var files = evt.target.files; // FileList object
            f = files[0];
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = function (e) {
                // Render thumbnail.
                JsonObj = e.target.result;
                //console.log(JsonObj);
                ProjectModel.loadDiagram(JsonObj);
            };
            reader.readAsText(f);
        }
    };
    Commands.execute = function (name) {
        return Commands[name] && Commands[name].apply(Commands, [].slice.call(arguments, 1));
    };
    return Commands;
});
