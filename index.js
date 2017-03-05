#!/usr/bin/env node

const electroner = require( "electroner" );
const luvi = require( "luvi" );
const { resolve } = require( "path" );

luvi( {
	  noOpen: true
	, onListen() {
		return electroner( resolve( __dirname, "app.js" ), () => process.exit( 0 ) );
	}
	, port: 9876
	, root: resolve( __dirname, "public" )
} );
