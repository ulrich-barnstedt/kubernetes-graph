export const createColorIterator = (brightness: number = 50) : (() => string) => {
    let offset = -2;
    let currentDivisionRatio = 360;

    return () => {
        offset += 2;

        if (currentDivisionRatio * offset >= 360) {
            currentDivisionRatio /= 2;
            offset = 1;
        }

        return `hsl(${(currentDivisionRatio * (offset)).toFixed(1)},100%,${brightness}%)`;
    }
}

export class ColorMap {
    private readonly colorIterator: () => string;
    private readonly colorMap: Record<string, string>;

    constructor (colorIterator: () => string) {
        this.colorMap = {};
        this.colorIterator = colorIterator;
    }

    public getColor (idx: string) : string {
        if (idx in this.colorMap) {
            return this.colorMap[idx];
        } else {
            this.colorMap[idx] = this.colorIterator();
            return this.colorMap[idx];
        }
    }

    public defineFixedColor (idx: string, color: string) {
        this.colorMap[idx] = color;
    }
}
