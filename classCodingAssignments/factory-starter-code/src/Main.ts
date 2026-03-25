import { DecorationPlacer } from "./decoration/DecorationPlacer";
import {
	ChristmasDecorationSetFactory,
	HalloweenDecorationSetFactory,
} from "./DecorationSetFactory";

main();

function main(): void {
	let HalloweenDecorations = new DecorationPlacer(
		new HalloweenDecorationSetFactory(),
	);
	let ChristmasDecorations = new DecorationPlacer(
		new ChristmasDecorationSetFactory(),
	);

	console.log(HalloweenDecorations.placeDecorations());
	console.log(ChristmasDecorations.placeDecorations());
}
