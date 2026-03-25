import { DecorationSetFactory } from "../DecorationSetFactory";
import { HalloweenTableclothPatternProvider } from "../holiday/Halloween/HalloweenTableclothPatternProvider";
import { HalloweenWallHangingProvider } from "../holiday/Halloween/HalloweenWallHangingProvider";
import { HalloweenYardOrnamentProvider } from "../holiday/Halloween/HalloweenYardOrnamentProvider";
import {
	OrnamentProviderFactory,
	PatternProviderFactory,
	WallHangingProviderFactory,
} from "../ProviderFactories";

export class DecorationPlacer {
	private tableclothPattern: PatternProviderFactory;
	private wallHanging: WallHangingProviderFactory;
	private yardOrnament: OrnamentProviderFactory;

	public constructor(decorationSetFactory: DecorationSetFactory) {
		this.tableclothPattern = decorationSetFactory.getTableclothPattern();
		this.wallHanging = decorationSetFactory.getWallHanging();
		this.yardOrnament = decorationSetFactory.getOrnament();
	}

	placeDecorations(): string {
		return (
			"Everything was ready for the party. The " +
			this.yardOrnament.getOrnament() +
			" was in front of the house, the " +
			this.wallHanging.getHanging() +
			" was hanging on the wall, and the tablecloth with " +
			this.tableclothPattern.getTablecloth() +
			" was spread over the table."
		);
	}
}
