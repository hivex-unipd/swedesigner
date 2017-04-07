define([
    'jquery',
    'underscore',
    'backbone',
    'models/ProjectModel',
], function ($, _, Backbone, ProjectModel) {

    /**
     * @classdesc `Commands` exposes methods which represent the main
     * actions that a user can perform in the application.
     *
     * @module client.models
     * @name Commands
     * @class Commands
     */
    var Commands = {

        /**
         * Asks the `ProjectModel` object to save the whole project
         * to a JSON file; then gives the file to the user.
         * @name Commands#saveDiagram
         * @function
         */
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

        /**
         * Asks the `ProjectModel` object to load an entire project
         * from a JSON file uploaded by the user.
         * @name Commands#loadDiagram
         * @function
         * @param {event} evt the action event
         */
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
        },
		
		
		sendDiagram: function () {
			var data = {};
			
			
			// construct an HTTP request
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "/generate", true);
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			
			// send the collected data as JSON
			xhr.send(saveDiagram());
			
			xhr.onloadend = function () {
				// done
				alert("fatto!");
			};

		},
    };

    /**
     * Executes the `Commands` method whose name matches `name`.
     * @name Commands#execute
     * @function
     * @param {string} name the command to be executed
     */
    Commands.execute = function (name) {
        return Commands[name] && Commands[name].apply(Commands, [].slice.call(arguments, 1));
    };

    return Commands;
});
