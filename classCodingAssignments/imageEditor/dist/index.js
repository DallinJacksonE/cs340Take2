"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class ImageEditor {
    static main(args) {
        new ImageEditor().run(args);
    }
    run(args) {
        try {
            if (args.length < 3) {
                this.usage();
                return;
            }
            let inputFile = args[0];
            let outputFile = args[1];
            let filter = args[2];
            const normalizedFilter = filter === "greyscale" ? "grayscale" : filter;
            let image = this.read(inputFile);
            switch (normalizedFilter) {
                case ("grayscale"): {
                    if (args.length != 3)
                        return this.usage();
                    this.grayscale(image);
                    break;
                }
                case ("invert"): {
                    if (args.length != 3)
                        return this.usage();
                    this.invert(image);
                    break;
                }
                case ("emboss"): {
                    if (args.length != 3)
                        return this.usage();
                    console.log("Embossing Image");
                    this.emboss(image);
                    break;
                }
                case ("motionblur"): {
                    if (args.length != 4)
                        return this.usage();
                    let length = Number(args[3]);
                    if (length < 0) {
                        return this.usage();
                    }
                    this.motionblur(image, length);
                    break;
                }
                default:
                    return this.usage();
            }
            this.write(image, outputFile);
        }
        catch {
            console.error("Image didn't work");
        }
    }
    usage() {
        console.log("USAGE: node ImageEditor <in-file> <out-file> <grayscale|invert|emboss|motionblur> {motion-blur-length}");
    }
    // filgers
    motionblur(image, length) {
        if (length < 1) {
            return;
        }
        let x;
        let y;
        for (x = 0; x < image.getWidth(); x++) {
            for (y = 0; y < image.getHeight(); y++) {
                let color = image.get(x, y);
                let maxX = Math.min(image.getWidth() - 1, x + length - 1);
                let i;
                for (i = x + 1; i <= maxX; i++) {
                    let tempColor = image.get(i, y);
                    color.red += tempColor.red;
                    color.green += tempColor.green;
                    color.blue += tempColor.blue;
                }
                let delta = maxX - x + 1;
                color.red = Math.floor(color.red / delta);
                color.green = Math.floor(color.green / delta);
                color.blue = Math.floor(color.blue / delta);
            }
        }
    }
    invert(image) {
        let x;
        let y;
        for (x = 0; x < image.getWidth(); x++) {
            for (y = 0; y < image.getHeight(); y++) {
                let color = image.get(x, y);
                color.red = 255 - color.red;
                color.green = 255 - color.green;
                color.blue = 255 - color.blue;
            }
        }
    }
    grayscale(image) {
        let x;
        let y;
        for (x = 0; x < image.getWidth(); x++) {
            for (y = 0; y < image.getHeight(); y++) {
                let color = image.get(x, y);
                let greyLevel = Math.floor((color.red + color.blue + color.green) / 3);
                greyLevel = Math.max(0, Math.min(greyLevel, 255));
                color.red = greyLevel;
                color.green = greyLevel;
                color.blue = greyLevel;
            }
        }
    }
    emboss(image) {
        // Loop backward as in Java
        for (let x = image.getWidth() - 1; x >= 0; x--) {
            for (let y = image.getHeight() - 1; y >= 0; y--) {
                const curColor = image.get(x, y);
                if (!curColor) {
                    console.error("missing pixels");
                    process.exit(1);
                }
                let diff = 0;
                if (x > 0 && y > 0) {
                    const upLeftColor = image.get(x - 1, y - 1);
                    const redDiff = curColor.red - upLeftColor.red;
                    const greenDiff = curColor.green - upLeftColor.green;
                    const blueDiff = curColor.blue - upLeftColor.blue;
                    // Find max absolute difference
                    if (Math.abs(redDiff) > Math.abs(diff))
                        diff = redDiff;
                    if (Math.abs(greenDiff) > Math.abs(diff))
                        diff = greenDiff;
                    if (Math.abs(blueDiff) > Math.abs(diff))
                        diff = blueDiff;
                }
                let grayLevel = 128 + diff;
                if (grayLevel < 0)
                    grayLevel = 0;
                if (grayLevel > 255)
                    grayLevel = 255;
                curColor.red = grayLevel;
                curColor.green = grayLevel;
                curColor.blue = grayLevel;
            }
        }
    }
    read(filePath) {
        const text = fs.readFileSync(filePath, "utf-8");
        const tokens = text.split(/\s+/).filter(t => t.length > 0);
        if (!tokens) {
            this.usage();
            process.exit(1);
        }
        tokens.forEach(value => {
            if (!value) {
                console.error("damaged photo data");
                //process.exit(1);
            }
        });
        let i = 0;
        // Skip "P3"
        i++;
        const width = parseInt(tokens[i++], 10);
        const height = parseInt(tokens[i++], 10);
        const image = new Image(width, height);
        // Skip max color value
        i++;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const c = new Color(parseInt(tokens[i++], 10), parseInt(tokens[i++], 10), parseInt(tokens[i++], 10));
                image.set(x, y, c);
            }
        }
        return image;
    }
    write(image, filePath) {
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
    red;
    green;
    blue;
    constructor(red = 0, green = 0, blue = 0) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }
}
class Image {
    pixels;
    constructor(width, height) {
        this.pixels = new Array(width);
        for (let x = 0; x < width; x++) {
            this.pixels[x] = new Array(height);
            for (let y = 0; y < height; y++) {
                this.pixels[x][y] = new Color(0, 0, 0);
            }
        }
    }
    getWidth() {
        return this.pixels.length;
    }
    getHeight() {
        return this.pixels.length > 0 ? this.pixels[0].length : 0;
    }
    set(x, y, c) {
        this.pixels[x][y] = c;
    }
    get(x, y) {
        if (!this.pixels[x][y]) {
            console.error("Issues with Image pixels");
            process.exit;
        }
        return this.pixels[x][y];
    }
}
ImageEditor.main(process.argv.slice(2));
//# sourceMappingURL=index.js.map