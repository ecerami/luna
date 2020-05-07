/**
 * Encapsualates Map State.
 */
import { observable, computed } from "mobx";
let colormap = require("colormap");

class MapState {
  static HEX_BIN_RADIUS_DEFAULT = 7000;
  static ELEVATION_SCALE_DEFAULT = 100;

  lunaConfig: any;
  @observable hexBinRadius = MapState.HEX_BIN_RADIUS_DEFAULT;
  @observable elevationScale = MapState.ELEVATION_SCALE_DEFAULT;
  @observable checked3D = false;
  @observable vignetteSelected = 0;

  constructor(config: any) {
    this.lunaConfig = config;
  }

  getCurrentTargetGene() {
    let currentVignette = this.lunaConfig["vignettes"][this.vignetteSelected];
    let colorBy = currentVignette["color_by"];
    if (colorBy === "gene_expression") {
      let targetGene = currentVignette["color_key"];
      return targetGene;
    }
  }

  getColorListByFormat(format: string) {
    let currentVignette = this.lunaConfig["vignettes"][this.vignetteSelected];
    let colorBy = currentVignette["color_by"];
    if (colorBy === "gene_expression") {
      let colorList = colormap({
        colormap: currentVignette["color_map"],
        nshades: 20,
        format: format,
        alpha: 1,
      });

      // Adjust alpha channel
      if (format === "rba") {
        for (let colorKey in colorList) {
          colorList[colorKey][3] = 255;
        }
      }
      return colorList;
    }
  }
}

export default MapState;
