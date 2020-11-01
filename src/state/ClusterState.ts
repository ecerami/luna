/**
 * Encapsulates Cluster State.
*/
import { observable } from "mobx";
import axios from "axios";
import Luna from "../Luna";
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

  // The list of unique values for each cluster, sorted alphabetically;
  // indexed by Cluster Key
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

  // Quick Look up of Category Value to Color Index
  @observable categoryToColorIndex: Map <string, Map<string, number>> = 
    new Map<string, Map<string, number>>();

  // Show/Hide the Dialog Picker
  @observable showClusterDialogPicker = false;

  static OTHER_COLOR = "#bbbbbb";

  /**
   * Get the Color List.
   */
  getColorList() {
    let colorList = colorbrewer.Paired[9]
    let numColors = this.getNumColors();
    colorList = colorList.slice(0, numColors);

    // Add the default/other color
    // colorList.push(ClusterState.OTHER_COLOR);
    return colorList;
  }

  /**
   * Count Number of Colors, based on Number of Selected Categories.
   */
  getNumColors() {
    if (this.selectedClusterKey) {
      let categoryLookUp = this.categoryToColorIndex.get(this.selectedClusterKey);
      if (categoryLookUp) {
        return categoryLookUp.size;
      }
    }
    return 1;
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
    let colorLookUp = new Map<string, number>();
    this.categoryToColorIndex.set(clusterKey, colorLookUp);
    this.showClusterDialogPicker = true;
  }   
}

export default ClusterState;
