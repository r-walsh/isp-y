const ADD_PING_DATA = "ping/ADD_PING_DATA";
const START_PING_INTERVAL = "ping/START_PING_INTERVAL";
const STOP_PING_INTERVAL = "ping/STOP_PING_INTERVAL";

const initialState = {
	  pingInfo: []
	, pingRunning: false
};

export default function ping( state = initialState, action ) {
	switch ( action.type ) {
		case ADD_PING_DATA:
			return Object.assign( {}, state, { pingInfo: [ ...state.pingInfo, action.pingInfo ] } );
		case START_PING_INTERVAL:
			return Object.assign( {}, state, { pingRunning: true } );
		case STOP_PING_INTERVAL:
			return Object.assign( {}, state, { pingRunning: false } );
		default: return state;
	}
}

export function addPingData( responseTime, timeSent ) {
	return { pingInfo: { responseTime, timeSent }, type: ADD_PING_DATA };
}

export function startPingInterval() {
	return { type: START_PING_INTERVAL };
}

export function stopPingInterval() {
	return { type: STOP_PING_INTERVAL };
}
