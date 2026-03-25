"use strict";
exports.__esModule = true;
var DecorationPlacer_1 = require("./decoration/DecorationPlacer");
var DecorationSetFactory_1 = require("./DecorationSetFactory");
main();
function main() {
    var HalloweenDecorations = new DecorationPlacer_1.DecorationPlacer(new DecorationSetFactory_1.HalloweenDecorationSetFactory());
    var ChristmasDecorations = new DecorationPlacer_1.DecorationPlacer(new DecorationSetFactory_1.ChristmasDecorationSetFactory());
    console.log(HalloweenDecorations.placeDecorations());
    console.log(ChristmasDecorations.placeDecorations());
}
