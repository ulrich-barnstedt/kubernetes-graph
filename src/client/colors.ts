export const paletteLight = [
    "#2f4f4f",
    "#006400",
    "#000080",
    "#ff0000",
    "#ffa500",
    "#ffff00",
    "#00ff00",
    "#00fa9a",
    "#0000ff",
    "#ff00ff",
    "#1e90ff",
    "#f0e68c",
    "#fa8072",
    "#dda0dd",
    "#b0e0e6",
    "#ff1493",
];
export const paletteDark = [
    "#0000ff",
    "#ff00ff",
    "#00fa9a",
    "#1e90ff",
    "#dda0dd",
    "#ff1493",
    "#ffdab9",
    "#696969",
    "#a52a2a",
    "#006400",
    "#b8860b",
    "#000080",
    "#48d1cc",
    "#ff0000",
    "#ffff00",
    "#00ff00",
];

export class ColorMap {
    private readonly colorList: string[];
    private readonly colorMap: Record<string, string>;
    private readonly defaultColor: string;

    constructor (colorList: string[] = paletteLight, defaultColor: string = "#ffffff") {
        this.defaultColor = defaultColor;
        this.colorMap = {};
        this.colorList = [...colorList];
    }

    public getColor (idx: string) : string {
        if (idx in this.colorMap) {
            return this.colorMap[idx];
        } else if (this.colorList.length > 0) {
            this.colorMap[idx] = this.colorList.pop()!;
            return this.colorMap[idx];
        } else {
            return this.defaultColor;
        }
    }

    public defineFixedColor (idx: string, color: string) {
        this.colorMap[idx] = color;
    }
}
