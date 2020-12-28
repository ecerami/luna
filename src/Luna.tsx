import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import LunaState from "./state/LunaState";
import HexMapPanel from "./components/HexMapPanel";
import NavigationPanel from "./components/NavigationPanel";
import CategoryPicker from "./components/CategoryPicker";
import DataSummaryPanel from "./components/GenePanel";
import LegendPanel from "./components/LegendPanel";
import ControlPanel from "./components/ViewPanel";
import axios from "axios";
import { Coordinate } from "./utils/LunaData";
import "./css/Luna.css";

/**
 * Core Luna UI.
 */
@observer
class Luna extends React.Component<{}, {}> {
	lunaState: LunaState = new LunaState();

	static BASE_SERVER_URL = "http://127.0.0.1:8000";
	//static BASE_SERVER_URL = "http://66.175.211.220:8000";
	static BUCKET_ID = 1;
	@observable dataLoaded = false;

	constructor(props: any) {
		super(props);
	}

	/**
	 * Gets the Initial Luna Data via Web API.
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
			url: Luna.BASE_SERVER_URL + "/annotation_list/" + Luna.BUCKET_ID,
		})
			.then((res) => this.initAnnotationList(res.data))
			.catch((error) => alert("Failed to load annotation list."));
	}

	/**
	 * Inits Annotation List
	 */
	initAnnotationList(json: any) {
		this.lunaState.annotationState.annotationList = json;
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
							<HexMapPanel lunaState={this.lunaState} />
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
