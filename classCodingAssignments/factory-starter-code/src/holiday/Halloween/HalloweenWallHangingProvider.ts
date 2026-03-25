import { WallHangingProviderFactory } from "../../ProviderFactories";

export class HalloweenWallHangingProvider implements WallHangingProviderFactory {
	getHanging(): string {
		return "spider-web";
	}
}
