const assert = require('assert');

const defaultAllowMethods = 'GET,HEAD,PUT,POST,DELETE,PATCH';

const split = str => {
  if (!str) return [];
  return str.split(',');
};

const getHeader = (req, name) => {
  const key = name.toLowerCase();
  return req.headers[key];
};

/**
 * kelp-cors middleware
 * @docs https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
 * @param {*} options 
 * @returns 
 */
const cors = (options = {}) => {
  const flag = typeof options === 'function';
  /**
   * kelp middleware
   */
  return async (req, res, next) => {
    res.headers = res.headers || {};
    let preflight = false, requestHeaders, requestMethod;
    const requestOrigin = getHeader(req, 'Origin');
    if (!requestOrigin) return next();
    if (req.method === 'OPTIONS') {
      preflight = true; // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#preflighted_requests
      requestMethod = getHeader(req, 'Access-Control-Request-Method');
      requestHeaders = getHeader(req, 'Access-Control-Request-Headers');
      if (!requestMethod) return next(); // not a valid preflight request
    }
    /**
     * process allow* settings
     */
    let {
      allowOrigin = requestOrigin,
      allowMethods = defaultAllowMethods,
      allowHeaders = requestHeaders,
      allowCredentials = true,
      exposeHeaders, maxAge,
    } = flag ? await options({
      preflight,
      requestMethod,
      requestOrigin,
      requestHeaders: split(requestHeaders),
    }) : options;
    /**
     * serialized
     */
    if (Array.isArray(allowMethods)) allowMethods = allowMethods.join(',');
    if (Array.isArray(allowHeaders)) allowHeaders = allowHeaders.join(',');
    if (Array.isArray(exposeHeaders)) exposeHeaders = exposeHeaders.join(',');
    /**
     * Please note that, when responding to a credentialed requests request, 
     * the server must specify an origin in the value of the Access-Control-Allow-Origin header, 
     * instead of specifying the "*" wildcard.
     * @docs https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#requests_with_credentials
     */
    if (allowCredentials === true) {
      assert.notEqual(allowOrigin, '*', '[kelp-cors] Must specify an origin instead of specifying the "*" wildcard when responding allowCredentials.');
    }
    /**
     * If the server specifies a single origin (that may dynamically change 
     * based on the requesting origin as part of a allowlist) rather than the "*" wildcard, 
     * then the server should also include Origin in the Vary response header — 
     * to indicate to clients that server responses will differ based on the value of the Origin request header.
     */
    if (allowOrigin !== '*') {
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary
      const vary = split(res.headers['vary']);
      // also include ',Origin' in the 'Vary'
      if (vary.indexOf('Origin') === -1)
        res.setHeader('Vary', vary.concat('Origin').join(','));
    }
    res.setHeader('Access-Control-Allow-Origin', allowOrigin);
    if (maxAge) res.setHeader('Access-Control-Max-Age', maxAge);
    if (allowCredentials) res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (preflight) {
      if (allowMethods) res.setHeader('Access-Control-Allow-Methods', allowMethods);
      if (allowHeaders) res.setHeader('Access-Control-Allow-Headers', allowHeaders);
      res.end();
      return;
    } else {
      // @docs https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#access-control-expose-headers
      if (exposeHeaders) res.setHeader('Access-Control-Expose-Headers', exposeHeaders);
    }
    return next();
  };
};

module.exports = cors;