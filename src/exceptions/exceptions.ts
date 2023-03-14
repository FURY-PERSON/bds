import { ExceptionList } from './types/exception-list.enum';

type ExceptionBody = {
    httpStatusCode: number;
    message: string;
};

type ExceptionType = {
    [key in ExceptionList]: ExceptionBody;
};

export const Exceptions: ExceptionType = {
    [ExceptionList.USER_NOT_FOUND]: {
        httpStatusCode: 404,
        message: 'Пользователь не найден',
    }
};
