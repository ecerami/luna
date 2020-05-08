/**
 * Encapsualates Map State.
 */
import { observable } from "mobx";
import { FlyToInterpolator } from "@deck.gl/core";
let colormap = require("colormap");

class MapState {
  static HEX_BIN_RADIUS_DEFAULT = 7000;
  static ELEVATION_SCALE_DEFAULT = 200;

  lunaConfig: any;
  viewState: any;
  @observable hexBinRadius = MapState.HEX_BIN_RADIUS_DEFAULT;
  @observable elevationScale = MapState.ELEVATION_SCALE_DEFAULT;
  @observable checked3D = false;
  @observable private vignetteSelected = -1;

  constructor(config: any) {
    this.lunaConfig = config;
    this.viewState = {
      longitude: this.lunaConfig["center_x"],
      latitude: this.lunaConfig["center_y"],
      zoom: this.lunaConfig["default_zoom"],
      pitch: 0,
      bearing: 0,
      transitionDuration: 0,
      transitionInterpolator: null,
    };
  }

  vignetteHasBeenSelected() {
    if (this.vignetteSelected > -1) {
      return true;
    } else {
      return false;
    }
  }

  getVignetteSelected() {
    return this.vignetteSelected;
  }

  setVignetteSelected(index: number) {
    this.vignetteSelected = index;
    this.flyToNewLocation()
  }

  getCurrentTargetGene() {
    if (this.vignetteHasBeenSelected()) {
      let currentVignette = this.getCurrentVignette();
      let colorBy = currentVignette["color_by"];
      if (colorBy === "gene_expression") {
        let targetGene = currentVignette["color_key"];
        return targetGene;
      }
    }
  }

  getCurrentTargetGeneMaxExpression() {
    if (this.vignetteHasBeenSelected()) {
      let maxExpressionMap: any = this.lunaConfig["expression_max"];
      let targetGene = this.getCurrentTargetGene();
      if (targetGene !== undefined) {
        return maxExpressionMap[targetGene];
      }
    }
  }

  getColorListByFormat(format: string) {
    if (this.vignetteHasBeenSelected()) {
      let currentVignette = this.getCurrentVignette();
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
    } else {
      return ["black"];
    }
  }

  getCurrentVignette() {
    return this.lunaConfig["vignettes"][this.vignetteSelected];
  }

  flyToNewLocation() {
    let center_x = this.lunaConfig["center_x"];
    let center_y = this.lunaConfig["center_y"];
    let zoom = this.lunaConfig["default_zoom"];
    let pitch = 0;
    this.elevationScale = MapState.ELEVATION_SCALE_DEFAULT;
    this.checked3D = false;
    if (this.vignetteHasBeenSelected()) {
        let currentVignette = this.getCurrentVignette();
        if (currentVignette["center_x"]) {
            center_x = currentVignette["center_x"]
        }
        if (currentVignette["center_y"]) {
            center_y = currentVignette["center_y"]
        }
        if (currentVignette["zoom"]) {
            zoom = currentVignette["zoom"]
        }
        if (currentVignette["pitch"]) {
            pitch = currentVignette["pitch"]
        }
        if (currentVignette["3d"]) {
            this.checked3D = currentVignette["3d"]
        }
        if (currentVignette["hex_bin_size"]) {
            this.hexBinRadius = currentVignette["hex_bin_size"]
        }
        if (currentVignette["elevation_scale"]) {
            this.elevationScale = currentVignette["elevation_scale"]
        }        
    }
    this.viewState = {
        ...this.viewState,
        longitude: center_x,
        latitude: center_y,
        zoom: zoom,
        pitch: pitch,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator(),
    };
    this.hexBinRadius = this.hexBinRadius + 1;
  }
}

export default MapState;
