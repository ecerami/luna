/**
 * Encapsualates Luna State.
 */
import { observable } from "mobx";
import axios from "axios";
import AnnotationState from "./AnnotationState";
import GeneState from "./GeneState";
import ColorUtil from "../utils/ColorUtil";
import { Coordinate } from "../utils/LunaData";
import colorbrewer from "colorbrewer";
import BucketState from "./BucketState";
import { Bucket } from "../utils/LunaData";
import { Vignette } from "../utils/LunaData";

class LunaState {
  private static instance: LunaState;

  static BASE_SERVER_URL = "http://127.0.0.1:8000";
  //static BASE_SERVER_URL = "http://66.175.211.220:8000";

  static HEX_BIN_RADIUS_DEFAULT = 10;
  static HEX_BIN_RADIUS_SCALE = 1000;
  static ELEVATION_SCALE_DEFAULT = 200;
  static GENE_EXPRESSION = "gene_expression";
  static RBA = "rba";
  static COLOR_BLACK = "black";
  static NONE = "none";
  blues = [...colorbrewer.Blues[6]].reverse();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  viewState: any;

  bucketSlug: string | undefined;
  mapData?: Array<Coordinate>;
  @observable annotationState: AnnotationState = new AnnotationState(this);
  @observable geneState: GeneState = new GeneState(this);
  @observable hexBinRadiusSliderValue = LunaState.HEX_BIN_RADIUS_DEFAULT;
  @observable hexBinRadius =
    LunaState.HEX_BIN_RADIUS_DEFAULT * LunaState.HEX_BIN_RADIUS_SCALE;
  @observable elevationScale = LunaState.ELEVATION_SCALE_DEFAULT;
  @observable checked3D = false;
  @observable currentGeneText = "";
  @observable colorBySelected = LunaState.NONE;
  @observable elevationBySelected = LunaState.NONE;
  bucketState: BucketState = new BucketState();
  private flipBit = 1;
  @observable vignettesLoaded = false;

  /**
   * Gets the Singleton Instance.
   */
  public static getInstance(): LunaState {
    if (!LunaState.instance) {
      LunaState.instance = new LunaState();
    }
    return LunaState.instance;
  }

  /**
   * Constructor with Initial View State.
   */
  private constructor() {
    this.viewState = {
      longitude: 0,
      latitude: 0,
      zoom: 4,
      pitch: 10,
      bearing: 0,
      transitionDuration: 0,
      transitionInterpolator: null,
    };
    this.getAllBuckets();
  }

  /**
   * Updates the Color Section.
   * @param colorBySelected Color Selected Option.
   */
  setColorBySelected(colorBySelected: string): void {
    this.colorBySelected = colorBySelected;
    if (colorBySelected === "none") {
      this.geneState.selectedGene = undefined;
      this.annotationState.selectedAnnotationSlug = undefined;
      this.hexBinHack();
    } else if (colorBySelected.startsWith("gene_")) {
      colorBySelected = colorBySelected.replace("gene_", "");
      this.geneState.selectedGene = colorBySelected;
      this.annotationState.selectedAnnotationSlug = undefined;
      this.hexBinHack();
    } else {
      this.geneState.selectedGene = undefined;
      const attributeSlug = colorBySelected.replace("cluster_", "");
      this.annotationState.selectedAnnotationSlug = attributeSlug;
      if (
        !this.annotationState.cellAnnotationMap.has(attributeSlug) &&
        this.bucketSlug !== undefined
      ) {
        this.annotationState.loadAnnotationData(
          this.bucketSlug,
          attributeSlug,
          []
        );
      }
      this.hexBinHack();
    }
  }

  setColorBySelectedWithActive(
    colorBySelected: string,
    activeList: Array<string>
  ): void {
    this.colorBySelected = colorBySelected;
    const attributeSlug = colorBySelected.replace("cluster_", "");
    this.geneState.selectedGene = undefined;
    this.annotationState.selectedAnnotationSlug = attributeSlug;
    if (this.bucketSlug !== undefined) {
      this.annotationState.loadAnnotationData(
        this.bucketSlug,
        attributeSlug,
        activeList
      );
    }
    this.hexBinHack();
  }

  /**
   * Gets the Color List in RGB Format.
   */
  getColorListRGB(): Array<[number, number, number, number]> {
    const colorRgbList = [];
    const hexColorList = this.getColorListHex();
    for (const currentColor of hexColorList) {
      colorRgbList.push(ColorUtil.hexToRgb(currentColor));
    }
    return colorRgbList;
  }

  /**
   * Gets the Color List in Hex Format.
   */
  getColorListHex(): Array<string> {
    let colorList = new Array<string>();
    if (this.geneState.selectedGene) {
      colorList = this.blues;
    } else if (this.annotationState.selectedAnnotationSlug) {
      const cellAnnotation = this.annotationState.cellAnnotationMap.get(
        this.annotationState.selectedAnnotationSlug
      );
      if (cellAnnotation) {
        colorList = cellAnnotation.getActiveColorListHex();
      }
    }
    if (colorList.length === 0) {
      colorList.push(LunaState.COLOR_BLACK);
    }
    return colorList;
  }

  /**
   * HexBin Hack to Force Re-coloring of Deck.gl.
   */
  hexBinHack(): void {
    this.hexBinRadius = this.hexBinRadius + this.flipBit;
    this.flipBit = this.flipBit * -1;
  }

  /**
   * Retrieves all Buckets.
   */
  getAllBuckets(): void {
    axios({
      method: "get",
      url: LunaState.BASE_SERVER_URL + "/buckets",
    })
      .then((res) => this.initBuckets(res.data))
      .catch(() => alert("Failed to load Data Buckets."));
  }

  /**
   * Inits the Data Buckets.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initBuckets(json: any): void {
    for (const item of json) {
      const bucket: Bucket = {
        slug: item["slug"],
        name: item["name"],
        description: item["description"],
        url: item["url"],
      };
      this.bucketState.addBucket(bucket);
      axios({
        method: "get",
        url: LunaState.BASE_SERVER_URL + "/vignettes/" + bucket.slug,
      })
        .then((res) => this.initVignetteList(bucket.slug, res.data))
        .catch(() =>
          alert("Failed to load vignettes for: " + bucket.slug + ".")
        );
    }
  }

  /**
   * Initializes all Vignettes.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initVignetteList(bucketSlug: string, json: any): void {
    for (const item of json["vignettes"]) {
      const vignette: Vignette = {
        slug: item["slug"],
        label: item["label"],
        description: item["description"],
        gene: item["gene"],
        colorBy: item["color_by"],
        active: item["active"],
        hexBinRadius: item["hex_bin_radius"],
        elevationBy: item["elevation_by"],
        elevationScale: item["elevation_scale"]
      };
      this.bucketState.setVignette(
        bucketSlug,
        vignette.slug,
        vignette
      );
    }
    this.vignettesLoaded = true;
  }
}

export default LunaState;
