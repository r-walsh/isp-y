import _ from "lodash";
import { Observable, Subject } from "rxjs";
import ping from "../libs/ping";
import store from "../store";
import { addPingData, startPingInterval, stopPingInterval } from "../ducks/ping";

const stop$ = new Subject();

export function startPinging( host, timeoutString, alertOnHighPing, notificationThreshold ) {
	const interval = parseInt( timeoutString );

	store.dispatch( startPingInterval() );

	Observable
		.interval( interval )
		.startWith( 0 )
		.takeUntil( stop$ )
		.flatMap( () => ping.promise.probe( host, { timeout: interval / 1000 } )
			.then( result => {
				if ( result.time >= notificationThreshold && alertOnHighPing ) {
					new window.Notification( "High Ping Warning", {
						body: `${ Math.round( result.time ) }ms`
					} );
				}
				return [ result, new Date() ];
			} )
		)
		.subscribe( ( [ result, timeSent ] ) => store.dispatch( addPingData( result.time, timeSent ) ) );
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
