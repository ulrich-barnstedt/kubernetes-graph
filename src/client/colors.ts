const colors = [
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
const colorMap: Record<string, string> = {};
const defaultColor = "#000000";

export const getColor = (type: string) : string => {
    if (type in colorMap) {
        return colorMap[type];
    } else if (colors.length > 0) {
        colorMap[type] = colors.pop()!;
        return colorMap[type];
    } else {
        return defaultColor;
    }
}
