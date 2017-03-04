import _ from "lodash";
import ping from "../libs/ping";

import store from "../store";
import { addPingData, clearPingInterval, setPingInterval } from "../ducks/ping";

export function startPinging( host, timeoutString ) {
	const timeout = parseInt( timeoutString );
	store.dispatch( setPingInterval( window.setInterval( () => {
		const timeSent = new Date();
		ping
			.promise.probe( "8.8.8.8", { timeout: timeout / 1000 } )
			.then( res => store.dispatch( addPingData( res.time, timeSent ) ) );
	}, timeout ) ) );
}

export function stopPinging() {
	window.clearInterval( store.getState().pingInterval );
	store.dispatch( clearPingInterval() );
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
