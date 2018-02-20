"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var graphcool_lib_1 = require('graphcool-lib');
var bcrypt = require('bcryptjs');
var SALT_ROUNDS = 10;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (event) __awaiter(this, void 0, void 0, function* () {
    console.log(event);
    try {
        var graphcool = graphcool_lib_1.fromEvent(event);
        var api = graphcool.api('simple/v1');
        var _a = event.data, email = _a.email, password = _a.password;
        // get user by email
        var user = yield getUserByEmail(api, email)
            .then(function (r) { return r.User; });
        // no user with this email
        if (!user) {
            return { error: 'Invalid credentials!' };
        }
        // check password
        var passwordIsCorrect = yield bcrypt.compare(password, user.password);
        if (!passwordIsCorrect) {
            return { error: 'Invalid credentials!' };
        }
        // generate node token for existing User node
        var token = yield graphcool.generateNodeToken(user.id, 'User');
        return { data: { id: user.id, token: token } };
    }
    catch (e) {
        console.log(e);
        return { error: 'An unexpected error occured during authentication.' };
    }
});
function getUserByEmail(api, email) {
    return __awaiter(this, void 0, Promise, function* () {
        var query = "\n    query getUserByEmail($email: String!) {\n      User(email: $email) {\n        id\n        password\n      }\n    }\n  ";
        var variables = {
            email: email,
        };
        return api.request(query, variables);
    });
}
