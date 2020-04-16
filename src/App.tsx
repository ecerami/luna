import React from "react";
//import data from "./data/umap_clusters.json";
import { observable } from "mobx";
import { observer } from "mobx-react";
import DeckGL from '@deck.gl/react';
import {HexagonLayer} from '@deck.gl/aggregation-layers';
import data from "./data/hex-test.json";
import "./App.css";

// Viewport settings
const viewState = {
  longitude: -122.408778,
  latitude: 37.782887,
  zoom: 13,
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
      radius: 60,
      elevationScale: 4,
    });

    return (
      <div>
        <DeckGL viewState={viewState} layers={[layer]} />
      </div>
    );
  }
}

export default App;
