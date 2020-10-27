/**
 * Encapsualates Map State.
 */
import { observable } from "mobx";
import axios from "axios";
import Luna from "../Luna";
let colormap = require("colormap");

class MapState {
  static HEX_BIN_RADIUS_DEFAULT = 10;
  static HEX_BIN_RADIUS_SCALE = 1000;
  static ELEVATION_SCALE_DEFAULT = 200;
  static GENE_EXPRESSION = "gene_expression"
  static RBA = "rba"
  static COLOR_BLACK = "black"

  viewState: any;
  @observable hexBinRadiusSliderValue = MapState.HEX_BIN_RADIUS_DEFAULT;
  @observable hexBinRadius = MapState.HEX_BIN_RADIUS_DEFAULT * MapState.HEX_BIN_RADIUS_SCALE;
  @observable elevationScale = MapState.ELEVATION_SCALE_DEFAULT;
  @observable checked3D = false;
  @observable clusterList: Array<string> = new Array<string>();
  @observable currentGeneText = "";
  @observable colorBySelected = "none";
  @observable selectedGene?:string = undefined;
  @observable selectedCluster?:string = undefined;
  @observable geneList: Array<string> = [];
  @observable geneExpressionValuesMap: Map<string, Array<number>> = new Map<string, Array<number>>();
  private geneExpressionMaxMap: Map<string, number> = new Map<string, number>();
  private clusterValuesMap: Map<string, Array<string>> = new Map<string, Array<string>>();
  @observable clusterCategoriesMap: Map<string, Array<string>> = new Map<string, Array<string>>();
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
   * Add a new gene to the state.
   * @param gene
   */
  addGene(gene: string) {
    if (this.geneList.includes(gene)) {
      this.colorBySelected = gene;
      this.selectedGene = gene;
      this.hexBinHack();  
    } else {
      this.loadExpressionData(gene);
    }
  }

  /**
   * Update the Color Section.
   * @param colorBySelected Color Selected Option.
   */
  setColorBySelected(colorBySelected: string) {
    this.colorBySelected = colorBySelected;
    if (colorBySelected === "none") {
      this.selectedGene = undefined;
    } else if (colorBySelected.startsWith("gene_")) {
      colorBySelected = colorBySelected.replace("gene_", "")
      this.selectedGene = colorBySelected;
      this.hexBinHack();
    } else {
      this.selectedGene = undefined;
      colorBySelected = colorBySelected.replace("cluster_", "")
      this.selectedCluster = colorBySelected;
      if (! this.clusterValuesMap.has(colorBySelected)) {
        this.loadClusterData(colorBySelected);
      } else {
        this.hexBinHack();
      }
    }
  }

  /**
   * Get the Max Expression of the Currently Selected Gene.
   */
  getSelectedGeneMaxExpression(): number {
    if (this.selectedGene !== undefined) {
      let maxExpression = this.geneExpressionMaxMap.get(this.selectedGene)
      if (maxExpression === undefined) {
        return 0.0
      } else {
        return maxExpression;
      }
    } else {
      return 0.0
    }
  }

  /**
   * Get the Color List.
   * @param format Color Format.
   */
  getColorListByFormat(format: string) {
    if (this.selectedGene !== undefined) {
        let colorList = colormap({
          colormap: "density",
          nshades: 10,
          format: format,
          alpha: 1,
        });

        // Adjust alpha channel
        if (format === MapState.RBA) {
          for (let colorKey in colorList) {
            colorList[colorKey][3] = 255;
          }
        }
        return colorList;
    } else if (this.selectedCluster !== undefined) {
      let clusterCategory = this.clusterCategoriesMap.get(this.selectedCluster);
      if (clusterCategory !== undefined) {
        let colorList = colormap({
          colormap: "jet",
          nshades: clusterCategory.length,
          format: format,
          alpha: 1,
        });

        // Adjust alpha channel
        if (format === MapState.RBA) {
          for (let colorKey in colorList) {
            colorList[colorKey][3] = 255;
          }
        }
        return colorList;
      } else {
        return [MapState.COLOR_BLACK];  
      }
    } else {
      return [MapState.COLOR_BLACK];
    }
  }

  /**
   * HexBin Hack to Force Re-coloring of Deck.gl.
   */
  private hexBinHack() {
    this.hexBinRadius = this.hexBinRadius + this.flipBit;
    this.flipBit = this.flipBit * -1;
  }

  loadExpressionData(gene: string) {
    let geneURL = Luna.BASE_URL + "/expression/" + gene + ".json"
    axios({
      method: "get",
      url: geneURL,
    })
      .then((res) => this.initExpressionData(gene, res.data))
      .catch((error) => console.log(error));
  }  

  loadClusterData(clusterKey: string) {
    let geneURL = Luna.BASE_URL + "/clusters/" + clusterKey + ".json"
    axios({
      method: "get",
      url: geneURL,
    })
      .then((res) => this.initClusterData(clusterKey, res.data))
      .catch((error) => console.log(error));
  }  

  /**
   * Init Expression Data for Specified Gene.
   * @param gene Gene Symbol.
   * @param json JSON Content.
   */
  initExpressionData(gene: string, json: any) {
    this.geneExpressionMaxMap.set(gene, json["max_expression"])
    this.geneExpressionValuesMap.set(gene, json["ordered_values"]);
    this.selectedGene = gene;
    this.geneList.push(gene);
    this.colorBySelected = "gene_" + gene;
    this.hexBinHack();
  }  

  /**
   * Init Cluster Data for Specified Cluster.
   * @param gene Gene Symbol.
   * @param json JSON Content.
   */
  initClusterData(clusterKey: string, json: any) {
    this.clusterCategoriesMap.set(clusterKey, json["unique_sorted"])
    this.clusterValuesMap.set(clusterKey, json["ordered_values"]);
    this.hexBinHack();
  }   
}

export default MapState;
