class AuthorizationRequestURI {
    constructor(authorizationEndpointURI) {
        this.authorizationEndpointURI = new URL(authorizationEndpointURI);
    }
    addResponseType(responseType) {
        this.authorizationEndpointURI.searchParams.append("response_type", responseType);
        return this;
    }
    addClientId(clientId) {
        this.authorizationEndpointURI.searchParams.append("client_id", clientId);
        return this;
    }
    addRedirectURI(redirectURI) {
        this.authorizationEndpointURI.searchParams.append("redirect_uri", redirectURI);
        return this;
    }
    addScope(scope) {
        this.authorizationEndpointURI.searchParams.append("scope", scope);
        return this;
    }
    addState(state) {
        this.authorizationEndpointURI.searchParams.append("state", state);
        return this;
    }
    add(parameters) {
        for (const [name, value] of Object.entries(parameters)) {
            this.authorizationEndpointURI.searchParams.append(name, value);
        }
        return this;
    }
    toString() {
        return this.authorizationEndpointURI.toString();
    }
}
class TokenRequestURI {
    constructor(tokenEndpointURI) {
        this.tokenEndpointURI = new URL(tokenEndpointURI);
    }
    addGrantType(grantType) {
        this.tokenEndpointURI.searchParams.append("grant_type", grantType);
        return this;
    }
    addCode(code) {
        this.tokenEndpointURI.searchParams.append("code", code);
        return this;
    }
    addRedirectURI(redirectURI) {
        this.tokenEndpointURI.searchParams.append("redirect_uri", redirectURI);
        return this;
    }
    addClientId(clientId) {
        this.tokenEndpointURI.searchParams.append("client_id", clientId);
        return this;
    }
    add(parameters) {
        for (const [name, value] of Object.entries(parameters)) {
            this.tokenEndpointURI.searchParams.append(name, value);
        }
        return this;
    }
    toString() {
        return this.tokenEndpointURI.toString();
    }
}
export class AuthorizationCodeGrantError extends Error {
    constructor(description) {
        super(description || undefined);
    }
}
/**
 * The request is missing a required parameter, includes an
 * invalid parameter value, includes a parameter more than
 * once, or is otherwise malformed.
 */
export class InvalidRequest extends AuthorizationCodeGrantError {
}
/**
 * The client is not authorized to request an authorization
 * code using this method.
 */
export class UnauthorizedClient extends AuthorizationCodeGrantError {
}
/**
 * The resource owner or authorization server denied the
 * request.
 */
export class AccessDenied extends AuthorizationCodeGrantError {
}
/**
 * The authorization server does not support obtaining an
 * authorization code using this method.
 */
export class UnsupportedResponseType extends AuthorizationCodeGrantError {
}
/**
 * The requested scope is invalid, unknown, or malformed.
 */
export class InvalidScope extends AuthorizationCodeGrantError {
}
/**
 * The authorization server encountered an unexpected
 * condition that prevented it from fulfilling the request.
 *
 * (This error code is needed because a 500 Internal Server
 * Error HTTP status code cannot be returned to the client
 * via an HTTP redirect.)
 */
export class ServerError extends AuthorizationCodeGrantError {
}
/**
 * The authorization server is currently unable to handle
 * the request due to a temporary overloading or maintenance
 * of the server.
 *
 * (This error code is needed because a 503
 * Service Unavailable HTTP status code cannot be returned
 * to the client via an HTTP redirect.)
 */
export class TemporarilyUnavailable extends AuthorizationCodeGrantError {
}
/**
 * Authorization Code Grant
 * https://tools.ietf.org/html/rfc6749#section-4.1
 *
 * The authorization code grant type is used to obtain both access
 * tokens and refresh tokens and is optimized for confidential clients.
 * Since this is a redirection-based flow, the client must be capable of
 * interacting with the resource owner's user-agent (typically a web
 * browser) and capable of receiving incoming requests (via redirection)
 * from the authorization server.
 *
 * (A)  The client initiates the flow by directing the resource owner's
 * user-agent to the authorization endpoint.  The client includes
 * its client identifier, requested scope, local state, and a
 * redirection URI to which the authorization server will send the
 * user-agent back once access is granted (or denied).
 *
 * (B)  The authorization server authenticates the resource owner (via
 * the user-agent) and establishes whether the resource owner
 * grants or denies the client's access request.
 *
 * (C)  Assuming the resource owner grants access, the authorization
 * server redirects the user-agent back to the client using the
 * redirection URI provided earlier (in the request or during
 * client registration).  The redirection URI includes an
 * authorization code and any local state provided by the client
 * earlier.
 *
 * (D)  The client requests an access token from the authorization
 * server's token endpoint by including the authorization code
 * received in the previous step.  When making the request, the
 * client authenticates with the authorization server.  The client
 * includes the redirection URI used to obtain the authorization
 * code for verification.
 *
 * (E)  The authorization server authenticates the client, validates the
 * authorization code, and ensures that the redirection URI
 * received matches the URI used to redirect the client in
 * step (C).  If valid, the authorization server responds back with
 * an access token and, optionally, a refresh token.
 */
