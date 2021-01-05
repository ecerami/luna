/**
 * Encapsulates Gene State.
 */
import { observable } from "mobx";
import axios from "axios";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async addGene(gene: string): Promise<any> {
    if (this.geneList.includes(gene)) {
      this.lunaState.colorBySelected = gene;
      this.selectedGene = gene;
      this.lunaState.hexBinHack();
    } else {
      await this.loadExpressionData(gene);
    }
  }

  /**
   * Gets the Max Expression of the Currently Selected Gene.
   */
  getSelectedGeneMaxExpression(): number {
    if (this.selectedGene) {
      const maxExpression = this.geneExpressionMaxMap.get(this.selectedGene);
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async loadExpressionData(gene: string): Promise<any> {
    const geneURL =
      LunaState.BASE_SERVER_URL +
      "/expression/" +
      this.lunaState.bucketSlug +
      "/" +
      gene;
    await axios({
      method: "get",
      url: geneURL,
    })
      .then((res) => this.initExpressionData(gene, res.data))
      .catch(() =>
        alert("Could not load gene.  Check the gene symbol and try again!")
      );
  }

  /**
   * Inits Expression Data for Specified Gene.
   * @param gene Gene Symbol.
   * @param json JSON Content.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initExpressionData(gene: string, json: any): void {
    console.log("Init Expression data for:  " + gene);
    this.geneExpressionMaxMap.set(gene, json["max_expression"]);
    this.geneExpressionValuesMap.set(gene, json["values_ordered"]);
    this.selectedGene = gene;
    this.geneList.push(gene);
    this.lunaState.colorBySelected = "gene_" + gene;
    this.lunaState.hexBinHack();
  }
}

export default GeneState;
