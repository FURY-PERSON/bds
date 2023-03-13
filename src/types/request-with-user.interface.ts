export interface RequestBody extends ReadableStream<Uint8Array> {
    [key: string]: any;
}

export interface RequestWithUser extends Request {
    user: {
        login: string
    };
    file?: Express.Multer.File;
    body: RequestBody;
}
