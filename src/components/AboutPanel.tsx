import React from "react";
import LunaState from "../state/LunaState";

class AboutPanel extends React.Component<{},{}> {
  render() {
    let apiDocs = LunaState.BASE_SERVER_URL + "/docs";
      return (
        <div className="about">
					<h2>Luna:  Single Cell Viewer</h2>
          <p>Luna is a light-weight web platform for visualizing single cell data.</p>
          <p>It is currently available in alpha release, and 
            is being developed as part of the <a href="http://humantumoratlas.org">Human Tumor Atlas Network (HTAN).</a></p>
          <p>For code, see <a href="https://github.com/ecerami/luna_api">Luna API</a> and <a href="https://github.com/ecerami/luna">Luna Front End</a>.</p>
          <p>
            For API details, refer to the <a href={ apiDocs }>Luna API Documentation</a>.
          </p>
        </div>
      );
  }
}

export default AboutPanel;