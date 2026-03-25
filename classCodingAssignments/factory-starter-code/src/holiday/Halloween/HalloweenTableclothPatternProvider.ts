import { PatternProviderFactory } from "../../ProviderFactories";

export class HalloweenTableclothPatternProvider implements PatternProviderFactory {
	getTablecloth(): string {
		return "ghosts and skeletons";
	}
}
