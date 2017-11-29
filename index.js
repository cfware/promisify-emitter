'use strict';

function promisifyEmitter(emitter, resolve_event, options = {}) {
	return new Promise(function(resolve, reject) {
		const reject_event = options.reject || 'error';
		const callbacks = {
			onresolve(arg) {
				resolve(options.pass_arg ? arg : emitter);
				emitter.removeListener(reject_event, callbacks.onreject);
			},
			onreject(error) {
				reject(error);
				emitter.removeListener(resolve_event, callbacks.onresolve);
			},
		};

		if (typeof resolve_event != 'string') {
			reject(new Error('resolve_event must be a string'));

			return;
		}

		if (typeof reject_event != 'string') {
			reject(new Error('options.reject must be a string if provided'));

			return;
		}

		emitter
			.once(resolve_event, callbacks.onresolve)
			.once(reject_event, callbacks.onreject);
	});
}

module.exports = promisifyEmitter;
