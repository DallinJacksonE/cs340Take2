import { OrnamentProviderFactory } from "../../ProviderFactories";

export class ChristmasYardOrnamentProvider implements OrnamentProviderFactory {
	getOrnament(): string {
		return "snowman";
	}
}
