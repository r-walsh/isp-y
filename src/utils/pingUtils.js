import R from "ramda";

function getDefinedResponseTimes( pingInfo ) {
	return pingInfo
		.map( ( { responseTime } ) => responseTime )
		.filter( time => time !== undefined );
}

function average( responseTimes ) {
	return R.converge( R.divide, [ R.sum, R.length ] )( responseTimes );
}

function calculateAveragePing( responseTimes ) {
	return Math.round( average( responseTimes ) ) || 0;
}

function calculateAverageJitter( pingInfo ) {
	if ( pingInfo.length <= 0 ) {
		return 0;
	}

	return (
		R.pipe(
			  R.aperture( 2 )
			, R.map( ( [ a, b ] ) => Math.abs( a - b ) )
			, average
		)( pingInfo ) || 0
	).toFixed( 2 );
}

function calculateUptime( pingInfo ) {
	const amountTimedOut = pingInfo.filter( ( { responseTime } ) => responseTime === undefined ).length;

	const uptime = Math.round( ( 1 - ( amountTimedOut / pingInfo.length ) ) * 100 );

	return uptime || uptime === 0 ? uptime : 100;
}

function getMaxPing( responseTimes ) {
	const maxOrNegativeInfinity = Math.round( Math.max( ...responseTimes ) );

	return maxOrNegativeInfinity === -Infinity ? 0 : maxOrNegativeInfinity;
}

function getMinPing( responseTimes ) {
	const minOrInfinity = Math.round( Math.min( ...responseTimes ) );

	return minOrInfinity === Infinity ? 0 : minOrInfinity;
}

function getTimeRunning( pingInfo ) {
	if ( pingInfo.length <= 1 ) {
		return "0s";
	}

	const millisecondsSinceStart = pingInfo[ 0 ].timeSent.getTime();
	const timeDifferenceInMS = Date.now() - millisecondsSinceStart;

	if ( timeDifferenceInMS > 1000 * 60 * 60 ) {
		return `${ Math.round( timeDifferenceInMS / ( 1000 * 60 * 60 ) ) }h`;
	}

	if ( timeDifferenceInMS > 1000 * 60 ) {
		return `${ Math.round( timeDifferenceInMS / ( 1000 * 60 ) ) }m`;
	}

	if ( timeDifferenceInMS > 1000 ) {
		return `${ Math.round( timeDifferenceInMS / 1000 ) }s`;
	}
}

export default function getPingStats( pingInfo ) {
	const definedResponseTimes = getDefinedResponseTimes( pingInfo );

	return {
		  averageJitter: calculateAverageJitter( definedResponseTimes )
		, averagePing: calculateAveragePing( definedResponseTimes )
		, maxPing: getMaxPing( definedResponseTimes )
		, minPing: getMinPing( definedResponseTimes )
		, timeRunning: getTimeRunning( pingInfo )
		, uptime: calculateUptime( pingInfo )
	};
}
