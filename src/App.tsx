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
import Slider from "@material-ui/core/Slider";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ClusterCounter from "./utils/ClusterCounter";
import StringUtils from "./utils/StringUtils";

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
class App extends React.Component {
  HEX_BIN_RADIUS_DEFAULT = 7000;
  ELEVATION_SCALE_DEFAULT = 100;

  @observable hexBinRadius = this.HEX_BIN_RADIUS_DEFAULT;
  @observable elevationScale = this.ELEVATION_SCALE_DEFAULT;
  @observable checked3D = false;

  constructor() {
    super({});
    this.handleRadiusChange = this.handleRadiusChange.bind(this);
    this.handleElevationChange = this.handleElevationChange.bind(this);
    this.getColorValue = this.getColorValue.bind(this);
    this.handle3DChange = this.handle3DChange.bind(this);
  }

  handleRadiusChange(event: any, newValue: any) {
    this.hexBinRadius = newValue;
  }

  handleElevationChange(event: any, newValue: any) {
    this.elevationScale = newValue;
  }

  handle3DChange(event: any, newValue: any) {
    this.checked3D = newValue;
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
    console.log("Info: ", info);
    console.log("Event:  ", event);
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
    let controlPanel = this.getControlPanel();
    let summaryPanel = this.getSummaryPanel();
    let navigationPanel = this.getNavigationPanel();

    const layer = new HexagonLayer({
      id: "column-layer",
      data,
      pickable: true,
      extruded: this.checked3D,
      radius: this.hexBinRadius,
      elevationScale: this.elevationScale,
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
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Luna: Single Cell Visualizer</Typography>
          </Toolbar>
        </AppBar>
        <Grid container spacing={3}>
          <Grid id="left-column" item xs={3}>
            <div id="left-column-content">
              {controlPanel}
              {summaryPanel}
              {navigationPanel}
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

  getControlPanel() {
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Controls</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className="control">
            <Typography>Hex Bin radius:</Typography>
            <Slider
              onChange={this.handleRadiusChange}
              defaultValue={this.HEX_BIN_RADIUS_DEFAULT}
              min={0}
              max={30000}
              step={500}
              valueLabelDisplay="auto"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={this.checked3D}
                  onChange={this.handle3DChange}
                  name="checked3d"
                  color="primary"
                />
              }
              label="3D Mode"
            />
            <Typography>Elevation Scale:</Typography>
            <Slider
              onChange={this.handleElevationChange}
              defaultValue={this.ELEVATION_SCALE_DEFAULT}
              disabled={!this.checked3D}
              min={1}
              max={1000}
              step={1}
              valueLabelDisplay="auto"
            />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

  getSummaryPanel() {
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>What am I looking at?</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className="control">
            You are looking at single cell RNASeq data from a mouse. Each
            hexagon represents a group of cells that have been clustered via
            U-Map.
            <p/>
            Only three clusters are highlighted:
            <br />
            <div className="cluster2">microglial cell</div>
            <div className="cluster3">leukocyte</div>
            <div className="cluster1">all other</div>
            <br />
            This map also only includes the expression of a single gene, P2ry12.
            <br />
            <br />
            If you enable 3D Mode, expression of P2ry12 is denoted as
            elevation, and you can quickly confirm that microglial cells and
            leukocytes have increased expression of P2ry12.
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

  getNavigationPanel() {
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>How do I navigate?</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className="control">
            You navigate the map with your mouse.
            <ul>
              <li>Scroll to zoom in/out.</li>
              <li>Click + Drag to Pan</li>
              <li>Option + Drag to Change Perspective</li>
            </ul>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default App;
