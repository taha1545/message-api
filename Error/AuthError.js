class AuthError extends Error {
    //
    constructor(message) {
        super(message);
        this.name = "AUTH_ERROR";
        this.statusCode = 401;
    }
}
module.exports = AuthError;