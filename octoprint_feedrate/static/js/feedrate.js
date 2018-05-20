$(function() {
    function FeedRateViewModel(parameters) {
        var self = this;

        self.FeedRateModel = parameters[0];
        self.settings = parameters[1];

        self.feedRate = ko.observable();
        self.feedRate("N/A "); //set the initial value for page load
        self.frUnits = ko.observable();
        self.displayUnits = ko.observable();

        //the value isn't really used anywhere at the moment, for now it's just for reference
        self.settings.available_units = new ko.observable([
            {value: "1", name: "mm/sec"},
            {value: "60", name: "mm/min"},
        ]);
        
        self.onBeforeBinding = function () {
            self.updateSettings();
        }
        
        self.updateSettings = function() {
            self.frUnits(self.settings.settings.plugins.feedrate.frUnits());
            self.displayUnits(self.settings.settings.plugins.feedrate.displayUnits());
        }
        
        self.onSettingsHidden = function () {
            self.updateSettings();
        }
        
        self.feedSpeed = ko.computed(function () {
            var display = self.displayUnits();  //get the user's settings preferences
            var slicer = self.frUnits();        //for slicer / display units in string form
            var speed = 0                       //init speed
            display = (display === "mm/sec") ? 1:60; //reassign a numerical value based on settings string
            slicer = (slicer === "mm/sec") ? 1:60;   //is there a better way? Probably
            speed = display / slicer * self.feedRate();
            speed = Math.floor(speed);
            if (!speed) {
                speed = "N/A "
            }
            return speed;
        });
        
        self.onDataUpdaterPluginMessage = function(plugin, data) {
            if (plugin != "feedrate") {
                return;
            }
            if (data.feedRate) {
                self.feedRate(data.feedRate)
            }
        };
    }


    OCTOPRINT_VIEWMODELS.push({
        construct: FeedRateViewModel,
        
        dependencies: ["printerStateViewModel","settingsViewModel"],
        elements: ["#navbar_plugin_feedrate","#settings_plugin_feedrate_link"]
    });

});
