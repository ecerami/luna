import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import DeckGL from "@deck.gl/react";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import data from "./data/temp.json";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MapState from "./utils/MapState";
import ClusterCounter from "./utils/ClusterCounter";
import StringUtils from "./utils/StringUtils";
import NavigationPanel from "./components/NavigationPanel"
import SummaryPanel from "./components/SummaryPanel"
import ControlPanel from "./components/ControlPanel"

import "./App.css";

// Viewport settings
const viewState = {
  longitude: -0.4374792,
  latitude: 13.08756237717,
  zoom: 5,
  pitch: 0,
  bearing: 0,
};

@observer
class Luna extends React.Component<{},{}> {
  @observable mapState = new MapState();

  constructor(props: any) {
    super(props);
    this.getColorValue = this.getColorValue.bind(this);
  }

  // Hard-coded right now to show average expression of target gene
  getElevationValue(dataList: any) {
    let expressionAverage: number = 0.0;
    for (let i = 0; i < dataList.length; i++) {
      expressionAverage += parseFloat(dataList[i]["P2ry12"]);
    }
    return expressionAverage / dataList.length;
  }

  // Hard-coded right now to show two clusters
  getColorValue(dataList: any) {
    let target1Reached = false;
    let target2Reached = false;
    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i]["cell_ontology_class"] === "microglial cell") {
        target1Reached = true;
      } else if (dataList[i]["cell_ontology_class"] === "leukocyte") {
        target2Reached = true;
      }
    }
    if (target1Reached) {
      return 1;
    } else if (target2Reached) {
      return 2;
    } else {
      return 0;
    }
  }

  setTooltip(info: any, event: any) {
    // console.log("Info: ", info);
    // console.log("Event:  ", event);
    let object = info.object;
    let x = info.x;
    let y = info.y;
    const el = document.getElementById('tooltip');
    if (el != null) {
      if (object) {
        let clusterCounter = new ClusterCounter(info.object.points, "cell_ontology_class");
        let rankedClusterList = clusterCounter.getClusterCountsRanked();
        let clusterHtml = "<table>";
        rankedClusterList.forEach((value) => {
          let clusterName = StringUtils.truncateOrPadString(value.clusterName);
          clusterHtml += "<tr>";
          clusterHtml += "<td>" + clusterName + "</td>";
          clusterHtml += "<td>N=" + value.numCells + "</td>";
          clusterHtml += "<td>" + (100.0 * value.percentage).toFixed(0) + "%</td>";
          clusterHtml += "</tr>";
        });
        el.innerHTML = clusterHtml;
        el.style.display = 'block';
        el.style.left = (x + 100) + 'px';
        el.style.top = (y + 50) + 'px';
      } else {
        el.style.display = 'none';
      }
    }
  }  

  render() {
    const layer = new HexagonLayer({
      id: "column-layer",
      data,
      pickable: true,
      extruded: this.mapState.checked3D,
      radius: this.mapState.hexBinRadius,
      elevationScale: this.mapState.elevationScale,
      elevationDomain: [0, 10],
      getElevationValue: this.getElevationValue,
      getColorValue: this.getColorValue,
      colorDomain: [0, 2],
      colorRange: [
        [100, 100, 100],
        [55, 126, 184],
        [228, 26, 28],
      ],
      onHover: this.setTooltip,
    });

    return (
      <div ref={this.wrapper}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Luna: Single Cell Visualizer</Typography>
          </Toolbar>
        </AppBar>
        <Grid container spacing={3}>
          <Grid id="left-column" item xs={3}>
            <div id="left-column-content">
              <ControlPanel mapState={this.mapState}/>
              <SummaryPanel/>
              <NavigationPanel/>
              <div id="tooltip"></div>
            </div>
          </Grid>
          <Grid item xs={9}>
            <div id="map" />
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

export default Luna;