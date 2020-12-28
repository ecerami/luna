import React from "react";
import { observer } from "mobx-react";
import DeckGL from "@deck.gl/react";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import LunaState from "../state/LunaState";
import ComponentProps from "./ComponentProps";
import CellAnnotation from "../utils/CellAnnotation";
import { Coordinate } from "../utils/LunaData";
import { trace } from "mobx"

@observer
class HexMapPanel extends React.Component<ComponentProps> {

  constructor(props: ComponentProps) {
    super(props);
    this.getColorValue = this.getColorValue.bind(this);
		this.getColorList = this.getColorList.bind(this);
		this.getElevationValue = this.getElevationValue.bind(this);
		this.setTooltip = this.setTooltip.bind(this);
  }

	/**
	 * Gets Color List, based on Current Selection.
	 */
	getColorList() {
		return this.props.lunaState.getColorListByFormat(LunaState.RBA);
	}

	/**
	 * Gets the Color Domain Max, based on Current Selection.
	 */
	getColorDomainMax() {
		let colorDomainMax = 0;
		if (this.props.lunaState.geneState.selectedGene !== undefined) {
			colorDomainMax = this.props.lunaState.geneState.getSelectedGeneMaxExpression();
		} else if (this.props.lunaState.annotationState.selectedAnnotationId) {
			let cellAnnotation = this.props.lunaState.annotationState.cellAnnotationMap.get(
				this.props.lunaState.annotationState.selectedAnnotationId
			);
			if (cellAnnotation) {
				colorDomainMax = cellAnnotation.getActiveColorListHex().length;
			}
		}
		return colorDomainMax;
	}

	/**
	 * Gets the Color Value for Set of Points.
	 * For genes, the color is based on an average of expression values.
	 * For clusters, the color is based on majority vote.
	 */
	getColorValue(dataList: any) {
		let selectedGene = this.props.lunaState.geneState.selectedGene;
		let selectedAnnotationId = this.props.lunaState.annotationState.selectedAnnotationId;
		if (selectedGene) {
			return this.getGeneColor(selectedGene, dataList);
		} else if (selectedAnnotationId) {
			return this.getAnnotationColor(selectedAnnotationId, dataList);
		} else {
			return 0.0;
		}
	}

	/**
	 * Gets annotation color based on majority vote.
	 */
	getAnnotationColor(selectedAnnotationId: number, dataList: any) {
		let cellIndexList = new Array<number>();
		for (let i = 0; i < dataList.length; i++) {
			cellIndexList.push(dataList[i].index_id);
		}
		let cellAnnotation = this.props.lunaState.annotationState.cellAnnotationMap.get(
			selectedAnnotationId
		);
		if (cellAnnotation) {
			return cellAnnotation.getColorIndex(cellIndexList);
		} else {
			return 0;
		}
	}

	/**
	 * Gets Color based on Average Gene Expression.
	 */
	getGeneColor(selectedGene: string, dataList: any) {
		let expressionAverage = 0.0;
		let expressionVector = this.props.lunaState.geneState.geneExpressionValuesMap.get(selectedGene);
		if (expressionVector) {
			for (let i = 0; i < dataList.length; i++) {
				let cell: Coordinate = dataList[i];
				let cell_index_id: number = cell.index_id;
				let currentValue = expressionVector[cell_index_id];
				expressionAverage += currentValue;
			}
		}
		return (
			this.props.lunaState.geneState.getSelectedGeneMaxExpression() -
			expressionAverage / dataList.length
		);
	}

	/**
	 * Get the Elevation Value for a Set of Points
	 */
	getElevationValue(dataList: any) {
		if (this.props.lunaState.elevationBySelected !== "none") {
			let elevation =
				this.props.lunaState.geneState.getSelectedGeneMaxExpression() -
				this.getGeneColor(this.props.lunaState.elevationBySelected, dataList);
			return elevation;
		} else {
			return 1.0;
		}
	}

	/**
	 * Sets Tooltip, based on Currently Selected Category.
	 */
	setTooltip(info: any, event: any) {
		let object = info.object;
		let x = info.x;
		let y = info.y;
		const el = document.getElementById("tooltip");
		let showToolTip = false;
		if (el != null) {
			if (object) {
				let points = info.object.points;
				let cellIndexList = new Array<number>();
				for (let i = 0; i < points.length; i++) {
					cellIndexList.push(points[i].index_id);
				}
				let selectedAnnotationId = this.props.lunaState.annotationState.selectedAnnotationId;
				if (selectedAnnotationId) {
					let cellAnnotation = this.props.lunaState.annotationState.cellAnnotationMap.get(
						selectedAnnotationId
					);
					if (cellAnnotation) {
						showToolTip = true;
						let html = this.getToolTipHtml(points, cellAnnotation, cellIndexList);
						this.setToolTipCss(el, x, y, html);
					}
				}
			}
			if (showToolTip === false) {
				el.style.display = "none";
			}
		}
	}

	/**
	 * Sets the ToolTip CSS.
	 */
	private setToolTipCss(el: HTMLElement, x: any, y: any, html: string) {
		el.style.display = "block";
		el.style.left = x + 465 + "px";
		el.style.top = y + 50 + "px";
		el.innerHTML = html;
	}

	/**
	 * Gets Tooltip HTML.
	 */
	private getToolTipHtml(points: any, cellAnnotation: CellAnnotation, cellIndexList: number[]) {
		let html = "Number of Cells: " + points.length;
		html += "<br>" + cellAnnotation.getMostFrequentCategory(cellIndexList);
		return html;
	}

	/**
	 * Inits the Deck GL Hexagon Layer.
	 */
	private initDeckGLHexLayer(data: any, colorDomainMax: number, colorList: any) {
		return new HexagonLayer({
			id: "column-layer",
			data,
			pickable: true,
			extruded: this.props.lunaState.checked3D,
			radius: this.props.lunaState.hexBinRadius,
			elevationScale: this.props.lunaState.elevationScale,
			elevationDomain: [0, 10],
			getElevationValue: this.getElevationValue,
			getColorValue: this.getColorValue,
			colorDomain: [0, colorDomainMax],
			colorRange: colorList,
			onHover: this.setTooltip,
			autoHighlight: true,
		});
	}

  render() {
    let colorList = this.getColorList();
    let colorDomainMax = this.getColorDomainMax();

    // Inits the Deck.gl Hexagon Layer
    trace(false);
    const layer = this.initDeckGLHexLayer(this.props.lunaState.mapData, colorDomainMax, colorList);

    return (
      <div id="map">
        <DeckGL
          effects={[]}
          controller={true}
          initialViewState={this.props.lunaState.viewState}
          layers={[layer]}
          width={"100%"}
          height={"800px"}
        />
      </div>
    );
  }
}

export default HexMapPanel;