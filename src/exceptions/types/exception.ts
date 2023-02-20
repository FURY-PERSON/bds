import { ExceptionList } from './exception-list.enum';

export class Exception extends Error {
    constructor(public error: ExceptionList) {
        super(error);
    }
}
