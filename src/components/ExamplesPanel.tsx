import React from "react";
import { Link } from "react-router-dom";

class ExamplesPanel extends React.Component<{},{}> {
  render() {
      return (
        <div>
					<ul className="header">
            <li><Link to="/luna/1">Tabula Muris:  Base Map</Link></li>
            <li><Link to="/luna/1/Egfr">Tabula Muris:  Egfr</Link></li>
            <li><Link to="/luna/1/P2ry12">Tabula Muris:  P2ry12</Link></li>
            <li><Link to="/luna/1/Serpina1c">Tabula Muris:  Serpina1c</Link></li>
          </ul>
        </div>
      );
  }
}

export default ExamplesPanel;