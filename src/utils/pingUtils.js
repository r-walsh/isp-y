import R from "ramda";

function getDefinedResponseTimes( pingInfo ) {
	return pingInfo
		.map( ( { responseTime } ) => responseTime )
		.filter( time => time !== undefined );
}

export function calculateAveragePing( pingInfo ) {
	const definedResponseTimes = getDefinedResponseTimes( pingInfo );

	return R.pipe(
		  R.sum
		, R.divide( R.__, definedResponseTimes.length )
		, Math.round
	)( definedResponseTimes ) || 0;
}

export function calculateAverageJitter( pingInfo ) {
	if ( pingInfo.length <= 0 ) {
		return 0;
	}

	const jitterTimes = getDefinedResponseTimes( pingInfo )
		.map( ( time, index, arr ) => Math.abs( time - arr[ index + 1 ] ) || 0 );

	return R.pipe( R.sum, R.divide( R.__, jitterTimes.length ) )( jitterTimes ).toFixed( 2 ) || 0;
}

export function calculateUptime( pingInfo ) {
	const amountTimedOut = pingInfo.filter( ( { responseTime } ) => responseTime === undefined ).length;

	const uptime = Math.round( ( 1 - ( amountTimedOut / pingInfo.length ) ) * 100 );

	return uptime || uptime === 0 ? uptime : 100;
}
