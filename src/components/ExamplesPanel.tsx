import React from "react";
import { Link } from "react-router-dom";

class ExamplesPanel extends React.Component<{}, {}> {
  render(): JSX.Element {
    return (
      <div>
        <ul className="header">
          <li>
            <Link to="/luna/tabula_muris">Tabula Muris: Base Map</Link>
          </li>
          <li>
            <Link to="/luna/tabula_muris/Egfr">Tabula Muris: Egfr</Link>
          </li>
          <li>
            <Link to="/luna/tabula_muris/P2ry12">Tabula Muris: P2ry12</Link>
          </li>
          <li>
            <Link to="/luna/tabula_muris/P2ry12?hex_bin_radius=50&elevation_by=P2ry12&elevation_scale=1000">
              Tabula Muris: P2ry12 (3D)
            </Link>
          </li>
          <li>
            <Link to="/luna/tabula_muris/Serpina1c">
              Tabula Muris: Serpina1c
            </Link>
          </li>
          <li>
            <Link to="/luna/tabula_muris?color_by=cell_ontology_class&active=basophil&active=astrocyte&active=microglial%20cell">
              Tabula Muris: Highlight microglial cells
            </Link>
          </li>
          <li>
            <Link to="/luna/tabula_muris/P2ry12?hex_bin_radius=50&elevation_by=P2ry12&elevation_scale=1000&color_by=cell_ontology_class&active=microglial%20cell">
              Tabula Muris: P2ry12 (3D), Highlight microglial cells
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default ExamplesPanel;
