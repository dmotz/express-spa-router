/*!
 * Express Single Page App Router Middleware
 * Dan Motzenbecker <dan@oxism.com>
 * MIT Licensed
 */


var defaults = {
  staticPaths: /^\/(?:javascripts)|(?:stylesheets)|(?:images)|(?:favicon)/,
  extraRoutes: /1^/,
  noRoute: function(req, res, next) {
    next(req, res);
  }
}

module.exports = function(app, options) {
  if (!options) {
    options = defaults;
  } else {
    for (var key in defaults) {
      if (!options[key]) {
        options[key] = defaults[key];
      } else if ((key === 'staticPaths' || key === 'extraRoutes') && Array.isArray(options[key])) {
        var routes = options[key],
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
    if (req.url === '/') {
      return next();
    }
    if (!req.xhr && !options.staticPaths.test(req.url)) {
      var routes = app.routes[req.method.toLowerCase()];
      for (var i = 0, l = routes.length; i < l; i++) {
        if (routes[i].regexp.test(req.url) || options.extraRoutes.test(req.url)) {
          req.url = '/';
          return next();
        }
      }
      options.noRoute(req, res, next);
    } else {
      next();
    }
  }

}
