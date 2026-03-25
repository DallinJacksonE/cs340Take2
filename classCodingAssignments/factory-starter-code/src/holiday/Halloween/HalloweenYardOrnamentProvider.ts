import { OrnamentProviderFactory } from "../../ProviderFactories";

export class HalloweenYardOrnamentProvider implements OrnamentProviderFactory {
	getOrnament(): string {
		return "jack-o-lantern";
	}
}
