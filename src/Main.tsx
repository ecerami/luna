import React from "react";
import { observer } from "mobx-react";
import { Route } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Link } from "react-router-dom";
import Luna from "./components/Luna";
import "./css/Luna.css";
import AboutPanel from "./components/AboutPanel";
import VignettesPanel from "./components/VignettesPanel";

/**
 * Main UI.
 */
@observer
class Main extends React.Component<{}, {}> {
  /**
   * Renders core Luna Interface.
   */
  render(): JSX.Element {
    return (
      <div>
        <Router>
          <div className="nav">
            <span className="nav_header">Luna:</span>
            <span className="nav_link">
              <Link to="/">Home</Link>
            </span>
            <span className="nav_link">
              {" "}
              | <Link to="/about">About</Link>
            </span>
          </div>
          <div className="content">
            <Route exact path="/" component={VignettesPanel} />
            <Route exact path="/about" component={AboutPanel} />
            <Route exact path="/luna/:bucket_slug" component={Luna} />
            <Route
              exact
              path="/luna/:bucket_slug/:gene_symbol"
              component={Luna}
            />
            <Route
              exact
              path="/luna/:bucket_slug/vignette/:vignette_slug"
              component={Luna}
            />
          </div>
        </Router>
      </div>
    );
  }
}

export default Main;
