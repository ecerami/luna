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
import NavigationPanel from "./components/NavigationPanel";
import DataSummaryPanel from "./components/DataSummaryPanel";
import LegendPanel from "./components/LegendPanel";
import ControlPanel from "./components/ControlPanel";
import axios from "axios";
import { LunaConfig } from "./utils/LunaConfig";
import { LunaData } from "./utils/LunaData";
import "./App.css";

@observer
class Luna extends React.Component<{}, {}> {
  @observable mapState!: MapState;
  @observable dataLoaded = false;
  lunaData?: LunaData;

  constructor(props: any) {
    super(props);
    this.getColorValue = this.getColorValue.bind(this);
    this.getColorList = this.getColorList.bind(this);
    this.getElevationValue = this.getElevationValue.bind(this);
  }

  componentDidMount() {
    //  Get the configuration file via axios
    axios({
      method: "get",
      url: "data/lunaConfig.json",
    })
      .then((res) => this.initLunaConfig(res.data))
      .catch((error) => console.log(error));

    //  Get the actual data via axios
    axios({
      method: "get",
      url: "data/lunaData.json",
    })
      .then((res) => this.initLunaData(res.data))
      .catch((error) => console.log(error));
  }

  /**
   * Init the Luna Config
   */
  initLunaConfig(json: any) {
    let lunaConfig: LunaConfig = json;
    this.mapState = new MapState(lunaConfig);
  }

  /**
   * Init the Luna Data
   */
  initLunaData(json: any) {
    this.lunaData = json;
    this.dataLoaded = true;
  }

  /**
   * Gets Color List, based on Current Vignette
   */
  getColorList() {
    return this.mapState.getColorListByFormat(MapState.RBA);
  }

  /**
   * Gets the Color Domain Max, based on the Current Vignette
   */
  getColorDomainMax() {
    if (this.mapState != null && this.mapState.vignetteHasBeenSelected()) {
        let currentVignette = this.mapState.getCurrentVignette();
        let colorBy = currentVignette.color_by;
        if (colorBy === MapState.GENE_EXPRESSION) {
          return this.mapState.getCurrentTargetGeneMaxExpression();
      }
    }
    return 0;
  }

  /**
   * Gets the Color Value for Set of Points.
   * Color is based on an average of expression values.
  */
  getColorValue(dataList: any) {
    if (this.mapState != null && this.mapState.vignetteHasBeenSelected()) {
        let targetGene = this.mapState.getCurrentTargetGene();
        if (targetGene != null) {
          let cell: LunaData = dataList[0];
          let geneIndex = this.getGeneIndex(cell, targetGene);
          let expressionAverage = 0.0;
          for (let i = 0; i < dataList.length; i++) {
            let cell: LunaData = dataList[i];
            expressionAverage += parseFloat(cell.genes[geneIndex].value);
          }
          return (
            this.mapState.getCurrentTargetGeneMaxExpression() -
            expressionAverage / dataList.length
          );
        }
    }
    return 0;
  }

  /**
   * Helper method to identify the gene index
   */
  private getGeneIndex(cell: LunaData, targetGene: string) {
    let geneIndex = -1;
    for (let i = 0; i < cell.genes.length; i++) {
      let gene = cell.genes[i];
      if (gene.gene === targetGene) {
        geneIndex = i;
      }
    }
    return geneIndex;
  }

  /**
   * Gets the Elevation Value for a Set of Points
   */
  getElevationValue(dataList: any) {
    let elevation = this.getColorValue(dataList);
    if (elevation > 0) {
      elevation = this.mapState.getCurrentTargetGeneMaxExpression() - elevation;
    }
    return elevation;
  }

  setTooltip(info: any, event: any) {
    let object = info.object;
    let x = info.x;
    let y = info.y;
    const el = document.getElementById("tooltip");
    if (el != null) {
      if (object) {
        //  TODO:  Replace with Pull-down menu Option?
        let clusterCounter = new ClusterCounter(
          info.object.points,
          "cell_ontology_class"
        );
        let rankedClusterList = clusterCounter.getClusterCountsRanked();
        let clusterHtml = "<table>";
        rankedClusterList.forEach((value) => {
          let clusterName = StringUtils.truncateOrPadString(value.clusterName);
          clusterHtml += "<tr>";
          clusterHtml += "<td>" + clusterName + "</td>";
          clusterHtml += "<td>N=" + value.numCells + "</td>";
          clusterHtml +=
            "<td>" + (100.0 * value.percentage).toFixed(0) + "%</td>";
          clusterHtml += "</tr>";
        });
        el.innerHTML = clusterHtml;
        el.style.display = "block";
        el.style.left = x + 100 + "px";
        el.style.top = y + 50 + "px";
      } else {
        el.style.display = "none";
      }
    }
  }

  render() {
    let data: any = this.lunaData;
    if (this.mapState != null && this.dataLoaded === true) {
      let colorList = this.getColorList();
      let colorDomainMax = this.getColorDomainMax();

      // Init the Deck.gl Hexagon Layer
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
        autoHighlight: true,
      });

      return (
        <div>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6">Luna: Single Cell Viewer</Typography>
            </Toolbar>
          </AppBar>
          <LegendPanel mapState={this.mapState} />
          <Grid container spacing={3}>
            <Grid id="left-column" item xs={3}>
              <div id="left-column-content">
                <DataSummaryPanel mapState={this.mapState} />
                <ControlPanel mapState={this.mapState} />
                <NavigationPanel />
                <div id="tooltip"></div>
              </div>
            </Grid>
            <Grid item xs={9}>
              <div id="map" />
              <DeckGL
                effects={[]}
                controller={true}
                initialViewState={this.mapState.viewState}
                layers={[layer]}
                width={"100%"}
                height={"100%"}
              />
            </Grid>
          </Grid>
        </div>
      );
    } else {
      return (
        <div>
          <img alt="loading" src="img/loading.gif"/>
        </div>);
    }
  }
}

export default Luna;
