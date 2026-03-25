"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.ChristmasDecorationSetFactory = exports.HalloweenDecorationSetFactory = exports.DecorationSetFactory = void 0;
var ChristmasYardOrnamentProvider_1 = require("./holiday/Christmas/ChristmasYardOrnamentProvider");
var ChristmasTableclothPatternProvider_1 = require("./holiday/Christmas/ChristmasTableclothPatternProvider");
var ChristmasWallHangingProvider_1 = require("./holiday/Christmas/ChristmasWallHangingProvider");
var HalloweenTableclothPatternProvider_1 = require("./holiday/Halloween/HalloweenTableclothPatternProvider");
var HalloweenWallHangingProvider_1 = require("./holiday/Halloween/HalloweenWallHangingProvider");
var HalloweenYardOrnamentProvider_1 = require("./holiday/Halloween/HalloweenYardOrnamentProvider");
var DecorationSetFactory = /** @class */ (function () {
    function DecorationSetFactory() {
    }
    return DecorationSetFactory;
}());
exports.DecorationSetFactory = DecorationSetFactory;
var HalloweenDecorationSetFactory = /** @class */ (function (_super) {
    __extends(HalloweenDecorationSetFactory, _super);
    function HalloweenDecorationSetFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HalloweenDecorationSetFactory.prototype.getWallHanging = function () {
        return new HalloweenWallHangingProvider_1.HalloweenWallHangingProvider();
    };
    HalloweenDecorationSetFactory.prototype.getTableclothPattern = function () {
        return new HalloweenTableclothPatternProvider_1.HalloweenTableclothPatternProvider();
    };
    HalloweenDecorationSetFactory.prototype.getOrnament = function () {
        return new HalloweenYardOrnamentProvider_1.HalloweenYardOrnamentProvider();
    };
    return HalloweenDecorationSetFactory;
}(DecorationSetFactory));
exports.HalloweenDecorationSetFactory = HalloweenDecorationSetFactory;
var ChristmasDecorationSetFactory = /** @class */ (function (_super) {
    __extends(ChristmasDecorationSetFactory, _super);
    function ChristmasDecorationSetFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChristmasDecorationSetFactory.prototype.getWallHanging = function () {
        return new ChristmasWallHangingProvider_1.ChistmasWallHangingProvider();
    };
    ChristmasDecorationSetFactory.prototype.getTableclothPattern = function () {
        return new ChristmasTableclothPatternProvider_1.ChristmasTableclothPatternProvider();
    };
    ChristmasDecorationSetFactory.prototype.getOrnament = function () {
        return new ChristmasYardOrnamentProvider_1.ChristmasYardOrnamentProvider();
    };
    return ChristmasDecorationSetFactory;
}(DecorationSetFactory));
exports.ChristmasDecorationSetFactory = ChristmasDecorationSetFactory;
