import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import DeckGL from "@deck.gl/react";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import LunaState from "./state/LunaState";
import NavigationPanel from "./components/NavigationPanel";
import CategoryPicker from "./components/CategoryPicker";
import DataSummaryPanel from "./components/GenePanel";
import LegendPanel from "./components/LegendPanel";
import ControlPanel from "./components/ViewPanel";
import axios from "axios";
import { Coordinate } from "./utils/LunaData";
import "./css/Luna.css";
import CellAnnotation from "./utils/CellAnnotation";

/**
 * Core Luna UI.
 */
@observer
class Luna extends React.Component<{}, {}> {
	// static BASE_SERVER_URL = "http://127.0.0.1:8000";
	static BASE_SERVER_URL = "http://66.175.211.220:8000";
	static BUCKET_ID = 1;
	@observable lunaState!: LunaState;
	@observable dataLoaded = false;
	lunaData?: Array<Coordinate>;

	constructor(props: any) {
		super(props);
		this.getColorValue = this.getColorValue.bind(this);
		this.getColorList = this.getColorList.bind(this);
		this.getElevationValue = this.getElevationValue.bind(this);
		this.setTooltip = this.setTooltip.bind(this);
	}

	/**
	 * Gets the Initial Luna Map via Web API.
	 */
	componentDidMount() {
		axios({
			method: "get",
			url: Luna.BASE_SERVER_URL + "/umap/" + Luna.BUCKET_ID,
		})
			.then((res) => this.initLunaData(res.data))
			.catch((error) => alert("Failed to load umap coordinates."));
	}

	/**
	 * Inits the Luna Map.
	 */
	initLunaData(json: any) {
		var coordList: Array<Coordinate> = new Array<Coordinate>();
		let index = 0;
		for (let item of json) {
			let currentCoord: Coordinate = {
				position: [item.x, item.y],
				index_id: index++
			}
			coordList.push(currentCoord)
		}
		this.lunaData = coordList;
		axios({
			method: "get",
			url: Luna.BASE_SERVER_URL + "/annotation_list/" + Luna.BUCKET_ID,
		})
			.then((res) => this.initAnnotationList(res.data))
			.catch((error) => alert("Failed to load annotation list."));
		this.lunaState = new LunaState();
	}

	/**
	 * Inits Annotation List
	 */
	initAnnotationList(json: any) {
		this.dataLoaded = true;
		this.lunaState.annotationState.annotationList = json;
	}

	/**
	 * Gets Color List, based on Current Selection.
	 */
	getColorList() {
		return this.lunaState.getColorListByFormat(LunaState.RBA);
	}

	/**
	 * Gets the Color Domain Max, based on Current Selection.
	 */
	getColorDomainMax() {
		let colorDomainMax = 0;
		if (this.lunaState.geneState.selectedGene !== undefined) {
			colorDomainMax = this.lunaState.geneState.getSelectedGeneMaxExpression();
		} else if (this.lunaState.annotationState.selectedAnnotationId) {
			let cellAnnotation = this.lunaState.annotationState.cellAnnotationMap.get(
				this.lunaState.annotationState.selectedAnnotationId
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
		let selectedGene = this.lunaState.geneState.selectedGene;
		let selectedAnnotationId = this.lunaState.annotationState.selectedAnnotationId;
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
		let cellAnnotation = this.lunaState.annotationState.cellAnnotationMap.get(
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
		let expressionVector = this.lunaState.geneState.geneExpressionValuesMap.get(selectedGene);
		if (expressionVector) {
			for (let i = 0; i < dataList.length; i++) {
				let cell: Coordinate = dataList[i];
				let cell_index_id: number = cell.index_id;
				let currentValue = expressionVector[cell_index_id];
				expressionAverage += currentValue;
			}
		}
		return (
			this.lunaState.geneState.getSelectedGeneMaxExpression() -
			expressionAverage / dataList.length
		);
	}

	/**
	 * Get the Elevation Value for a Set of Points
	 */
	getElevationValue(dataList: any) {
		if (this.lunaState.elevationBySelected !== "none") {
			let elevation =
				this.lunaState.geneState.getSelectedGeneMaxExpression() -
				this.getGeneColor(this.lunaState.elevationBySelected, dataList);
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
				let selectedAnnotationId = this.lunaState.annotationState.selectedAnnotationId;
				if (selectedAnnotationId) {
					let cellAnnotation = this.lunaState.annotationState.cellAnnotationMap.get(
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
			extruded: this.lunaState.checked3D,
			radius: this.lunaState.hexBinRadius,
			elevationScale: this.lunaState.elevationScale,
			elevationDomain: [0, 10],
			getElevationValue: this.getElevationValue,
			getColorValue: this.getColorValue,
			colorDomain: [0, colorDomainMax],
			colorRange: colorList,
			onHover: this.setTooltip,
			autoHighlight: true,
		});
	}

	/**
	 * Renders core Luna Interface.
	 */
	render() {
		let data: any = this.lunaData;
		if (this.lunaState != null && this.dataLoaded === true) {
			let colorList = this.getColorList();
			let colorDomainMax = this.getColorDomainMax();

			// Inits the Deck.gl Hexagon Layer
			const layer = this.initDeckGLHexLayer(data, colorDomainMax, colorList);

			return (
				<div>
					<CategoryPicker lunaState={this.lunaState} />
					<AppBar position="static">
						<Toolbar>
							&nbsp;<Typography variant="h6">Luna: Single Cell Viewer</Typography>
						</Toolbar>
					</AppBar>
					<Grid container spacing={3}>
						<Grid id="left-column" item xs={3}>
							<div id="left-column-content">
								<DataSummaryPanel lunaState={this.lunaState} />
								<ControlPanel lunaState={this.lunaState} />
								<LegendPanel lunaState={this.lunaState} />
								<NavigationPanel />
								<div id="tooltip"></div>
							</div>
						</Grid>
						<Grid item xs={9}>
							<div id="map" />
							<DeckGL
								effects={[]}
								controller={true}
								initialViewState={this.lunaState.viewState}
								layers={[layer]}
								width={"100%"}
								height={"800px"}
							/>
						</Grid>
					</Grid>
				</div>
			);
		} else {
			return (
				<div>
					<img alt="loading" src="img/loading.gif" />
				</div>
			);
		}
	}
}

export default Luna;
