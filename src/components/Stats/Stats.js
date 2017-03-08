import React, { PropTypes } from "react";

import "./Stats.pcss";

import { calculateAveragePing, calculateJitter, calculateUptime } from "../../utils/pingUtils";

import Stat from "./Stat/Stat";

export default function Stats( { pingInfo } ) {
	return (
		<div className="stats">
			<h3 className="stats__header">STATS</h3>
			<div className="stats__stat-wrapper">
				<Stat
					name="avg. ping"
					value={ `${ calculateAveragePing( pingInfo ) }ms` }
				/>
				<Stat
					name="jitter"
					value={ `${ calculateJitter( pingInfo ) }ms` }
				/>
				<Stat
					name="uptime"
					value={ `${ calculateUptime( pingInfo ) }%` }
				/>
				<Stat
					name="packet loss"
					value="3%"
				/>
			</div>
		</div>
	);
}

Stats.propTypes = {
	pingInfo: PropTypes.arrayOf( PropTypes.object )
};
