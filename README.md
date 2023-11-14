# Marble Machine X Programmer

UI to visualize and share MMX Song Programs.

The goal is to have something that translates a (playable) MIDI into pin locations for the programming drum,
maybe show programming mistakes (like two notes being too close to each other) and then have a file format
to save /share your work. Since this tool runs completely in the browser, no server storage is intended.

## Current status

* MIDI upload is present but requires some unusual conventions. It is planned to be overhauled.
* No export other than SVG
* The UI shows a grid of pins, but it doesn't fully correspond yet to how it looks on the machine.
* So far it's only useful to put virtual pins in place and use that as a reference.

## Credits

Based on [Sebastiaan Jansen's](https://github.com/whitebird) earlier work for making laser cutting templates: https://github.com/Wintergatan/midimarblemachine
