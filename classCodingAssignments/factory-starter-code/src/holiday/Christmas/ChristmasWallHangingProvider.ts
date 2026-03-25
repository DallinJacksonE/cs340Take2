import { WallHangingProviderFactory } from "../../ProviderFactories";

export class ChistmasWallHangingProvider implements WallHangingProviderFactory {
	getHanging(): string {
		return "wreath";
	}
}
