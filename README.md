# browser-http

This is just a thought experiment, but what if NodeJS's http had 
a baby with push states...

## Install

1. Add script

```html
<script src="https://raw.githubusercontent.com/cblanquera/browser-http/main/dist/browser-http.js"></script>
```

2. Add this somewhere in your script

```js
const server = http.createServer(function(req, res) { ... });
server.listen();
```

## Notes

 - `req` is an extended version of the native [window.Request](https://developer.mozilla.org/en-US/docs/Web/API/Request).
 - `res` is an extended version of the native [window.Response](https://developer.mozilla.org/en-US/docs/Web/API/Response).
 - This means you can fetch a request as in `fetch(req)` to get info from the server.
 - This also kind of makes it possible to have a client side `expressjs` framework.
 - It's possible to make this work as a React Router alternative like the following.

### Example React Plugin

So here we create a very small plugin to use in the main `http.Server` handler.

```js
//define a basic react router plugin
//(we'll try to avoid JSX for now...)
const reactPlugin = function(root) {
  function isReactElement(element) {
    return element && element.$$typeof === Symbol.for('react.element')
  }
  
  //this will be populated in a bit...
  const plugin = {}
  const NotFound = function() {
    return React.createElement('div', {}, '404 - Not Found')
  }

  //main react component
  const Response = function() {
    //let's use a state hook
    const [body, setBody] = React.useState(NotFound())

    //a listener needs to go here
    //because state hooks cannot be 
    //used outside of a react component
    plugin.handler = (req, res) => {
      if (isReactElement(res.body)) {
        setBody(res.body)
        res.body = null
      } else {
        setBody(NotFound())
      }
    }

    //return element here
    return React.createElement('div', {}, body)
  }

  //go ahead and render the react to the root
  if (typeof root === 'string') {
    root = document.getElementById(root)
  }
  ReactDOM.render(React.createElement(Response), root)

  //return the plugin
  return function(req, res) {
    if (typeof plugin.handler === 'function') {
      plugin.handler(req, res)
    }
  }
}
```

Next we want to create some pages.

```js
const page1 = function(req, res) {
  const App = function() {
    const [counter, setCounter] = React.useState(600)
    React.useEffect(() => {
      const interval = setInterval(() => setCounter(counter => counter - 1), 1000)
      return function() {
        clearInterval(interval)
      }
    })
    
    return React.createElement('h1', {}, 
      'Countdown ', 
      counter
    )
  }

  res.body = React.createElement(App)
}

const page2 = function(req, res) {
```

Last thing is to add it to the main `http.Server` handler.

```js
const plugin = reactPlugin('root')
http.createServer(function(req, res) {
  const url = new URL(req.url)
  //make a router
  switch(url.pathname) {
    case '/foo/bar':
      page1(req, res);
      break;
    case '/bar/foo':
      page2(req, res);
      break;
  }
  
  plugin(req, res)
}).listen()
```

### More Examples

More examples can be found in the [example](./examples) folder in this repo.