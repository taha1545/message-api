class AuthorizeError extends Error {
    //
    constructor(message) {
        super(message);
        this.name = "AUTHORIZE_ERROR";
        this.statusCode = 403;
    }
}
module.exports = AuthorizeError;