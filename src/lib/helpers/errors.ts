export class HttpClientError extends Error {
    constructor(message: string, public code: number) {
        super(message);
        this.name = 'HttpClientError';
        this.code = code;
    }
}

export class IlligalArgumentError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'IlligalArgumentError';
    }
}

export class RuntimeExepctionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RuntimeExepction';
    }
}