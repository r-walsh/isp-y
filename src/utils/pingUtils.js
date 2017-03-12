import R from "ramda";

function getDefinedResponseTimes( pingInfo ) {
	return pingInfo
		.map( ( { responseTime } ) => responseTime )
		.filter( time => time !== undefined );
}

export function calculateAveragePing( responseTimes ) {
	return R.pipe(
			  R.sum
			, R.divide( R.__, responseTimes.length )
			, Math.round
		)( responseTimes ) || 0;
}

export function calculateAverageJitter( pingInfo ) {
	if ( pingInfo.length <= 0 ) {
		return 0;
	}

	return (
		R.pipe(
			  R.aperture( 2 )
			, R.map( ( [ a, b ] ) => Math.abs( a - b ) )
			, R.converge( R.divide, [ R.sum, R.length ] )
		)( pingInfo ) || 0
	).toFixed( 2 );
}

export function calculateUptime( pingInfo ) {
	const amountTimedOut = pingInfo.filter( ( { responseTime } ) => responseTime === undefined ).length;

	const uptime = Math.round( ( 1 - ( amountTimedOut / pingInfo.length ) ) * 100 );

	return uptime || uptime === 0 ? uptime : 100;
}

function getMaxPing( responseTimes ) {
	const maxOrNegativeInfinity = Math.round( Math.max( ...responseTimes ) );

	return maxOrNegativeInfinity === -Infinity ? 0 : maxOrNegativeInfinity;
}

function getMinPing( responseTimes ) {
	const minOrNegativeInfinity = Math.round( Math.min( ...responseTimes ) );

	return minOrNegativeInfinity === -Infinity ? 0 : minOrNegativeInfinity;
}

export default function getPingStats( pingInfo ) {
	const definedResponseTimes = getDefinedResponseTimes( pingInfo );

	return {
		  averageJitter: calculateAverageJitter( definedResponseTimes )
		, averagePing: calculateAveragePing( definedResponseTimes )
		, maxPing: getMaxPing( definedResponseTimes )
		, minPing: getMinPing( definedResponseTimes )
		, uptime: calculateUptime( pingInfo )
	};
}
