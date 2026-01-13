import fs = require("fs");

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

      let inputFile = args[0];
      let outputFile = args[1];
      let filter = args[2];

      const normalizedFilter = filter === "greyscale" ? "grayscale" : filter;

      let image: Image = this.read(inputFile!);
      switch (normalizedFilter) {

        case ("grayscale"): {
          if (args.length != 3) return this.usage();
          this.grayscale(image);
          break;
        }

        case ("invert"): {
          if (args.length != 3) return this.usage();
          this.invert(image);
          break;
        }

        case ("emboss"): {
          if (args.length != 3) return this.usage();
          this.emboss(image);
          break;
        }
        case ("motionblur"): {
          if (args.length != 4) return this.usage();
          let length: number = Number(args[3]);

          if (length < 0) {
            return this.usage();
          }
          this.motionblur(image, length);
          break;
        }

        default:
          return this.usage();
      }

      this.write(image, outputFile!);

    } catch {
      console.error("Image didn't work")
    }
  }

  private usage() {
    console.log("USAGE: node ImageEditor <in-file> <out-file> <grayscale|invert|emboss|motionblur> {motion-blur-length}"
    );
  }

  // filgers

  private motionblur(image: Image, length: number) {
    if (length < 1) {
      return;
    }
    let x: number;
    let y: number;

    for (x = 0; x < image.getWidth(); x++) {
      for (y = 0; y < image.getHeight(); y++) {
        let color: Color = image.get(x, y)!;

        let maxX = Math.min(image.getWidth() - 1, x + length - 1);
        let i: number;
        for (i = x + 1; i <= maxX; i++) {
          let tempColor = image.get(i, y)!;
          color.red = tempColor.red;
          color.green = tempColor.green;
          color.blue = tempColor.blue;
        }

        let delta: number = maxX - x + 1;
        color.red /= delta;
        color.green /= delta;
        color.blue /= delta;
      }
    }
  }
  private invert(image: Image) {
    let x: number;
    let y: number;

    for (x = 0; x < image.getWidth(); x++) {
      for (y = 0; y < image.getHeight(); y++) {
        let color: Color = image.get(x, y)!;

        color.red = 255 - color.red;
        color.blue = 255 - color.blue;
        color.green = 255 - color.green;
      }
    }
  }
  private grayscale(image: Image) {
    let x: number;
    let y: number;

    for (x = 0; x < image.getWidth(); x++) {
      for (y = 0; y < image.getHeight(); y++) {
        let color: Color = image.get(x, y)!;

        let greyLevel = (color.red + color.blue + color.green) / 3;
        greyLevel = Math.max(0, Math.min(greyLevel, 255));

        color.red = greyLevel;
        color.blue = greyLevel;
        color.green = greyLevel;
      }
    }
  }

  private emboss(image: Image) {
    let x: number;
    let y: number;

    for (x = 0; x < image.getWidth(); x++) {
      for (y = 0; y < image.getHeight(); y++) {
        let color: Color = image.get(x, y)!;

        let diff: number = 0;
        if (x > 0 && y > 0) {
          let upLeftColor = image.get(x - 1, y - 1)!;
          if (Math.abs(color.red - upLeftColor.red) > Math.abs(diff)) {
            diff = color.red - upLeftColor.red;
          }
          if (Math.abs(color.blue - upLeftColor.blue) > Math.abs(diff)) {
            diff = color.blue - upLeftColor.blue;
          }
          if (Math.abs(color.green - upLeftColor.green) > Math.abs(diff)) {
            diff = color.green - upLeftColor.green;
          }
        }

        let greyLevel: number = 128 - diff;
        greyLevel = Math.max(0, Math.min(greyLevel, 255));

        color.red = greyLevel;
        color.blue = greyLevel;
        color.green = greyLevel;
      }
    }
  }

  private read(filePath: string): Image {
    const text = fs.readFileSync(filePath, "utf-8");
    const tokens: string[] = text.split(/\s+/);
    if (!tokens) {
      this.usage();
      process.exit(1);
    }
    tokens.forEach(value => {
      if (!value) {
        console.error("damaged photo data");
        process.exit(1);
      }
    })
    let i = 0;

    // Skip "P3"
    i++;

    const width = parseInt(tokens[i++]!, 10);
    const height = parseInt(tokens[i++]!, 10);
    const fill: Color = new Color(0, 0, 0);
    const image = new Image(width, height, fill);

    // Skip max color value
    i++;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const c = new Color(
          parseInt(tokens[i++]!, 10),
          parseInt(tokens[i++]!, 10),
          parseInt(tokens[i++]!, 10)
        );
        image.set(x, y, c);
      }
    }

    return image;
  }

  private write(image: Image, filePath: string) {
    let output = "";
    output += "P3\n";
    output += `${image.getWidth()} ${image.getHeight()}\n`;
    output += "255\n";

    for (let y = 0; y < image.getHeight(); y++) {
      let line = "";
      for (let x = 0; x < image.getWidth(); x++) {
        const c = image.get(x, y);
        if (!c) {
          console.log('Write error');
          process.exit(1);
        }
        line += `${x === 0 ? "" : " "}${c.red} ${c.green} ${c.blue}`;
      }
      output += line + "\n";
    }

    fs.writeFileSync(filePath, output);
  }
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

  constructor(width: number, height: number, fill: Color) {
    this.pixels = Array.from({ length: width }, () =>
      Array.from({ length: height }, () => fill));
  }

  getWidth(): number {
    return this.pixels.length;
  }

  getHeight(): number {
    return this.pixels.length > 0 ? this.pixels[0]!.length : 0;
  }

  set(x: number, y: number, c: Color) {
    this.pixels[x]![y] = c;
  }

  get(x: number, y: number) {
    if (!this.pixels[x]![y]) {
      console.error("Issues with Image pixels");
      process.exit;
    }
    return this.pixels[x]![y];
  }
}
