import React from "react";
import { observer } from "mobx-react";
import DeckGL from "@deck.gl/react";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import LunaState from "../state/LunaState";
import ComponentProps from "./ComponentProps";
import CellAnnotation from "../utils/CellAnnotation";
import { Coordinate } from "../utils/LunaData";

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
  getColorDomainMax(): number {
    let colorDomainMax = 0;
    if (this.props.lunaState.geneState.selectedGene !== undefined) {
      colorDomainMax = this.props.lunaState.geneState.getSelectedGeneMaxExpression();
    } else if (this.props.lunaState.annotationState.selectedAnnotationSlug) {
      const cellAnnotation = this.props.lunaState.annotationState.cellAnnotationMap.get(
        this.props.lunaState.annotationState.selectedAnnotationSlug
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getColorValue(dataList: any) {
    const selectedGene = this.props.lunaState.geneState.selectedGene;
    const selectedAnnotationSlug = this.props.lunaState.annotationState
      .selectedAnnotationSlug;
    if (selectedGene) {
      return this.getGeneColor(selectedGene, dataList);
    } else if (selectedAnnotationSlug) {
      return this.getAnnotationColor(selectedAnnotationSlug, dataList);
    } else {
      return 0.0;
    }
  }

  /**
   * Gets annotation color based on majority vote.
   */
  getAnnotationColor(selectedAnnotationSlug: string, dataList: any) {
    const cellIndexList = new Array<number>();
    for (let i = 0; i < dataList.length; i++) {
      cellIndexList.push(dataList[i].index_id);
    }
    const cellAnnotation = this.props.lunaState.annotationState.cellAnnotationMap.get(
      selectedAnnotationSlug
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
    const expressionVector = this.props.lunaState.geneState.geneExpressionValuesMap.get(
      selectedGene
    );
    if (expressionVector) {
      for (let i = 0; i < dataList.length; i++) {
        const cell: Coordinate = dataList[i];
        const cellIndexId: number = cell.indexId;
        const currentValue = expressionVector[cellIndexId];
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
  getElevationValue(dataList: any): number {
    if (this.props.lunaState.elevationBySelected !== "none") {
      const elevation =
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
  setTooltip(info: any, event: any): void {
    const object = info.object;
    const x = info.x;
    const y = info.y;
    const el = document.getElementById("tooltip");
    let showToolTip = false;
    if (el != null) {
      if (object) {
        const points = info.object.points;
        const cellIndexList = new Array<number>();
        for (let i = 0; i < points.length; i++) {
          cellIndexList.push(points[i].index_id);
        }
        const selectedAnnotationId = this.props.lunaState.annotationState
          .selectedAnnotationSlug;
        if (selectedAnnotationId) {
          const cellAnnotation = this.props.lunaState.annotationState.cellAnnotationMap.get(
            selectedAnnotationId
          );
          if (cellAnnotation) {
            showToolTip = true;
            const html = this.getToolTipHtml(
              points,
              cellAnnotation,
              cellIndexList
            );
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
  private setToolTipCss(el: HTMLElement, x: any, y: any, html: string): void {
    el.style.display = "block";
    el.style.left = x + 465 + "px";
    el.style.top = y + 50 + "px";
    el.innerHTML = html;
  }

  /**
   * Gets Tooltip HTML.
   */
  private getToolTipHtml(
    points: any,
    cellAnnotation: CellAnnotation,
    cellIndexList: number[]
  ): string {
    let html = "Number of Cells: " + points.length;
    html += "<br>" + cellAnnotation.getMostFrequentCategory(cellIndexList);
    return html;
  }

  /**
   * Inits the Deck GL Hexagon Layer.
   */
  private initDeckGLHexLayer(
    data: any,
    colorDomainMax: number,
    colorList: any
  ) {
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

  render(): JSX.Element {
    const colorList = this.getColorList();
    const colorDomainMax = this.getColorDomainMax();

    // Inits the Deck.gl Hexagon Layer
    const layer = this.initDeckGLHexLayer(
      this.props.lunaState.mapData,
      colorDomainMax,
      colorList
    );

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
