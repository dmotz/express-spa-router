# Express Single Page App Router Middleware
#### Internally reroute non-AJAX requests to your client-side app router.
[Dan Motzenbecker](http://oxism.com), MIT License

[@dcmotz](http://twitter.com/dcmotz)


### Concept
Let's say you have a modern single page web application with client-side
URL routing (e.g. Backbone).

Since views are rendered on the client, you'll likely use RESTful Express routes
that handle a single concern and return only JSON back to the client. The app's
only non-JSON endpoint is likely the index route (`/`).

So while `/users` might return a JSON array when hit via the client app's AJAX
call, you'll want to handle that request differently if the user clicks a link from
an external site or manually types it in the address bar. When hit in this context,
this middleware internally redirects the request to the index route handler, so the
same client-side app is loaded for every valid route. The URL for the end user
remains the same and the client-side app uses its own router to show the user what's
been requested based on the route. This eliminates the tedium of performing this kind
of conditional logic within individual route callbacks.

### Installation
```
$ npm install --save express-spa-router
```

### Usage
In your Express app's configuration, place this middleware high up the stack
(before `router` and `static`) and pass it your app instance:

```javascript
app.use(require('express-spa-router')(app));
```

AJAX requests will be untouched, but valid routes called without AJAX will result
in the the index route's result being returned. Non-matching routes will be
passed down the stack by default and will be end up being handled by whatever your
app does with 404s. This can be overridden by passing a `noRoute` function in the
options object:

```javascript
app.use(require('express-spa-router')(app,
  {
    noRoute: function(req, res, next) {
      //handle unmatched route
    }
  }
));
```

Express's default static paths are passed along correctly by default (as are
`/js` and `/css`), but if you use different paths or have additional static files
in your `public` directory, make sure to specify them in the options either via
a regular expression or an array of directory names:

```javascript
app.use require('express-spa-router')(app, {staticPaths: ['js', 'css', 'uploads']});
```

You may also have valid client-side routes that don't exist on the server-side.
Rather than having them reach the 404 handler, you can specify them in the 
configuration options using `extraRoutes` and passing either a regular expression 
or an array:

```javascript
app.use require('express-spa-router')(app, {extraRoutes: ['about', 'themes']});
```

Finally, if you want to route non-AJAX `GET` requests to certain routes normally,
pass paths in the `ignore` option:

```javascript
app.use require('express-spa-router')(app, {ignore: ['api']});
```