export class AuthorizationCodeGrant {
    constructor(options) {
        this.options = options;
    }
    /**
     * Authorization Request
     * https://tools.ietf.org/html/rfc6749#section-4.1.1
     *
     * The client constructs the request URI by adding the following
     * parameters to the query component of the authorization endpoint URI
     * using the "application/x-www-form-urlencoded" format, per Appendix B:
     *
     * response_type
     *       REQUIRED.  Value MUST be set to "code".
     *
     * client_id
     *       REQUIRED.  The client identifier as described in Section 2.2.
     *
     * redirect_uri
     *       OPTIONAL.  As described in Section 3.1.2.
     *
     * scope
     *       OPTIONAL.  The scope of the access request as described by
     *       Section 3.3.
     *
     * state
     *       RECOMMENDED.  An opaque value used by the client to maintain
     *       state between the request and callback.  The authorization
     *       server includes this value when redirecting the user-agent back
     *       to the client.  The parameter SHOULD be used for preventing
     *       cross-site request forgery as described in Section 10.12.
     *
     * The client directs the resource owner to the constructed URI using an
     * HTTP redirection response, or by other means available to it via the
     * user-agent.
     *
     * For example, the client directs the user-agent to make the following
     * HTTP request using TLS (with extra line breaks for display purposes
     * only):
     *
     *  GET /authorize?response_type=code&client_id=s6BhdRkqt3&state=xyz
     *      &redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb HTTP/1.1
     *  Host: server.example.com
     *
     * The authorization server validates the request to ensure that all
     * required parameters are present and valid.  If the request is valid,
     * the authorization server authenticates the resource owner and obtains
     * an authorization decision (by asking the resource owner or by
     * establishing approval via other means).
     *
     * When a decision is established, the authorization server directs the
     * user-agent to the provided client redirection URI using an HTTP
     * redirection response, or by other means available to it via the
     * user-agent.
     */
    constructAuthorizationRequestURI(options) {
        const authorizationRequestURI = new AuthorizationRequestURI(this.options.authorizationEndpointURI);
        authorizationRequestURI
            .addResponseType("code")
            .addClientId(this.options.clientId);
        if (this.options.redirectURI) {
            authorizationRequestURI.addRedirectURI(this.options.redirectURI);
        }
        if (this.options.scope) {
            authorizationRequestURI.addScope(this.options.scope);
        }
        if (options && options.state) {
            authorizationRequestURI.addState(options.state);
        }
        if (options && options.parameters) {
            authorizationRequestURI.add(options.parameters);
        }
        // console.log("-----------DEBUG URL REDIRECT-----------");
        // console.log(authorizationRequestURI.toString());
        return authorizationRequestURI.toString();
    }
    /**
     * Authorization Response
     *
     * If the resource owner grants the access request, the authorization
     * server issues an authorization code and delivers it to the client by
     * adding the following parameters to the query component of the
     * redirection URI using the "application/x-www-form-urlencoded" format,
     * per Appendix B:
     *
     * code
     *       REQUIRED.  The authorization code generated by the
     *       authorization server.  The authorization code MUST expire
     *       shortly after it is issued to mitigate the risk of leaks.  A
     *       maximum authorization code lifetime of 10 minutes is
     *       RECOMMENDED.  The client MUST NOT use the authorization code
     *       more than once.  If an authorization code is used more than
     *       once, the authorization server MUST deny the request and SHOULD
     *       revoke (when possible) all tokens previously issued based on
     *       that authorization code.  The authorization code is bound to
     *       the client identifier and redirection URI.
     *
     * state
     *       REQUIRED if the "state" parameter was present in the client
     *       authorization request.  The exact value received from the
     *       client.
     *
     * For example, the authorization server redirects the user-agent by
     * sending the following HTTP response:
     *
     *   HTTP/1.1 302 Found
     *   Location: https://client.example.com/cb?code=SplxlOBeZQQYbYS6WxSbIA
     *             &state=xyz
     *
     * The client MUST ignore unrecognized response parameters.  The
     * authorization code string size is left undefined by this
     * specification.  The client should avoid making assumptions about code
     * value sizes.  The authorization server SHOULD document the size of
     * any value it issues.
     */
    parseAuthorizationResponse(redirectionURI, state) {
        const parameters = redirectionURI.searchParams;
        if (state && !parameters.has("state")) {
            // @todo
        }
        if (state && parameters.get("state") !== state) {
            // @todo
        }
        const error = parameters.get("error");
        if (error !== null) {
            const description = parameters.get("error_description");
            switch (error) {
                case "invalid_request":
                    throw new InvalidRequest(description);
                case "unauthorized_client":
                    throw new UnauthorizedClient(description);
                case "access_denied":
                    throw new AccessDenied(description);
                case "unsupported_response_type":
                    throw new UnsupportedResponseType(description);
                case "invalid_scope":
                    throw new InvalidScope(description);
                case "server_error":
                    throw new ServerError(description);
                case "temporarily_unavailable":
                    throw new TemporarilyUnavailable(description);
            }
        }
        if (!parameters.has("code")) {
            // @todo
        }
        // return parameters;
    }

