import { ChristmasYardOrnamentProvider } from "./holiday/Christmas/ChristmasYardOrnamentProvider";
import { ChristmasTableclothPatternProvider } from "./holiday/Christmas/ChristmasTableclothPatternProvider";
import { ChistmasWallHangingProvider } from "./holiday/Christmas/ChristmasWallHangingProvider";
import { HalloweenTableclothPatternProvider } from "./holiday/Halloween/HalloweenTableclothPatternProvider";
import { HalloweenWallHangingProvider } from "./holiday/Halloween/HalloweenWallHangingProvider";
import { HalloweenYardOrnamentProvider } from "./holiday/Halloween/HalloweenYardOrnamentProvider";
import {
	OrnamentProviderFactory,
	PatternProviderFactory,
	WallHangingProviderFactory,
} from "./ProviderFactories";

export abstract class DecorationSetFactory {
	abstract getWallHanging(): WallHangingProviderFactory;
	abstract getTableclothPattern(): PatternProviderFactory;
	abstract getOrnament(): OrnamentProviderFactory;
}

export class HalloweenDecorationSetFactory extends DecorationSetFactory {
	getWallHanging(): WallHangingProviderFactory {
		return new HalloweenWallHangingProvider();
	}
	getTableclothPattern(): PatternProviderFactory {
		return new HalloweenTableclothPatternProvider();
	}
	getOrnament(): OrnamentProviderFactory {
		return new HalloweenYardOrnamentProvider();
	}
}

export class ChristmasDecorationSetFactory extends DecorationSetFactory {
	getWallHanging(): WallHangingProviderFactory {
		return new ChistmasWallHangingProvider();
	}
	getTableclothPattern(): PatternProviderFactory {
		return new ChristmasTableclothPatternProvider();
	}
	getOrnament(): OrnamentProviderFactory {
		return new ChristmasYardOrnamentProvider();
	}
}
