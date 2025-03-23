class UpdatePropagator {
    private listeners: (() => void)[] = [];

    public listen (listener: () => void) {
        this.listeners.push(listener);
    }

    public run () {
        for (const listener of this.listeners) {
            listener();
        }
    }
}

export const forcedUpdatePropagator = new UpdatePropagator();