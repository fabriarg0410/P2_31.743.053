import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    setLocale(locale: string): void;
    getLocale(): string;
  }

  interface Response {
    __(phraseOrOptions: string, ...replacements: any[]): string;
    __n(singular: string, plural: string, count: number): string;
  }
}
