"use strict";
exports.__esModule = true;
exports.DecorationPlacer = void 0;
var DecorationPlacer = /** @class */ (function () {
    function DecorationPlacer(decorationSetFactory) {
        this.tableclothPattern = decorationSetFactory.getTableclothPattern();
        this.wallHanging = decorationSetFactory.getWallHanging();
        this.yardOrnament = decorationSetFactory.getOrnament();
    }
    DecorationPlacer.prototype.placeDecorations = function () {
        return ("Everything was ready for the party. The " +
            this.yardOrnament.getOrnament() +
            " was in front of the house, the " +
            this.wallHanging.getHanging() +
            " was hanging on the wall, and the tablecloth with " +
            this.tableclothPattern.getTablecloth() +
            " was spread over the table.");
    };
    return DecorationPlacer;
}());
exports.DecorationPlacer = DecorationPlacer;
