/*!
 * Express Single Page App Router Middleware
 * Dan Motzenbecker <dan@oxism.com>
 * MIT Licensed
 */


var defaults = {
  staticPaths: /^\/(?:javascripts)|(?:js)|(?:stylesheets)|(?:css)|(?:images)|(?:favicon)/,
  extraRoutes: /1^/,
  noRoute: function(req, res, next) {
    next(req, res);
  }
};

module.exports = function(app, options) {
  var key, routes, regexStr;

  if (!options) {
    options = defaults;
  } else {
    for (key in defaults) {
      if (!options[key]) {
        options[key] = defaults[key];
      } else if ((key === 'staticPaths' || key === 'extraRoutes') && Array.isArray(options[key])) {
        routes = options[key];
        regexStr = '^\\/';
        for (var i = 0, l = routes.length; i < l; i++) {
          regexStr += '(?:' + routes[i] + ')';
          if (i !== l - 1) regexStr += '|';
        }
        options[key] = new RegExp(regexStr);
      }
    }
  }

  return function(req, res, next) {
    if (req.xhr || req.method !== 'GET' || req.url === '/' || options.staticPaths.test(req.url)) {
      return next();
    }

    var routes = app.routes.get;
    for (var i = 0, l = routes.length; i < l; i++) {
      if (routes[i].regexp.test(req.url) || options.extraRoutes.test(req.url)) {
        req.url = '/';
        return next();
      }
    }
    options.noRoute(req, res, next);

  };
};
