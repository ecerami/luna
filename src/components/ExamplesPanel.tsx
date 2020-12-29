import React from "react";
import { Link } from "react-router-dom";

class ExamplesPanel extends React.Component<{},{}> {
  render() {
      return (
        <div>
					<ul className="header">
            <li><Link to="/luna/1">Tabula Muris:  Single Cell Mouse Data</Link></li>
          </ul>
        </div>
      );
  }
}

export default ExamplesPanel;