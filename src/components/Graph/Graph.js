import React, { Component, PropTypes } from "react";
import Chart from "chart.js";
import "./Graph.pcss";

export default class Graph extends Component {
	componentDidMount() {
		Chart.defaults.global.defaultFontColor = "#ffffff";
		Chart.defaults.global.defaultFontFamily = "Oswald";
		this.chart = new Chart( this.canvas, {
			data: {
				labels: [],
				datasets: [
					{
						label: "My First dataset",
						fill: false,
						lineTension: 0.1,
						backgroundColor: "rgba(75,192,192,0.4)",
						borderColor: "rgba(75,192,192,1)",
						borderCapStyle: 'butt',
						borderDash: [],
						borderDashOffset: 0.0,
						borderJoinStyle: 'miter',
						pointBorderColor: "rgba(75,192,192,1)",
						pointBackgroundColor: "#fff",
						pointBorderWidth: 1,
						pointHoverRadius: 5,
						pointHoverBackgroundColor: "rgba(75,192,192,1)",
						pointHoverBorderColor: "rgba(220,220,220,1)",
						pointHoverBorderWidth: 2,
						pointRadius: 1,
						pointHitRadius: 10,
						data: [],
						spanGaps: false
					}
				]
			}
			, options: {
				  maintainAspectRatio: false
				, scales: {
					  xAxes: [ {
						  display: false
					} ]
					, yAxes: [ {
						ticks: {
							  suggestedMax: 100
							, min: 0
						}
					} ]
				}
			}
			, type: "line"
		} );
	}

	componentWillReceiveProps( nextProps ) {
		this.chart.data.datasets[ 0 ].data = nextProps.pingInfo.map( ( { responseTime } ) => responseTime );
		this.chart.data.labels = nextProps.pingInfo.map( ( _, index ) => index );
		this.chart.update();
	}

	canvas = null;
	chart = null;

	render() {
		return (
			<div className="graph">
				<canvas height="100%" ref={ canvas => this.canvas = canvas }/>
			</div>
		);
	}
}
