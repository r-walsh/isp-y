import React, { PropTypes } from "react";
import { connect } from "react-redux";

import "./App.pcss";

import Graph from "./Graph/Graph";
import Settings from "./Settings/Settings";
import Stats from "./Stats/Stats";

export function App( { pingInfo, pingRunning } ) {
	return (
		<div className="app">
			<div className="app__upper-wrapper">
				<Graph pingInfo={ pingInfo } />
				<Stats pingInfo={ pingInfo } />
			</div>
			<div className="app__lower-wrapper">
				<Settings pingRunning={ pingRunning } />
			</div>
		</div>
	);
}

App.propTypes = {
	  pingInfo: PropTypes.arrayOf( PropTypes.object ).isRequired
	, pingRunning: PropTypes.bool.isRequired
};

function mapStateToProps( { pingInfo, pingRunning } ) {
	return {
		  pingInfo
		, pingRunning
	};
}

export default connect( mapStateToProps )( App );
