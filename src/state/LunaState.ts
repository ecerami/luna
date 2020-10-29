/**
 * Encapsualates Luna State.
*/
import { observable } from "mobx";
import ClusterState from "./ClusterState";
import GeneState from "./GeneState";
let colormap = require("colormap");

class LunaState {
  static HEX_BIN_RADIUS_DEFAULT = 10;
  static HEX_BIN_RADIUS_SCALE = 1000;
  static ELEVATION_SCALE_DEFAULT = 200;
  static GENE_EXPRESSION = "gene_expression"
  static RBA = "rba"
  static COLOR_BLACK = "black"

  viewState: any;
  @observable clusterState: ClusterState = new ClusterState();
  @observable geneState: GeneState = new GeneState(this);
  @observable hexBinRadiusSliderValue = LunaState.HEX_BIN_RADIUS_DEFAULT;
  @observable hexBinRadius = LunaState.HEX_BIN_RADIUS_DEFAULT * LunaState.HEX_BIN_RADIUS_SCALE;
  @observable elevationScale = LunaState.ELEVATION_SCALE_DEFAULT;
  @observable checked3D = false;
  @observable currentGeneText = "";
  @observable colorBySelected = "none";
  private flipBit = 1;

  constructor() {
    this.viewState = {
      longitude: 0,
      latitude: 0,
      zoom: 4,
      pitch: 0,
      bearing: 0,
      transitionDuration: 0,
      transitionInterpolator: null,
    };
  }

  /**
   * Update the Color Section.
   * @param colorBySelected Color Selected Option.
   */
  setColorBySelected(colorBySelected: string) {
    this.colorBySelected = colorBySelected;
    if (colorBySelected === "none") {
      this.geneState.selectedGene = undefined;
      this.clusterState.selectedClusterKey = undefined;
    } else if (colorBySelected.startsWith("gene_")) {
      colorBySelected = colorBySelected.replace("gene_", "")
      this.geneState.selectedGene = colorBySelected;
      this.clusterState.selectedClusterKey = undefined;
      this.hexBinHack();
    } else {
      this.geneState.selectedGene = undefined;
      colorBySelected = colorBySelected.replace("cluster_", "")
      this.clusterState.selectedClusterKey = colorBySelected;
      if (! this.clusterState.clusterValuesMap.has(colorBySelected)) {
        this.clusterState.loadClusterData(colorBySelected);
      } else {
        this.hexBinHack();
      }
    }
  }

  /**
   * Get the Color List.
   * @param format Color Format.
   */
  getColorListByFormat(format: string) {
    if (this.geneState.selectedGene) {
        let colorList = colormap({
          colormap: "density",
          nshades: 10,
          format: format,
          alpha: 1,
        });

        // Adjust alpha channel
        if (format === LunaState.RBA) {
          for (let colorKey in colorList) {
            colorList[colorKey][3] = 255;
          }
        }
        return colorList;
    } else if (this.clusterState.selectedClusterKey !== undefined) {
        return [LunaState.COLOR_BLACK];  
    } else {
      return [LunaState.COLOR_BLACK];
    }
  }

  /**
   * HexBin Hack to Force Re-coloring of Deck.gl.
   */
  hexBinHack() {
    this.hexBinRadius = this.hexBinRadius + this.flipBit;
    this.flipBit = this.flipBit * -1;
  }
}

export default LunaState;
