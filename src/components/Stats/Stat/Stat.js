import React, { PropTypes } from "react";

import "./Stat.pcss";

export default function Stat( { name, value } ) {
	return (
		<div className="stat">
			<span className="stat__name">{ name.toUpperCase() }:</span>
			<span className="stat__value">{ value }</span>
		</div>
	);
}

Stat.propTypes = {
	  name: PropTypes.string.isRequired
	, value: PropTypes.string.isRequired
};
