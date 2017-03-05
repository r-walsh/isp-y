import _ from "lodash";
import { Observable, Subject } from "rxjs";
import ping from "../libs/ping";

import store from "../store";
import { addPingData, startPingInterval, stopPingInterval } from "../ducks/ping";

const stop$ = new Subject();

export function startPinging( host, timeoutString ) {
	const interval = parseInt( timeoutString );
	Observable.interval( interval )
		.takeUntil( stop$ )
		.do( () => store.dispatch( startPingInterval() )
		.flatMap( () => ping.promise.probe( "8.8.8.8", { timeout: interval / 1000 } ) )
		.do( console.log )
		.subscribe( ( result ) => {
			const timeSent = new Date(); // just for testing
			store.dispatch( addPingData( result.time, timeSent ) );
		} ) );
	
	// Observable
	// 	.interval( interval )
	// 	.takeUntil( stop$ )
	// 	.do( () => store.dispatch( startPingInterval() ) )
	// 	.flatMap( () => [ new Date(), ping.promise.probe( host, { timeout: interval / 1000 } ) ] )
	// 	// .subscribe( ( [ timeSent, result ] ) => store.dispatch( addPingData( result.time, timeSent ) ) );
	// 	.subscribe( ( ...args ) => console.log( args ) );
}

export function stopPinging() {
	stop$.next( true );
	store.dispatch( stopPingInterval() );
}

function getDefinedResponseTimes( pingInfo ) {
	return _( pingInfo )
		.map( ( { responseTime } ) => responseTime )
		.filter( time => time !== undefined )
		.value();
}

export function calculateAveragePing( pingInfo ) {
	const definedResponseTimes = getDefinedResponseTimes( pingInfo );
	const averagePingOrNaN = Math.round(
		definedResponseTimes.reduce( ( pv, cr ) => pv + cr, 0 ) / definedResponseTimes.length
	);

	return isNaN( averagePingOrNaN ) ? 0 : averagePingOrNaN;
}

export function calculateJitter( pingInfo ) {
	if ( pingInfo.length <= 0 ) {
		return 0;
	}

	const definedResponseTimes = getDefinedResponseTimes( pingInfo );

	return ( ( _.max( definedResponseTimes ) || 0 ) - ( _.min( definedResponseTimes ) || 0 ) ).toFixed( 2 );
}

export function calculateUptime( pingInfo ) {
	const amountTimedOut = pingInfo.filter( ( { responseTime } ) => responseTime === undefined ).length;

	return Math.round( ( 1 - ( amountTimedOut / pingInfo.length ) ) * 100 ) || 100;
}
