import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import Grid from "@material-ui/core/Grid";
import LunaState from "../state/LunaState";
import HexMapPanel from "./HexMapPanel";
import NavigationPanel from "./NavigationPanel";
import CategoryPicker from "./CategoryPicker";
import DataSummaryPanel from "./GenePanel";
import LegendPanel from "./LegendPanel";
import ControlPanel from "./ViewPanel";
import axios from "axios";
import { Coordinate } from "../utils/LunaData";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from 'react-router-dom';

type TParams = { 
	bucket_id: string
	gene_symbol: string
};

/**
 * Core Luna UI.
 */
@observer
class Luna extends React.Component<RouteComponentProps<TParams>> {
	lunaState: LunaState = new LunaState();
	@observable dataLoaded = false;

	/**
	 * Gets the Initial Luna Data via Web API.
	 */
	componentDidMount() {
		this.lunaState.bucketId = this.props.match.params.bucket_id
		axios({
			method: "get",
			url: LunaState.BASE_SERVER_URL + "/umap/" + this.lunaState.bucketId,
		})
			.then((res) => this.initLunaData(res.data))
			.catch((error) => alert("Failed to load umap coordinates."));
	}

	/**
	 * Inits the Luna UMap Data.
	 */
	initLunaData(json: any) {
		var coordList: Array<Coordinate> = new Array<Coordinate>();
		let index = 0;
		for (let item of json) {
			let currentCoord: Coordinate = {
				position: [item.x, item.y],
				index_id: index++,
			};
			coordList.push(currentCoord);
		}
		this.lunaState.mapData = coordList;
		axios({
			method: "get",
			url: LunaState.BASE_SERVER_URL + "/annotation_list/" + this.lunaState.bucketId,
		})
			.then((res) => this.initAnnotationList(res.data))
			.catch((error) => alert("Failed to load annotation list."));
	}

	/**
	 * Inits Annotation List
	 */
	initAnnotationList(json: any) {
		this.lunaState.annotationState.annotationList = json;
		let gene = this.props.match.params.gene_symbol
		if (gene !== undefined) {
			this.lunaState.geneState.addGene(gene)
		}
		this.dataLoaded = true;
	}

	/**
	 * Renders core Luna Interface.
	 */
	render() {
		if (this.dataLoaded === true) {
			return (
				<div>
					<CategoryPicker lunaState={this.lunaState} />
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
							<HexMapPanel lunaState={this.lunaState} />
						</Grid>
					</Grid>
				</div>
			);
		} else {
			return (
				<div>
					<br/>
					<img alt="loading" src="/img/loading.gif" />
				</div>
			);
		}
	}
}

export default withRouter(Luna);
