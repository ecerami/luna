/**
 * Encapsulates Gene State.
 */
import { observable } from "mobx";
import axios from "axios";
import Luna from "../Luna";
import LunaState from "./LunaState";

class GeneState {
  private lunaState: LunaState;
  @observable selectedGene?: string = undefined;
  @observable geneList: Array<string> = [];
  @observable geneExpressionValuesMap: Map<string, Array<number>> = new Map<
    string,
    Array<number>
  >();
  private geneExpressionMaxMap: Map<string, number> = new Map<string, number>();

  constructor(lunaState: LunaState) {
    this.lunaState = lunaState;
  }

  /**
   * Adds a new gene to the state.
   * @param gene
   */
  addGene(gene: string) {
    if (this.geneList.includes(gene)) {
      this.lunaState.colorBySelected = gene;
      this.selectedGene = gene;
      this.lunaState.hexBinHack();
    } else {
      this.loadExpressionData(gene);
    }
  }

  /**
   * Gets the Max Expression of the Currently Selected Gene.
   */
  getSelectedGeneMaxExpression(): number {
    if (this.selectedGene) {
      let maxExpression = this.geneExpressionMaxMap.get(this.selectedGene);
      if (maxExpression === undefined) {
        return 0.0;
      } else {
        return maxExpression;
      }
    } else {
      return 0.0;
    }
  }

  /**
   * Loads Expression Data for Specified Gene.
   * @param gene Gene Symbol.
   */
  loadExpressionData(gene: string) {
    let geneURL = Luna.BASE_SERVER_URL + "/expression/" + Luna.BUCKET_ID + "/" + gene;
    axios({
      method: "get",
      url: geneURL,
    })
      .then((res) => this.initExpressionData(gene, res.data))
      .catch((error) => console.log(error));
  }

  /**
   * Inits Expression Data for Specified Gene.
   * @param gene Gene Symbol.
   * @param json JSON Content.
   */
  initExpressionData(gene: string, json: any) {
    this.geneExpressionMaxMap.set(gene, json["max_expression"]);
    this.geneExpressionValuesMap.set(gene, json["values_ordered"]);
    this.selectedGene = gene;
    this.geneList.push(gene);
    this.lunaState.colorBySelected = "gene_" + gene;
    this.lunaState.hexBinHack();
  }
}

export default GeneState;
