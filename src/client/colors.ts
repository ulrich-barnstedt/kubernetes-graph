const colorMap: Record<string, string> = {

};

export const getColor = (type: string) : string => {
    if (type in colorMap) {
        return colorMap[type];
    } else {
        return "#000000";
    }
}
