import React, { PropTypes } from "react";

import "./Stats.pcss";

import getPingStats from "../../utils/pingUtils";

import Stat from "./Stat/Stat";

export default function Stats( { pingInfo } ) {
	const {
		  averageJitter
		, averagePing
		, maxPing
		, minPing
		, timeRunning
		, uptime
	} = getPingStats( pingInfo );

	return (
		<div className="stats">
			<h3 className="stats__header">STATS</h3>
			<div className="stats__stat-wrapper">
				<Stat
					name="avg. ping"
					value={ `${ averagePing }ms` }
				/>
				<Stat
					name="avg. jitter"
					value={ `${ averageJitter }ms` }
				/>
				<Stat
					name="uptime"
					value={ `${ uptime }%` }
				/>
				<Stat
					name="packet loss"
					value="3%"
				/>
				<Stat
					name="max ping"
					value={ `${ maxPing }ms` }
				/>
				<Stat
					name="min. ping"
					value={ `${ minPing }ms` }
				/>
				<Stat
					name="time running"
					value={ timeRunning }
				/>
			</div>
		</div>
	);
}

Stats.propTypes = {
	pingInfo: PropTypes.arrayOf( PropTypes.object )
};
