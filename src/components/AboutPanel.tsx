import React from "react";
import { Link } from "react-router-dom";

class AboutPanel extends React.Component<{},{}> {
  render() {
      return (
        <div className="about">
					<h2>Luna:  Single Cell Viewer</h2>
          <p>Luna is a light-weight web-based platform for visualizing single cell data.</p>
          <p>It is currently available in alpha release, and 
            is being developed as part of the <a href="http://humantumoratlas.org">Human Tumor Atlas Network (HTAN).</a></p>
          <p>For code, see <a href="https://github.com/ecerami/luna_api">Luna API</a> and <a href="https://github.com/ecerami/luna">Luna Front End</a>.</p>
        </div>
      );
  }
}

export default AboutPanel;