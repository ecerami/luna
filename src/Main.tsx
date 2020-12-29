import React from "react";
import { observer } from "mobx-react";
import { Route } from "react-router-dom";
import {BrowserRouter as Router} from "react-router-dom"
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Luna from "./components/Luna";
import "./css/Luna.css";
import ExamplesPanel from "./components/ExamplesPanel";
import { Button } from "@material-ui/core";

/**
 * Main UI.
 */
@observer
class Main extends React.Component<{}, {}> {

	/**
	 * Renders core Luna Interface.
	 */
	render() {
			return (
				<Router>
					<AppBar position="static">
						<Toolbar>
							<Typography variant="h6">
								Luna: Single Cell Viewer
							</Typography>
						</Toolbar>
					</AppBar>
					<div className="content">
						<Route exact path="/" component={ExamplesPanel}/>
						<Route exact path="/luna/:bucket_id" component={Luna}/>
            <Route exact path="/luna/:bucket_id/:gene_symbol" component={Luna}/>
					</div>
				</Router>
      );
    }
}

export default Main;
