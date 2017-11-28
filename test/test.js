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

function emit_error(done, emitter, error_event) {
	const error = new Error('Expected error');
	const pr = promisifyEmitter(emitter, 'ready', error_event);

	expect_failure(done, pr, error);
	emitter.emit(error_event || 'error', error);
}

describe('@cfware/promisify-emitter', () => {
	const emitter = new events();

	describe('bad arguments', () => {
		it('no arguments throws', done => expect_failure(done, promisifyEmitter()));
		it('only emitter throws', done => expect_failure(done, promisifyEmitter(emitter)));
	});

	describe('valid arguments', () => {
		it('emitter resolves', () => {
			const pr = promisifyEmitter(emitter, 'ready');

			emitter.emit('ready');

			return pr;
		});

		it('default reject functions correctly', done => emit_error(done, emitter));
		it('non-default reject functions correctly', done => emit_error(done, emitter, 'myerror'));
	});
});
