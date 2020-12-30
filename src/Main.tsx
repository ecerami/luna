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
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import AboutPanel from "./components/AboutPanel";

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
				<div>
				<Router>
						<div className="nav">
							<span className="nav_header">Luna:</span>
							<span className="nav_link"><Link to="/">Home</Link></span>
							<span className="nav_link"> | <Link to="/about">About</Link></span>
						</div>
						<div className="content">
						<Route exact path="/" component={ExamplesPanel}/>
						<Route exact path="/about" component={AboutPanel}/>
						<Route exact path="/luna/:bucket_id" component={Luna}/>
            <Route exact path="/luna/:bucket_id/:gene_symbol" component={Luna}/>
					</div>
				</Router>
				</div>
      );
    }
}

export default Main;
