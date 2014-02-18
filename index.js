/*!
 * Express Single Page App Router Middleware
 * Dan Motzenbecker <dan@oxism.com>
 * MIT Licensed
 */


var defaults = {
  staticPaths: /^\/(?:javascripts)|(?:js)|(?:stylesheets)|(?:css)|(?:images)|(?:favicon)/,
  ignore:      /1^/,
  extraRoutes: /1^/,
  noRoute: function(req, res, next) {
    next(req, res);
  }
};

module.exports = function(app, options) {
  var i, l, key, routes, regexStr;

  if (!options) {
    options = defaults;
  } else {
    for (key in defaults) {
      if (!defaults.hasOwnProperty(key)) continue;

      if (!options[key]) {
        options[key] = defaults[key];
      } else if ((key === 'staticPaths' || key === 'extraRoutes' || key === 'ignore') &&
                  Array.isArray(options[key])) {

        routes = options[key];
        regexStr = '^\\/';
        for (i = 0, l = routes.length; i < l; i++) {
          regexStr += '(?:' + routes[i] + ')' + (i !== l - 1 ? '|' : '\/');
        }
        options[key] = new RegExp(regexStr);
      }
    }
  }

  return function(req, res, next) {
    var routes, i, l, url;
    url = req.url;
    if (url.slice(-1) !== '/') url += '/';

    if (req.xhr || req.method !== 'GET' || url === '/' ||
        options.staticPaths.test(url) || options.ignore.test(url)) {
      return next();
    }

    if (options.extraRoutes.test(url)) {
      req.url = '/';
      return next();
    }

    routes = app.routes.get;

    for (i = 0, l = routes.length; i < l; i++) {
      if (routes[i].regexp.test(url)) {
        req.url = '/';
        return next();
      }
    }
    options.noRoute(req, res, next);

  };
};
