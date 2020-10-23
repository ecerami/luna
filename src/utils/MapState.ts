/**
 * Encapsualates Map State.
 */
import { observable } from "mobx";
import axios from "axios";
import Luna from "../Luna";
let colormap = require("colormap");

class MapState {
  static HEX_BIN_RADIUS_DEFAULT = 7000;
  static ELEVATION_SCALE_DEFAULT = 200;
  static GENE_EXPRESSION = "gene_expression"
  static RBA = "rba"
  static COLOR_BLACK = "black"

  viewState: any;
  @observable hexBinRadius = MapState.HEX_BIN_RADIUS_DEFAULT;
  @observable elevationScale = MapState.ELEVATION_SCALE_DEFAULT;
  @observable checked3D = false;
  @observable clusterCategorySelected = "";
  @observable clusterNameSelected = "";
  @observable currentGeneText = "";
  @observable colorBySelected = "none";
  @observable selectedGene?:string = undefined;
  @observable geneList: Array<string> = [];
  geneExpressionValuesMap: Map<string, Array<number>> = new Map<string, Array<number>>();
  private geneExpressionMaxMap: Map<string, number> = new Map<string, number>();
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
    } else {
      this.selectedGene = colorBySelected;
      this.hexBinHack();
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
          nshades: 20,
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

  /**
   * Download Expression Data for Specified Gene.
   * @param gene Gene Symbol.
   * @param json JSON Content.
   */
  initExpressionData(gene: string, json: any) {
    console.log(json);
    this.geneExpressionValuesMap.set(gene, json["cells"]);
    this.geneExpressionMaxMap.set(gene, json["max_expression"])
    this.selectedGene = gene;
    this.geneList.push(gene);
    this.colorBySelected = gene;
    this.hexBinHack();
  }  
}

export default MapState;
