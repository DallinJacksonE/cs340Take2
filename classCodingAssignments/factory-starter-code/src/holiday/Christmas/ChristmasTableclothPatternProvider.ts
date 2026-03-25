import { PatternProviderFactory } from "../../ProviderFactories";

export class ChristmasTableclothPatternProvider implements PatternProviderFactory {
	getTablecloth(): string {
		return "Santa and reindeers";
	}
}
