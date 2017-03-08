import _ from "lodash";
import { Observable, Subject } from "rxjs";
import ping from "../libs/ping";
import store from "../store";
import { addPingData, startPingInterval, stopPingInterval } from "../ducks/ping";

const stop$ = new Subject();

function setupHighPingAlerts( host, threshold, $pinger ) {
	$pinger
		.map( ( [ result ] ) => result.time )
		.filter( time => time === undefined || time >= threshold )
		.throttleTime( 30000 )
		.subscribe( time => {
			if ( time === undefined ) {
				new window.Notification( "Connection Lost", { body: `Ping to ${ host } timed out` } );
				return;
			}

			new window.Notification( "High Ping Warning", { body: `${ Math.round( time ) }ms` } );
		} );
}

export function startPinging( host, timeoutString, alertOnHighPing, notificationThreshold ) {
	const interval = parseInt( timeoutString );

	store.dispatch( startPingInterval() );

	const $pinger = Observable
		.interval( interval * 1000 )
		.startWith( 0 )
		.takeUntil( stop$ )
		.flatMap( () => ping.promise.probe( host, { timeout: interval } )
			.then( result => [ result, new Date() ] )
		);


	$pinger.subscribe( ( [ result, timeSent ] ) => store.dispatch( addPingData( result.time, timeSent ) ) );

	if ( alertOnHighPing ) {
		setupHighPingAlerts( host, notificationThreshold, $pinger );
	}
}

export function stopPinging() {
	stop$.next( true );
	store.dispatch( stopPingInterval() );
}

function getDefinedResponseTimes( pingInfo ) {
	return pingInfo
		.map( ( { responseTime } ) => responseTime )
		.filter( time => time !== undefined );
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

	const uptime = Math.round( ( 1 - ( amountTimedOut / pingInfo.length ) ) * 100 );

	return uptime || uptime === 0 ? uptime : 100;
}
