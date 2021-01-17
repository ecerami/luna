import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import Grid from "@material-ui/core/Grid";
import LunaState from "../state/LunaState";
import HexMapPanel from "./HexMapPanel";
import NavigationPanel from "./NavigationPanel";
import CategoryPicker from "./CategoryPicker";
import DataSummaryPanel from "./GenePanel";
import LegendPanel from "./LegendPanel";
import ControlPanel from "./ViewPanel";
import axios from "axios";
import { Coordinate } from "../utils/LunaData";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router-dom";
import queryString from "query-string";

type TParams = {
  bucket_slug: string;
  gene_symbol: string;
  vignette_slug: string;
};

/**
 * Core Luna UI.
 */
@observer
class Luna extends React.Component<RouteComponentProps<TParams>> {
  lunaState: LunaState = new LunaState();
  @observable dataLoaded = false;

  /**
   * Gets the Initial Luna Data via Web API.
   */
  componentDidMount(): void {
    this.lunaState.bucketSlug = this.props.match.params.bucket_slug;
    axios({
      method: "get",
      url: LunaState.BASE_SERVER_URL + "/umap/" + this.lunaState.bucketSlug,
    })
      .then((res) => this.initLunaData(res.data))
      .catch(() => alert("Failed to load umap coordinates."));
  }

  /**
   * Inits the Luna UMap Data.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initLunaData(json: any): void {
    const coordList: Array<Coordinate> = new Array<Coordinate>();
    let index = 0;
    for (const item of json) {
      const currentCoord: Coordinate = {
        position: [item.x, item.y],
        indexId: index++,
      };
      coordList.push(currentCoord);
    }
    this.lunaState.mapData = coordList;
    axios({
      method: "get",
      url:
        LunaState.BASE_SERVER_URL +
        "/annotation_list/" +
        this.lunaState.bucketSlug,
    })
      .then((res) => this.initAnnotationList(res.data))
      .catch(() => alert("Failed to load annotation list."));
  }

  /**
   * Inits Annotation List
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async initAnnotationList(json: any): Promise<any> {
    this.lunaState.annotationState.annotationList = json;

    const vignetteSlug = this.props.match.params.vignette_slug;
    console.log("Vignette Slug:  " + vignetteSlug);

    const gene = this.props.match.params.gene_symbol;
    if (gene !== undefined) {
      await this.lunaState.geneState.addGene(gene);
    }
    const params = queryString.parse(this.props.location.search);
    if (params.hex_bin_radius) {
      console.log("Setting hexbin:  " + params.hex_bin_radius);
      this.lunaState.hexBinRadiusSliderValue = Number(params.hex_bin_radius);
      this.lunaState.hexBinRadius =
        this.lunaState.hexBinRadiusSliderValue * LunaState.HEX_BIN_RADIUS_SCALE;
    }
    if (params.elevation_by) {
      console.log("Setting elevation by:  " + params.elevation_by);
      this.lunaState.checked3D = true;
      this.lunaState.elevationBySelected = String(params.elevation_by);
    }
    if (params.elevation_scale) {
      console.log("Setting elevation scale:  " + params.elevation_scale);
      this.lunaState.elevationScale = Number(params.elevation_scale);
    }
    if (params.color_by) {
      let activeList = Array<string>();
      console.log("Setting color by:  " + params.color_by);
      if (params.active) {
        const active = String(params.active);
        activeList = active.split(",");
      }
      const colorBy = "cluster_" + String(params.color_by);
      this.lunaState.setColorBySelectedWithActive(colorBy, activeList);
    }
    this.dataLoaded = true;
  }

  /**
   * Renders core Luna Interface.
   */
  render(): JSX.Element {
    if (this.dataLoaded === true) {
      return (
        <div>
          <CategoryPicker lunaState={this.lunaState} />
          <Grid container spacing={3}>
            <Grid id="left-column" item xs={3}>
              <div id="left-column-content">
                <DataSummaryPanel lunaState={this.lunaState} />
                <ControlPanel lunaState={this.lunaState} />
                <LegendPanel lunaState={this.lunaState} />
                <NavigationPanel />
                <div id="tooltip"></div>
              </div>
            </Grid>
            <Grid item xs={9}>
              <div id="map" />
              <HexMapPanel lunaState={this.lunaState} />
            </Grid>
          </Grid>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <img alt="loading" src="/img/loading.gif" />
        </div>
      );
    }
  }
}

export default withRouter(Luna);
