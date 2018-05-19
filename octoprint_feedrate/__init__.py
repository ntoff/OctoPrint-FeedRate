# coding=utf-8
from __future__ import absolute_import

import re
import octoprint.plugin

class FeedRatePlugin(octoprint.plugin.StartupPlugin,
                     octoprint.plugin.TemplatePlugin,
                     octoprint.plugin.SettingsPlugin,
                     octoprint.plugin.AssetPlugin):

    def __init__(self):
        self.feedRate = "N/A"

    def on_after_startup(self):
        self.get_settings_updates()

    def get_settings_defaults(self):
        return dict(
            frUnits="mm/min",
            displayUnits="mm/sec"
        )

    def get_template_configs(self):
        return [
            dict(type="settings", custom_bindings=False)
        ]
    
    def on_settings_save(self, data):
        s = self._settings
        if "frUnits" in data.keys():
            s.set(["frUnits"], data["frUnits"])
        if "displayUnits" in data.keys():
            s.set(["displayUnits"], data["displayUnits"])
        s.save()

    def process_gcode(self, comm_instance, phase, cmd, cmd_type, gcode, *args, **kwargs):
        if gcode and gcode.startswith(('G1', 'G0')):
            s = re.search("F(\d*\.?\d*)", cmd)
            if s and s.group(1):
                s = s.group(1)
                self.feedRate = s
                self._plugin_manager.send_plugin_message(self._identifier, dict(feedRate=self.feedRate))
        return None

    def get_assets(self):
        return { 
            "js": ["js/feedrate.js"],
            "css": ["css/feedrate.css"],
            "less": ["less/feedrate.less"]
        }

    def get_update_information(self):
        return dict(
            costestimation=dict(
                displayName="Navbar FeedRate",
                displayVersion=self._plugin_version,

                type="github_release",
                user="ntoff",
                repo="OctoPrint-FeedRate",
                current=self._plugin_version,

                pip="https://github.com/ntoff/OctoPrint-FeedRate/archive/{target_version}.zip"
            )
        )

__plugin_name__ = "Navbar FeedRate"
__plugin_description__ = "Last seen feedrate value for your navbar pleasure"
__plugin_url__ = "https://github.com/ntoff/OctoPrint-FeedRate"
__plugin_author_email__ = "" 
__plugin_author__ = "ntoff"

def __plugin_load__():
    global __plugin_implementation__
    __plugin_implementation__ = FeedRatePlugin()
    
    global __plugin_hooks__
    __plugin_hooks__ = {
        "octoprint.comm.protocol.gcode.sent": __plugin_implementation__.process_gcode,
        "octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information
    }