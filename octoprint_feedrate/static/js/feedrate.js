$(function() {
    function FeedRateViewModel(parameters) {
        var self = this;

        self.FeedRateModel = parameters[0];
        self.settings = parameters[1];

        self.feedRate = ko.observable();
        self.feedRate("N/A ")
        self.frUnits = ko.observable();
        self.displayUnits = ko.observable();

        //see deez keez? use them to figure out the values rather than if then else
        self.settings.available_units = new ko.observable([
            {key: "1", name: gettext("mm/sec")},
            {key: "60", name: gettext("mm/min")},
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
        
        // I should probably figure out the value a better way, if then else is so 1990 but meh it's 1:30am
        self.feedSpeed = function () {
            var display = self.displayUnits();
            var slicer = self.frUnits();
            var speed = 0
            if (display === "mm/sec") {
                display = 1;
            }
            else {
                display = 60;
            }
            if (slicer === "mm/sec") {
                slicer = 1;
            }
            else {
                slicer = 60;
            }
            speed = display / slicer * self.feedRate();
            speed = Math.floor(speed);
            if (!speed) {
                speed = "N/A "
            }
            return speed;
        };
        
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
