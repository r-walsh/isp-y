"use strict";

/**
 * LICENSE MIT
 * (C) Daniel Zelisko
 * http://github.com/danielzzz/node-ping
 *
 * a simple wrapper for ping
 * Now with support of not only english Windows.
 *
 */

// System library
const util = require( "util" );
const cp = window.child_process;
const os = require( "os" );

// 3rd-party library
const Q = require( "q" );

// Our library
const linuxBuilder = require( "./builder/linux" );
const macBuilder = require( "./builder/mac" );
const winBuilder = require( "./builder/win" );

/**
 * Class::PromisePing
 *
 * @param {string} addr - Hostname or ip addres
 * @param {PingConfig} config - Configuration for command ping
 * @return {Promise}
 */
function probe( addr, config ) {
	const p = os.platform();
	let ls = null;
	let outstring = "";
	const deferred = Q.defer();
	let args = [];
	// Do not reassign function argument
	const _config = config || {};

	if ( p === "linux" ) {
		// linux
		args = linuxBuilder.getResult( addr, _config );
		ls = cp.spawn( "/bin/ping", args );
	} else if ( p.match( /^win/ ) ) {
		// windows
		args = winBuilder.getResult( addr, _config );
		ls = cp.spawn( `${ process.env.SystemRoot  }/system32/ping.exe`, args );
	} else if ( p === "darwin" || p === "freebsd" ) {
		// mac osx
		args = macBuilder.getResult( addr, _config );
		ls = cp.spawn( "/sbin/ping", args );
	} else if ( p === "aix" ) {
		// aix
		args = linuxBuilder.getResult( addr, _config );
		ls = cp.spawn( "/usr/sbin/ping", args );
	}

	ls.on( "error", () => {
		const err = new Error(
			util.format(
				"ping.probe: %s. %s",
				"there was an error while executing the ping program. ",
				"Check the path or permissions..."
			)
		);
		deferred.reject( err );
	} );

	ls.stdout.on( "data", ( data ) => {
		outstring += String( data );
	} );

	ls.on( "close", ( code ) => {
		let result = code === 0;
		let time;
		const lines = outstring.split( "\n" );
		// workaround for windows machines
		// if host is unreachable ping will return
		// a successfull error code
		// so we need to handle this ourself
		if ( p.match( /^win/ ) ) {
			// this is my solution on Chinese Windows8 64bit
			result = false;
			for ( let i = 0; i < lines.length; i++ ) {
				const line = lines[ i ];
				if ( line.search( /TTL=[0-9]+/i ) > 0 ) {
					result = true;
					break;
				}
			}
		}

		for ( let t = 0; t < lines.length; t++ ) {
			const match = /time=([0-9\.]+)\s*ms/i.exec( lines[ t ] );
			if ( match ) {
				time = parseFloat( match[ 1 ], 10 );
				break;
			}
		}
		deferred.resolve( {
			host: addr
			, alive: result
			, output: outstring
			, time
		} );
	} );

	return deferred.promise;
}

exports.probe = probe;
