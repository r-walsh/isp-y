import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import "./index.pcss";

import store from "./store";

import App from "./components/App";

const reactRoot = document.getElementById( "root" );

render(
	<Provider store={ store }>
		<App />
	</Provider>
	, reactRoot
);
