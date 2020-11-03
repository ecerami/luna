/**
 * Encapsualates Luna State.
 */
import { observable } from "mobx";
import AnnotationState from "./AnnotationState";
import GeneState from "./GeneState";
import ColorUtil from "../utils/ColorUtil";
const colorbrewer = require("colorbrewer");

class LunaState {
	static HEX_BIN_RADIUS_DEFAULT = 10;
	static HEX_BIN_RADIUS_SCALE = 1000;
	static ELEVATION_SCALE_DEFAULT = 200;
	static GENE_EXPRESSION = "gene_expression";
	static RBA = "rba";
	static COLOR_BLACK = "black";

	viewState: any;
	@observable annotationState: AnnotationState = new AnnotationState();
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
			this.annotationState.selectedAnnotationKey = undefined;
			this.hexBinHack();
		} else if (colorBySelected.startsWith("gene_")) {
			colorBySelected = colorBySelected.replace("gene_", "");
			this.geneState.selectedGene = colorBySelected;
			this.annotationState.selectedAnnotationKey = undefined;
			this.hexBinHack();
		} else {
			this.geneState.selectedGene = undefined;
			colorBySelected = colorBySelected.replace("cluster_", "");
			this.annotationState.selectedAnnotationKey = colorBySelected;
			if (!this.annotationState.cellAnnotationMap.has(colorBySelected)) {
				this.annotationState.loadAnnotationData(colorBySelected);
			}
			this.hexBinHack();
		}
	}

	/**
	 * Get the Color List.
	 * @param format Color Format.
	 */
	getColorListByFormat(format: string): any {
		let colorList = new Array<string>();
		if (this.geneState.selectedGene) {
			colorList = colorbrewer.Blues[6];
			colorList.reverse();
		} else if (this.annotationState.selectedAnnotationKey) {
			let cellAnnotation = this.annotationState.cellAnnotationMap.get(
				this.annotationState.selectedAnnotationKey
      );
      if (cellAnnotation) {
        colorList = cellAnnotation.getActiveColorListHex();
      } else {
        colorList.push(LunaState.COLOR_BLACK);  
      }
		} else {
			colorList.push(LunaState.COLOR_BLACK);
		}

		if (format === "hex") {
			return colorList;
		} else {
			let colorRgbList = [];
			for (let currentColor of colorList) {
				colorRgbList.push(ColorUtil.hexToRgb(currentColor));
			}
			return colorRgbList;
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
