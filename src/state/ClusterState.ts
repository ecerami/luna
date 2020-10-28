/**
 * Encapsualates Cluster State.
 */
import { observable } from "mobx";
import axios from "axios";
import Luna from "../Luna";
import LunaState from "../state/LunaState";
let colormap = require("colormap");
const colorbrewer = require('colorbrewer');

class ClusterState {
  // List of all clusters
  @observable clusterList: Array<string> = new Array<string>();

  // Stores Cluster Values for all Cells, Indexed by Cluster Key
  clusterValuesMap: Map<string, Array<string>> = new Map<
    string,
    Array<string>
  >();

  // The currently selected cluster
  @observable selectedClusterKey?: string = undefined;

  // The list of unique values for each cluster, sorted alphabetically;  indexed by Cluster Key
  @observable uniqueCategoriesMap: Map<string, Array<string>> = new Map<
    string,
    Array<string>
  >();

  // The list of unique values for each cluster, sorted alphabetically;
  // value = true:  selected
  // value = false;  not selected
  // indexed by Cluster Key
  @observable uniqueCategoriesSelectedMap: Map<
    string,
    Array<boolean>
  > = new Map<string, Array<boolean>>();

  // Show/Hide the Dialog Picker
  @observable showClusterDialogPicker = false;

  /**
   * Get the Color List.
   * @param format Color Format.
   */
  getColorListByFormat(format: string) {
    return colorbrewer.Paired[12]
  }

  /**
   * Count Number of Colors, based on Number of Selected Categories.
   */
  countColors() {
    let numColors = 0;
    if (this.uniqueCategoriesSelectedMap && this.selectedClusterKey) {
      let selectedList = this.uniqueCategoriesSelectedMap.get(this.selectedClusterKey)
      if (selectedList) {
        for (let selectedCategory of selectedList) {
          if (selectedCategory === true) {
            numColors +=1;
          }
        }
      }
    }
    return numColors;
  }

  /**
   * Load Data for Specified Cluster.
   * @param clusterKey Cluster Key.
   */
  loadClusterData(clusterKey: string) {
    let geneURL = Luna.BASE_URL + "/clusters/" + clusterKey + ".json";
    axios({
      method: "get",
      url: geneURL,
    })
      .then((res) => this.initClusterData(clusterKey, res.data))
      .catch((error) => console.log(error));
  }

  /**
   * Init Cluster Data for Specified Cluster.
   * @param gene Gene Symbol.
   * @param json JSON Content.
   */
  initClusterData(clusterKey: string, json: any) {
    this.uniqueCategoriesMap.set(clusterKey, json["unique_sorted"])
    let selectedList = new Array<boolean>();
    for (let i=0; i< json["unique_sorted"].length; i++) {
      selectedList.push(false);
    }
    this.uniqueCategoriesSelectedMap.set(clusterKey, selectedList);
    this.clusterValuesMap.set(clusterKey, json["ordered_values"]);
    this.showClusterDialogPicker = true;
  }   
}

export default ClusterState;
