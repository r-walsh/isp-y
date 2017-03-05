import React, { Component, PropTypes } from "react";
import Chart from "chart.js";
import "./Graph.pcss";

export default class Graph extends Component {
	static propTypes = {
		pingInfo: PropTypes.arrayOf( PropTypes.object )
	};

	componentDidMount() {
		Chart.defaults.global.defaultFontColor = "#ffffff";
		Chart.defaults.global.defaultFontFamily = "Oswald";
		this.chart = new Chart( this.canvas, {
			data: {
				  datasets: [
					{
						  backgroundColor: "rgba(75,192,192,0.4)"
						, borderCapStyle: "butt"
						, borderColor: "rgba(75,192,192,1)"
						, borderDash: []
						, borderDashOffset: 0.0
						, borderJoinStyle: "miter"
						, data: []
						, fill: false
						, label: "Ping"
						, lineTension: 0.1
						, pointBackgroundColor: "#fff"
						, pointBorderColor: "rgba(75,192,192,1)"
						, pointBorderWidth: 1
						, pointHitRadius: 10
						, pointHoverBackgroundColor: "rgba(75,192,192,1)"
						, pointHoverBorderColor: "rgba(220,220,220,1)"
						, pointHoverBorderWidth: 2
						, pointHoverRadius: 5
						, pointRadius: 1
						, spanGaps: false
					}
				]
			}
			, labels: []
			, options: {
				  maintainAspectRatio: false
				, scales: {
					  xAxes: [ {
						  display: false
					} ]
					, yAxes: [ {
						ticks: {
							  min: 0
							, suggestedMax: 100
						}
					} ]
				}
			}
			, type: "line"
		} );
	}

	componentWillReceiveProps( { pingInfo } ) {
		this.chart.data.datasets[ 0 ].data = pingInfo.map( ( { responseTime } ) => responseTime );
		this.chart.data.labels = pingInfo.map( ( _, index ) => index );
		this.chart.update();
	}

	canvas = null;
	chart = null;

	render() {
		return (
			<div className="graph">
				<canvas height="100%" ref={ canvas => this.canvas = canvas } />
			</div>
		);
	}
}
