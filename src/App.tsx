import React from "react";
//import data from "./data/umap_clusters.json";
import { observable } from "mobx";
import { observer } from "mobx-react";
import DeckGL from '@deck.gl/react';
import {HexagonLayer} from '@deck.gl/aggregation-layers';
import data from "./data/temp.json";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';


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
  @observable hexBinRadius = 3000;

  constructor() {
    super({});
    this.handleRadiusChange = this.handleRadiusChange.bind(this);
  }  

  handleRadiusChange(event: any, newValue: any) {
    console.log(newValue);
    this.hexBinRadius = newValue;
  }

  render() {
    const layer = new HexagonLayer({
      id: 'hexagon-layer',
      data,
      pickable: true,
      extruded: true,
      radius: this.hexBinRadius,
      elevationScale: 140,
      onHover: (info: any, event: any) => console.log('Hovered:', info, event),
    });

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">
              Luna:  Single Cell Visualizer
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container spacing={3}>
        <Grid id="left-column" item xs={2}>
          <div id="left-column-content">
              <Typography>Hex Bin radius:</Typography>
              <Slider
                onChange={this.handleRadiusChange}
                defaultValue={3000}
                min={0}
                max={20000}
                step={200}
                valueLabelDisplay="auto"
              />
        </div>
        </Grid>
        <Grid item xs={9}>
          <div id="map"/>
          <DeckGL
            controller={true} 
            initialViewState={viewState}
            layers={[layer]}
            />
        </Grid>
        </Grid>
        </div>      
    );
  }
}

export default App;
