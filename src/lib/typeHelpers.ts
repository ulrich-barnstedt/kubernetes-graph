export type ValueOf<T> = T[keyof T];

export type ExecutedFunctionsRecord<T extends Record<string, (..._: any) => any>> = {
    [key in keyof T]: ReturnType<T[key]>
}

export type PromiseValuesRecord = Record<string, Promise<any>>;

export type AwaitedValuesRecord<T extends PromiseValuesRecord> = {
    [key in keyof T]: Awaited<T[key]>
}
