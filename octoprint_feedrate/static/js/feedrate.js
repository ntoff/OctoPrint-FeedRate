$(function() {
    function FeedRateViewModel(parameters) {
        var self = this;

        self.FeedRateModel = parameters[0];
        self.settings = parameters[1];

        self.feedRate = ko.observable();
        self.feedRate("N/A")
        self.frUnits = ko.observable();
        
        self.onBeforeBinding = function() {
            self.frUnits(self.settings.settings.plugins.feedrate.frUnits());
        }

        self.onDataUpdaterPluginMessage = function(plugin, data) {
            if (plugin != "feedrate") {
                return;
            }
            if (data.feedRate) {
                self.feedRate(data.feedRate)
            }
            //if (data.frUnits) {
            //    self.frUnits(data.frUnits)
            //}
        };
    }


    OCTOPRINT_VIEWMODELS.push({
        construct: FeedRateViewModel,
        
        dependencies: ["printerStateViewModel","settingsViewModel"],
        elements: ["#navbar_plugin_feedrate","#settings_plugin_feedrate_link"]
    });

});
