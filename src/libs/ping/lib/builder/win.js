/**
 * A builder builds command line arguments for ping in window environment
 * @module lib/builder/win
 */
const util = require( "util" );
const builder = {};

/**
 * Cross platform config representation
 * @typedef {Object} PingConfig
 * @property {boolean} numeric - Map IP address to hostname or not
 * @property {number} timeout - Time duration for ping command to exit
 * @property {number} min_reply - Exit after sending number of ECHO_REQUEST
 * @property {string[]} extra - Optional options does not provided
 */

const defaultConfig = {
	numeric: true
	, timeout: 5
	, min_reply: 1
	, extra: []
};

/**
 * Get the finalized array of command line arguments
 * @param {string} target - hostname or ip address
 * @param {PingConfig} [config] - Configuration object for cmd line argument
 * @return {string[]} - Command line argument according to the configuration
 */
builder.getResult = function ( target, config ) {
	const _config = config || {};

	// Empty argument
	let ret = [];

	// Make every key in config has been setup properly
	const keys = [ "numeric", "timeout", "min_reply", "extra" ];
	keys.forEach( ( k ) => {
		// Falsy value will be overrided without below checking
		if ( typeof ( _config[ k ] ) !== "boolean" ) {
			_config[ k ] = _config[ k ] || defaultConfig[ k ];
		}
	} );

	if ( !_config.numeric ) {
		ret.push( "-a" );
	}

	if ( _config.timeout ) {
		ret = ret.concat( [
			"-w"
			, util.format( "%d", _config.timeout * 1000 )
		] );
	}

	if ( _config.min_reply ) {
		ret = ret.concat( [
			"-n"
			, util.format( "%d", _config.min_reply )
		] );
	}

	if ( _config.extra ) {
		ret = ret.concat( _config.extra );
	}

	ret.push( target );

	return ret;
};

module.exports = builder;
