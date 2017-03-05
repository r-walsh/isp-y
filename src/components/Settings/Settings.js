import React, { Component, PropTypes } from "react";

import "./Settings.pcss";

import { startPinging, stopPinging } from "../../services/pingService";

export default class Settings extends Component {
	static propTypes = { pingRunning: PropTypes.bool };

	static defaultProps = { pingRunning: false };


	constructor( props ) {
		super( props );

		this.handleHighPingThresholdChange = this.handleChange.bind( this, "highPingThreshold" );
		this.handleHostChange = this.handleChange.bind( this, "host" );
		this.handleTimeoutChange = this.handleChange.bind( this, "timeout" );
	}

	state = {
		  alertOnHighPing: false
		, highPingThreshold: 150
		, host: ""
		, timeout: "1000"
	};

	handleChange( field, event ) {
		this.setState( { [ field ]: event.target.value } );
	}

	handleFocus = event => event.target.select();

	toggleAlertOnHighPing = () => this.setState( { alertOnHighPing: !this.state.alertOnHighPing } );

	startPinging = () => {
		const { alertOnHighPing, highPingThreshold, host, timeout } = this.state;

		startPinging( host, timeout, alertOnHighPing, highPingThreshold );
	};

	stopPinging() {
		stopPinging();
	}

	render() {
		const {
			  alertOnHighPing
			, highPingThreshold
			, host
			, timeout
		} = this.state;

		const { pingRunning } = this.props;

		return (
			<div className="settings">
				<h3 className="settings__header">SETTINGS</h3>

				<div className="settings__settings-wrapper">
					<div className="settings__input-group">
						<label className="settings__label">Host</label>
						<input
							className="settings__input"
							onChange={ this.handleHostChange }
							placeholder="www.google.com / 8.8.8.8"
							required
							type="text"
							value={ host }
						/>
					</div>
					<div className="settings__input-group">
						<label className="settings__label">Timeout</label>
						<div className="settings__select">
							<select
								className="settings__input"
								id="settings__timeout-select"
								onChange={ this.handleTimeoutChange }
								value={ timeout }
							>
								<option value="300">300ms</option>
								<option value="400">400ms</option>
								<option value="500">500ms</option>
								<option value="1000">1 second</option>
								<option value="1500">1.5 seconds</option>
								<option value="2000">2 seconds</option>
							</select>
							<span>▼</span>
						</div>
					</div>

					<div className="settings__input-group">
						<div className="settings__threshold-wrapper-upper">
							<label className="settings__label settings__label--inline">Alert on high ping</label>
							<div className="settings__high-ping-toggle-wrapper">
								<input
									className="settings__high-ping-toggle-input"
									id="settings__high-ping-toggle"
									name="settings__high-ping-toggle"
									onChange={ this.toggleAlertOnHighPing }
									type="checkbox"
									value={ alertOnHighPing }
								/>
								<label
									className="settings__high-ping-toggle-label"
									htmlFor="settings__high-ping-toggle"
								>
									<span className="settings__high-ping-toggle-inner" />
									<span className="settings__high-ping-handle" />
								</label>
							</div>
						</div>

						<div className="settings__threshold-wrapper-lower">
							<label className="settings__label settings__label--inline">Threshold(ms)</label>
							<input
								className="settings__input settings__input--inline"
								disabled={ !alertOnHighPing }
								onChange={ this.handleHighPingThresholdChange }
								onFocus={ this.handleFocus }
								placeholder="100"
								type="number"
								value={ highPingThreshold }
							/>
						</div>
					</div>
					<div className="settings__button-wrapper">
						<button
							className="settings__button"
							disabled={ !host || pingRunning }
							onClick={ this.startPinging }
						>
							START
						</button>
						<button
							className="settings__button settings__button--stop"
							disabled={ !pingRunning }
							onClick={ this.stopPinging }
						>
							STOP
						</button>
					</div>
				</div>
			</div>
		);
	}
}
