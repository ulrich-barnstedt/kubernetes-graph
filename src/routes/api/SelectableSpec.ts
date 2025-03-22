export interface SelectableSpec <T extends Record<string, any>> {
    available: (keyof T)[],
    defaultSelected: (keyof T)[]
}
