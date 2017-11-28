'use strict';

function promisifyEmitter(emitter, resolve_event, reject_event) {
	return new Promise(function(resolve, reject) {
		const callbacks = {
			onresolve() {
				resolve(emitter);
				emitter.removeListener(reject_event, callbacks.onreject);
			},
			onreject(error) {
				reject(error);
				emitter.removeListener(resolve_event, callbacks.onresolve);
			},
		};

		if (typeof resolve_event != 'string') {
			/* give the caller a chance to use .catch callback. */
			setTimeout(function promisifyEmitter() {
				reject(new Error('resolve_event must be a string'));
			}, 1);
			return;
		}

		reject_event = reject_event || 'error';

		emitter
			.once(resolve_event, callbacks.onresolve)
			.once(reject_event, callbacks.onreject);
	});
}

module.exports = promisifyEmitter;
