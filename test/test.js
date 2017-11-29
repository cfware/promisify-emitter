'use strict';

const events = require('events');
const promisifyEmitter = require('..');

function expect_failure(done, pr, specific_error) {
	pr.then(
		() => done(new Error('Unexpected resolve')),
		error => {
			if (!specific_error || specific_error === error) {
				done();
			} else {
				done(new Error('Expected error but received the wrong one.'));
			}
		}
	);
}

function emit_error(done, emitter, options = {}) {
	const error = new Error('Expected error');
	const pr = promisifyEmitter(emitter, 'ready', options);

	expect_failure(done, pr, error);
	emitter.emit(options.reject || 'error', error);
}

function expect_success(done, emitter, expected_resolve, options) {
	const pr = promisifyEmitter(emitter, 'ready', options);

	pr.then(res => {
		if (res == expected_resolve) {
			done();
		} else {
			done(new Error('Resolve provided incorrect object.'));
		}
	});
	pr.catch(done);
}

describe('@cfware/promisify-emitter', () => {
	const emitter = new events();

	describe('bad arguments', () => {
		it('no arguments throws', done => expect_failure(done, promisifyEmitter()));
		it('only emitter throws', done => expect_failure(done, promisifyEmitter(emitter)));
		it('non-string reject throws', done => expect_failure(done, promisifyEmitter(emitter, '', {reject: 12})));
	});

	describe('valid arguments', () => {
		it('emitter resolves with the emitter', done => {
			expect_success(done, emitter, emitter, {});

			emitter.emit('ready', null);
		});

		it('emitter resolves with arg', done => {
			const test_arg = {};

			expect_success(done, emitter, test_arg, {pass_arg: true});

			emitter.emit('ready', test_arg);
		});

		it('default reject functions correctly', done => emit_error(done, emitter));
		it('non-default reject functions correctly', done => emit_error(done, emitter, {reject: 'myerror'}));
	});
});
