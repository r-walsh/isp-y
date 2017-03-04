import React, { Component } from "react";
import { connect } from "react-redux";

import "./App.pcss";

import Graph from "./Graph/Graph";
import Settings from "./Settings/Settings";
import Stats from "./Stats/Stats";

export class App extends Component {
	render() {
		const { pingInfo, pingRunning } = this.props;

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
}

function mapStateToProps( { pingInterval, pingInfo } ) {
	return {
		  pingInfo
		, pingRunning: pingInterval !== null
	};
}

export default connect( mapStateToProps )( App );
