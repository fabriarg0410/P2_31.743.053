import 'express';

declare module 'i18n' {
  import { RequestHandler } from 'express';

  const i18n: {
    __: (...args: any[]) => string;
    __n: (...args: any[]) => string;
    configure: (options: any) => void;
    init: RequestHandler;
  };

  export = i18n;
}

declare module 'express-serve-static-core' {
  interface Request {
    __: (...args: any[]) => string;
    __n: (...args: any[]) => string;
    setLocale: (locale: string) => void;
    getLocale: () => string;
  }

  interface Response {
    __: (...args: any[]) => string;
    __n: (...args: any[]) => string;
  }
}