    /**
     * Access Token Request
     * https://tools.ietf.org/html/rfc6749#section-4.1.3
     *
     * The client makes a request to the token endpoint by sending the
     * following parameters using the "application/x-www-form-urlencoded"
     * format per Appendix B with a character encoding of UTF-8 in the HTTP
     * request entity-body:
     *
     * grant_type
     *       REQUIRED.  Value MUST be set to "authorization_code".
     *
     * code
     *       REQUIRED.  The authorization code received from the
     *       authorization server.
     *
     * redirect_uri
     *       REQUIRED, if the "redirect_uri" parameter was included in the
     *       authorization request as described in Section 4.1.1, and their
     *       values MUST be identical.
     *
     * client_id
     *       REQUIRED, if the client is not authenticating with the
     *       authorization server as described in Section 3.2.1.
     *
     * If the client type is confidential or the client was issued client
     * credentials (or assigned other authentication requirements), the
     * client MUST authenticate with the authorization server as described
     * in Section 3.2.1.
     *
     * For example, the client makes the following HTTP request using TLS
     * (with extra line breaks for display purposes only):
     *
     *   POST /token HTTP/1.1
     *   Host: server.example.com
     *   Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
     *   Content-Type: application/x-www-form-urlencoded
     *
     *   grant_type=authorization_code&code=SplxlOBeZQQYbYS6WxSbIA
     *   &redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
     */

    async requestToken(options) {
        let formdata = new FormData();
        let head = "";

        if (options) {
            formdata = new URLSearchParams();
            head = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
        }

        formdata.append("grant_type", "authorization_code");

        if (options && options.code) {
            formdata.append("code", decodeURI(options.code.toString()));
        }
        if (this.options.redirectURI) {
            formdata.append("redirect_uri", this.options.redirectURI); //"http://localhost:3001/auth/callback"
        }
        if (this.options.clientId) {
            formdata.append("client_id", this.options.clientId.toString());
        }
        if (this.options.clientSecret) {
            formdata.append("client_secret", this.options.clientSecret.toString());
        }

        if (options && options.parameters) {
            Object.keys(options.parameters).forEach(e => {
                if (options.parameters[e]) {
                    formdata.append(e, options.parameters[e])
                }})
        }

        // Display the key/value pairs
        // console.log(head)
        // console.log("---------------DEBUG requestToken------------------")
        // console.log(this.options.tokenEndpointURI);
        // for (let pair of formdata.entries()) {
        //     console.log(pair[0]+ ': ' + pair[1]);
        // }

        const response = await fetch(this.options.tokenEndpointURI, {
            method: "POST",
            headers: head,
            body: formdata
        });
        
        if (response.status !== 200) {
            return {}
        }

        const content = await response.json();
        return content;
    }
}
