export class Middleware {
    static async handler(_req, _res, next) {
        return next();
    }
}
