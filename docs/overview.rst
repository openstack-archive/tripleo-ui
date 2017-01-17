Overview
========

There are four major tools that we use to develop the TripleO UI:

* React
* Redux
* Babel
* Webpack

React
-----

React is the presentation layer.

https://github.com/facebook/react

Redux
-----

Redux is the data layer.  It's responsible for managing the state of the
application.  If you want to change a piece of data in the application, you need
to go through Redux.  Most of the Redux code is contained in Action and Reducer
files.

https://github.com/reactjs/redux

Babel
-----

Babel is a translation layer that allows us to write code using recent
Javascript features without having to worry about browser compatibility.  We can
write code in es6, and Babel will compile this to standard Javascript.

https://github.com/babel/babel

Webpack
-------

Webpack is our build tool.  Webpack uses Babel to actually produce a minified
Javascript file that can be used in production.  Webpack gives us a development
server which watches for file changes, and automatically recompiles our code.

https://github.com/webpack/webpack
