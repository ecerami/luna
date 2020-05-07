import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import DeckGL from "@deck.gl/react";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MapState from "./utils/MapState";
import ClusterCounter from "./utils/ClusterCounter";
import StringUtils from "./utils/StringUtils";
import NavigationPanel from "./components/NavigationPanel"
import SummaryPanel from "./components/SummaryPanel"
import DataSummaryPanel from "./components/DataSummaryPanel"
import ControlPanel from "./components/ControlPanel"
import config from "./data/lunaConfig.json";
import data from "./data/lunaData.json";

import "./App.css";
let colormap = require('colormap')

@observer
class Luna extends React.Component<{},{}> {
  @observable mapState = new MapState();
  lunaConfig = config;

  viewState = {
    longitude: config["center_x"],
    latitude: config["center_y"],
    zoom: config["default_zoom"],
    pitch: 0,
    bearing: 0,
  };

  constructor(props: any) {
    super(props);
    this.getColorValue = this.getColorValue.bind(this);
    this.getColorList = this.getColorList.bind(this);
  }

  /**
   * Gets Color List, based on Current Vignette
   */
  getColorList() {
    let currentVignette = this.lunaConfig["vignettes"][this.mapState.vignetteSelected];
    let colorBy = currentVignette["color_by"];
    if (colorBy === "gene_expression") {
      let colorList = colormap({
        colormap: currentVignette["color_map"],
        nshades: 20,
        format: 'rba',
        alpha: 1
      })
      // Adjust alpha channel
      for (let colorKey in colorList) {
        colorList[colorKey][3] = 255;
      }
      return colorList;
    }
  }

  getColorDomainMax() {
    let currentVignette = this.lunaConfig["vignettes"][this.mapState.vignetteSelected];
    let colorBy = currentVignette["color_by"];
    if (colorBy === "gene_expression") {
      let targetGene = currentVignette["color_key"]
      let maxExpressionMap: any = this.lunaConfig["expression_max"]
      return maxExpressionMap[targetGene];
    }
  }

  /**
   * Gets the Color Value for Set of Points
   */
  getColorValue(dataList: any) {
    let currentVignette = this.lunaConfig["vignettes"][this.mapState.vignetteSelected];
    let targetGene = currentVignette["color_key"]
    let expressionAverage = 0.0;
    for (let i = 0; i < dataList.length; i++) {
      expressionAverage += parseFloat(dataList[i][targetGene]);
    }
    let maxExpressionMap: any = this.lunaConfig["expression_max"]
    return maxExpressionMap[targetGene] - (expressionAverage / dataList.length);
  }

  /**
   * Gets the Elevation Value for a Set of Points
   */
  getElevationValue(dataList: any) {
    let expressionAverage: number = 0.0;
    for (let i = 0; i < dataList.length; i++) {
      // TODO:  Replace with Utility to Identify Target Gene
      expressionAverage += parseFloat(dataList[i]["P2ry12"]);
    }
    return expressionAverage / dataList.length;
  }

  setTooltip(info: any, event: any) {
    let object = info.object;
    let x = info.x;
    let y = info.y;
    const el = document.getElementById('tooltip');
    if (el != null) {
      if (object) {
        //  TODO:  Replace with Pull-down menu Option?
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
    let colorList = this.getColorList();
    let colorDomainMax = this.getColorDomainMax();
    const layer = new HexagonLayer({
      id: "column-layer",
      data,
      pickable: true,
      extruded: this.mapState.checked3D,
      radius: this.mapState.hexBinRadius,
      elevationScale: this.mapState.elevationScale,
      // TODO:  MAKE DYNAMIC
      elevationDomain: [0, 10],
      getElevationValue: this.getElevationValue,
      getColorValue: this.getColorValue,
      colorDomain: [0, colorDomainMax],
      colorRange: colorList,
      onHover: this.setTooltip,
    });

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Luna: Single Cell Visualizer</Typography>
          </Toolbar>
        </AppBar>
        <Grid container spacing={3}>
          <Grid id="left-column" item xs={3}>
            <div id="left-column-content">
              <DataSummaryPanel mapState={this.mapState}/>
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
              initialViewState={this.viewState}
              layers={[layer]}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Luna;