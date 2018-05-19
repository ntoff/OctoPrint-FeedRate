## OctoPrint-FeedRate

Puts the last sent feedrate number (G1 X20 Y90 Z2 E69 **F2000** <-- that number) into the navbar.

*Note: Because most printers contain some sort of buffer, the last sent feedrate may not be the actual feedrate the printer is currently operating at. This plugin is to be used only as a rough guide / estimate.*

## Manual Install

zippy zippy copy pasty

    https://github.com/ntoff/OctoPrint-FeedRate/archive/master.zip


### Disclaimer

The math is janky, the performance is questionable. I have no clue what displaying this value in real time will do to print quality. Use at your own risk.