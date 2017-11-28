# @cfware/promisify-emitter

[![Travis CI][travis-image]][travis-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Greenkeeper badge](https://badges.greenkeeper.io/cfware/promisify-emitter.svg)](https://greenkeeper.io/)
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![MIT][license-image]](LICENSE)

Initiate a promise that resolves or rejects based on emitter events.

### Install @cfware/promisify-emitter

This module requires node.js 4 or above.

```sh
npm i --save @cfware/promisify-emitter
```

## Usage

### Direct usage on emitter that is not yet resolved
```js
const koa = require('koa');
const promisifyEmitter = require('@cfware/promisify-emitter');

async function main() {
	const app = new koa();

	app.use(ctx => ctx.body = 'Hello world!');

	const server = await promisifyEmitter(app.listen(0), 'listening');

	console.log(`Listening at http://localhost:${server.address().port}/`);
}

main().catch(console.error);
```

### Extending class with a replacement function

```js
const koa_base = require('koa');
const promisifyEmitter = require('@cfware/promisify-emitter');

class koa extends koa_base {
	listen(...args) {
		return promisifyEmitter(super.listen(...args), 'listening');
	}
}

async function main() {
	const app = new koa();

	app.use(ctx => ctx.body = 'Hello world!');

	const server = await app.listen(0);

	console.log(`Listening at http://localhost:${server.address().port}/`);
}

main().catch(console.error);
```

## Running tests

Tests are provided by eslint and mocha.

```sh
npm install
npm test
```

[npm-image]: https://img.shields.io/npm/v/@cfware/promisify-emitter.svg
[npm-url]: https://npmjs.org/package/@cfware/promisify-emitter
[travis-image]: https://travis-ci.org/cfware/promisify-emitter.svg?branch=master
[travis-url]: https://travis-ci.org/cfware/promisify-emitter
[coverage-image]: https://coveralls.io/repos/github/cfware/promisify-emitter/badge.svg
[coverage-url]: https://coveralls.io/github/cfware/promisify-emitter
[downloads-image]: https://img.shields.io/npm/dm/@cfware/promisify-emitter.svg
[downloads-url]: https://npmjs.org/package/@cfware/promisify-emitter
[license-image]: https://img.shields.io/github/license/cfware/promisify-emitter.svg
