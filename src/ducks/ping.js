const ADD_PING_DATA = "ping/ADD_PING_DATA";
const CLEAR_PING_INTERVAL = "ping/CLEAR_PING_INTERVAL";
const SET_PING_INTERVAL = "ping/SET_PING_INTERVAL";

const initialState = {
	  pingInterval: null
	, pingInfo: []
};

export default function ping( state = initialState, action ) {
	switch ( action.type ) {
		case ADD_PING_DATA:
			return Object.assign( {}, state, { pingInfo: [ ...state.pingInfo, action.pingInfo ] } );
		case CLEAR_PING_INTERVAL:
			return Object.assign( {}, state, { pingInterval: null } );
		case SET_PING_INTERVAL:
			return Object.assign( {}, state, { pingInterval: action.pingInterval } );
		default: return state;
	}
}

export function addPingData( responseTime, timeSent ) {
	return { pingInfo: { responseTime, timeSent }, type: ADD_PING_DATA };
}

export function clearPingInterval() {
	return { type: CLEAR_PING_INTERVAL };
}

export function setPingInterval( pingInterval ) {
	return { pingInterval, type: SET_PING_INTERVAL };
}
