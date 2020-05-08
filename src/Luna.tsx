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
import DataSummaryPanel from "./components/DataSummaryPanel"
import LegendPanel from "./components/LegendPanel"
import ControlPanel from "./components/ControlPanel"
import configInit from "./data/lunaConfig.json";
import data from "./data/lunaData.json";
import "./App.css";

@observer
class Luna extends React.Component<{},{}> {
  @observable mapState = new MapState(configInit);

  constructor(props: any) {
    super(props);
    this.getColorValue = this.getColorValue.bind(this);
    this.getColorList = this.getColorList.bind(this);
    this.getElevationValue = this.getElevationValue.bind(this);
  }

  /**
   * Gets Color List, based on Current Vignette
   */
  getColorList() {
    return this.mapState.getColorListByFormat("rba")
  }

  getColorDomainMax() {
    if (this.mapState.vignetteHasBeenSelected()) {
      let currentVignette = this.mapState.lunaConfig["vignettes"][this.mapState.getVignetteSelected()];
      let colorBy = currentVignette["color_by"];
      if (colorBy === "gene_expression") {
        let targetGene = currentVignette["color_key"]
        let maxExpressionMap: any = this.mapState.lunaConfig["expression_max"]
        return maxExpressionMap[targetGene];
      }
    } else {
      return 0;
    }
  }

  /**
   * Gets the Color Value for Set of Points
   */
  getColorValue(dataList: any) {
    if (this.mapState.vignetteHasBeenSelected()) {
      let targetGene = this.mapState.getCurrentTargetGene();
      let expressionAverage = 0.0;
      for (let i = 0; i < dataList.length; i++) {
        expressionAverage += parseFloat(dataList[i][targetGene]);
      }
      let maxExpressionMap: any = this.mapState.lunaConfig["expression_max"]
      return maxExpressionMap[targetGene] - (expressionAverage / dataList.length);
    } else {
      return 0;
    }
  }

  /**
   * Gets the Elevation Value for a Set of Points
   */
  getElevationValue(dataList: any) {
    let elevation = this.getColorValue(dataList);
    if (elevation >0) {
      let targetGene = this.mapState.getCurrentTargetGene();
      let maxExpressionMap: any = this.mapState.lunaConfig["expression_max"]
      elevation = maxExpressionMap[targetGene] - elevation;
    }
    return elevation;
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
      elevationDomain: [0, colorDomainMax + 1],
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
        <LegendPanel mapState={this.mapState}/>
        <Grid container spacing={3}>
          <Grid id="left-column" item xs={3}>
            <div id="left-column-content">
              <DataSummaryPanel mapState={this.mapState}/>
              <ControlPanel mapState={this.mapState}/>
              <NavigationPanel/>
              <div id="tooltip"></div>
            </div>
          </Grid>
          <Grid item xs={9}>
            <div id="map" />
            <DeckGL
              controller={true}
              initialViewState={this.mapState.viewState}
              layers={[layer]}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Luna;