import React from "react";
//import data from "./data/umap_clusters.json";
import { observable } from "mobx";
import { observer } from "mobx-react";
import DeckGL from '@deck.gl/react';
import {HexagonLayer} from '@deck.gl/aggregation-layers';
import data from "./data/temp.json";
//import data from "./data/hex-test.json";
import "./App.css";

// Viewport settings
const viewState = {
  longitude: -0.4374792,
  latitude: 13.08756237717,
  zoom: 8,
  pitch: 20,
  bearing: 0,
};

@observer
class App extends React.Component {
  @observable colorMenu = 0;

  constructor() {
    super({});
  }  

  render() {
    const layer = new HexagonLayer({
      id: 'hexagon-layer',
      data,
      pickable: true,
      extruded: true,
      radius: 3000,
      elevationScale: 140,
      onHover: (info: any, event: any) => console.log('Hovered:', info, event),
    });

    return (
      <div>
        <DeckGL
          controller={true} 
          initialViewState={viewState}
          layers={[layer]} />
      </div>
    );
  }
}

export default App;
