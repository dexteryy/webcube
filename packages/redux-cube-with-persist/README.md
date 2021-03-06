# redux-cube-with-persist

[< Back to Project WebCube](https://github.com/dexteryy/Project-WebCube/)

[![NPM Version][npm-image]][npm-url]
<!-- [![Build Status][travis-image]][travis-url]
[![Dependencies Status][dep-image]][dep-url] -->

[![Nodei][nodei-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/redux-cube-with-persist.svg
[nodei-image]: https://nodei.co/npm/redux-cube-with-persist.png?downloads=true
[npm-url]: https://npmjs.org/package/redux-cube-with-persist
<!--
[travis-image]: https://img.shields.io/travis/dexteryy/redux-cube-with-persist/master.svg
[travis-url]: https://travis-ci.org/dexteryy/redux-cube-with-persist
[dep-image]: https://david-dm.org/dexteryy/redux-cube-with-persist.svg
[dep-url]: https://david-dm.org/dexteryy/redux-cube-with-persist
-->

[redux-cube](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-cube)'s pluggable module for [redux-persist](https://www.npmjs.com/package/redux-persist)

```
npm install --save redux-cube-with-persist
```

> NOTE: redux-cube-with-persist cannot be used with [redux-cube-with-immutable](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-cube-with-immutable)

## Get Started

```js
// xxx/App.jsx
import { createApp } from 'redux-cube';
import withPersist from 'redux-cube-with-persist';
import localforage from 'localforage';
import withRouter from 'redux-cube-with-router';

@createApp(withPersist(withRouter({
  reducers: {
    // ...
  },
  // optional
  // https://github.com/rt2zz/redux-persist#storage-engines
  persistStorage: localforage,
  // optional
  // https://github.com/rt2zz/redux-persist/blob/master/docs/api.md#type-persistconfig
  persistKey = 'persistRoot',
  // optional
  // https://github.com/rt2zz/redux-persist/blob/master/docs/api.md#type-persistconfig
  persistConfig: {
    // ...
  },
  // optional
  // https://github.com/rt2zz/redux-persist-transform-immutable#usage-with-records
  persistImmutableConfig: {
    // ...
  },
  // ...
}))))
class SubApp extends PureComponent {
  render() {
    // ...
  }
}
```
