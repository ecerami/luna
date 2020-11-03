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
import { LunaData } from "./utils/LunaData";

import "./App.css";

@observer
class Luna extends React.Component<{}, {}> {
	static BASE_URL = "http://127.0.0.1:5000";
	@observable lunaState!: LunaState;
	@observable dataLoaded = false;
	lunaData?: LunaData;

	constructor(props: any) {
		super(props);
		this.getColorValue = this.getColorValue.bind(this);
		this.getColorList = this.getColorList.bind(this);
		this.getElevationValue = this.getElevationValue.bind(this);
	}

	/**
	 * Gets the Initial Data via Web API.
	 */
	componentDidMount() {
		axios({
			method: "get",
			url: Luna.BASE_URL + "/umap.json",
		})
			.then((res) => this.initLunaData(res.data))
			.catch((error) => console.log(error));
	}

	/**
	 * Inits the Luna Data
	 */
	initLunaData(json: any) {
		this.lunaData = json;
		axios({
			method: "get",
			url: Luna.BASE_URL + "/clusters.json",
		})
			.then((res) => this.initAnnotationList(res.data))
			.catch((error) => console.log(error));
		this.lunaState = new LunaState();
	}

	/**
	 * Inits Annotation List
	 */
	initAnnotationList(json: any) {
		this.dataLoaded = true;
		this.lunaState.annotationState.annotationKeyList = json;
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
		} else if (this.lunaState.annotationState.selectedAnnotationKey) {
			let cellAnnotation = this.lunaState.annotationState.cellAnnotationMap.get(
				this.lunaState.annotationState.selectedAnnotationKey
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
		let selectedAnnotationKey = this.lunaState.annotationState.selectedAnnotationKey;
		if (selectedGene) {
			return this.getGeneColor(selectedGene, dataList);
		} else if (selectedAnnotationKey) {
			return this.getAnnotationColor(selectedAnnotationKey, dataList);
		} else {
			return 0.0;
		}
	}

	/**
	 * Gets color based on majority vote.
	 */
	getAnnotationColor(selectedAnnotationKey: string, dataList: any) {
    let cellIndexList = new Array<number>();
		for (let i = 0; i < dataList.length; i++) {
			cellIndexList.push(dataList[i].index_id);
    }
    let cellAnnotation = this.lunaState.annotationState.cellAnnotationMap.get(selectedAnnotationKey);
    if (cellAnnotation) {
      return cellAnnotation.getColorIndex(cellIndexList);
    } else {
      return 0;
    }
	}

	/**
	 * Get Color based on Average Gene Expression.
	 */
	getGeneColor(selectedGene: string, dataList: any) {
		let expressionAverage = 0.0;
		let expressionVector = this.lunaState.geneState.geneExpressionValuesMap.get(selectedGene);
		if (expressionVector) {
			for (let i = 0; i < dataList.length; i++) {
				let cell: LunaData = dataList[i];
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
		// TODO:  FIX THIS SO THAT WE DON'T END UP WITH NEGATIVE ELEVATIONS!!!!
		// let elevation = this.getColorValue(dataList);
		// if (elevation > 0) {
		//   elevation =
		//     this.mapState.geneState.getSelectedGeneMaxExpression() - elevation;
		// }
		// return elevation;
	}

	// TODO:  FIX TOOLTIPS BELOW
	// setTooltip(info: any, event: any) {
	//   let object = info.object;
	//   let x = info.x;
	//   let y = info.y;
	//   const el = document.getElementById("tooltip");
	//   if (el != null) {
	//     if (object) {
	//       let clusterCounter = new ClusterCounter(
	//         info.object.points,
	//         "cell_ontology_class"
	//       );
	//       let rankedClusterList = clusterCounter.getClusterCountsRanked();
	//       let clusterHtml = "<table>";
	//       rankedClusterList.forEach((value) => {
	//         let clusterName = StringUtils.truncateOrPadString(value.clusterName);
	//         clusterHtml += "<tr>";
	//         clusterHtml += "<td>" + clusterName + "</td>";
	//         clusterHtml += "<td>N=" + value.numCells + "</td>";
	//         clusterHtml +=
	//           "<td>" + (100.0 * value.percentage).toFixed(0) + "%</td>";
	//         clusterHtml += "</tr>";
	//       });
	//       el.innerHTML = clusterHtml;
	//       el.style.display = "block";
	//       el.style.left = x + 100 + "px";
	//       el.style.top = y + 50 + "px";
	//     } else {
	//       el.style.display = "none";
	//     }
	//   }
	// }

	render() {
		let data: any = this.lunaData;
		if (this.lunaState != null && this.dataLoaded === true) {
			let colorList = this.getColorList();
			let colorDomainMax = this.getColorDomainMax();

			// Init the Deck.gl Hexagon Layer
			const layer = new HexagonLayer({
				id: "column-layer",
				data,
				pickable: true,
				extruded: this.lunaState.checked3D,
				radius: this.lunaState.hexBinRadius,
				//elevationScale: this.mapState.elevationScale,
				//elevationDomain: [0, colorDomainMax + 1],
				//getElevationValue: this.getElevationValue,
				getColorValue: this.getColorValue,
				colorDomain: [0, colorDomainMax],
				colorRange: colorList,
				//onHover: this.setTooltip,
				autoHighlight: true,
			});

			return (
				<div>
					<CategoryPicker lunaState={this.lunaState} />
					<AppBar position="static">
						<Toolbar>
							<Typography variant="h6">Luna: Single Cell Viewer</Typography>
						</Toolbar>
					</AppBar>
					<Grid container spacing={3}>
						<Grid id="left-column" item xs={3}>
							<div id="left-column-content">
								<DataSummaryPanel mapState={this.lunaState} />
								<ControlPanel lunaState={this.lunaState} />
								<LegendPanel mapState={this.lunaState} />
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
