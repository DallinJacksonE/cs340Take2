
import { readFileSync } from 'node:fs';
import * as path from "path";

class ImageEditor {
  public static main(args: string[]) {
    new ImageEditor().run(args);

  }

  public run(args: string[]) {
    try {
      if (args.length < 3) {
        this.usage();
        return;
      }

      const inputFile: string = args[0];
      const outputFile: string = args[1];
      const filter: string = args[2];
      const normalizedFilter = filter === "greyscale" ? "grayscale" : filter;
      switch (normalizedFilter) {
        case ("grayscale"): {
          if (args.length != 3) return this.usage();
        }
        case ("invert"): {
          if (args.length != 3) return this.usage();
        }
        case ("emboss"): {
          if (args.length != 3) return this.usage();
        }
        case ("emboss"): {
          if (args.length != 3) return this.usage();
        }
      }
    } catch {
      console.error("Image didn't work")
    }
  }

  private usage() {
    console.log("USAGE: node ImageEditor <in-file> <out-file> <grayscale|invert|emboss|motionblur> {motion-blur-length}"
    );
  }

  // filgers

  private motionblur(image: Image, length: number) { }
  private invert(image: Image) { }
  private grayscale(image: Image) { }
  private emboss(image: Image) { }
  private read(filePath: string): Image { }
}

class Color {
  constructor(
    public red: number = 0,
    public green: number = 0,
    public blue: number = 0,
  ) { }
}

class Image {
  private pixels: Color[][];

  constructor(width: number, height: number) {
    this.pixels = Array.from({ length: width }, () =>
      Array.from({ length: height }));
  }

  getWidth(): number {
    return this.pixels.length;
  }

  getHeight(): number {
    return this.pixels[0].length;
  }

  set(x: number, y: number, c: Color) {
    this.pixels[x][y] = c;
  }

  get(x: number, y: number) {
    return this.pixels[x][y];
  }
}
