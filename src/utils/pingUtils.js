import _ from "lodash";

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
