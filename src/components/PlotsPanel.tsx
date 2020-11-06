import React from "react";
import { observer } from "mobx-react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import LunaState from "../state/LunaState";
import Luna from "../Luna";
import BarChartIcon from '@material-ui/icons/BarChart';

interface PlotsPanelProps {
	lunaState: LunaState;
}

/**
 * Plots Panel.
 */
@observer
class PlotsPanel extends React.Component<PlotsPanelProps> {
	constructor(props: PlotsPanelProps) {
		super(props);
		this.handleCategoryChange = this.handleCategoryChange.bind(this);
		this.handleGeneChange = this.handleGeneChange.bind(this);
	}

	render() {
		let geneMenuItems = this.getGeneMenuItems();
		let categoryMenuItems = this.getCategoryMenuItems();
		let imgPlotTag = this.getPlotImgTag();
		return (
			<ExpansionPanel>
				<ExpansionPanelSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
				<BarChartIcon/>&nbsp;<Typography>Plots</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails className="control">
					<Typography>Gene:</Typography>
					<Select
						id="plotByGene"
						labelId="plotByGeneLaebl"
						value={this.props.lunaState.plotByGene}
						onChange={this.handleGeneChange}
					>
						{geneMenuItems}
					</Select>
					<br />
					<br />
					<Typography>Category:</Typography>
					<Select
						id="plotByCategory"
						labelId="plotByCategoryLabel"
						value={this.props.lunaState.plotByCategory}
						onChange={this.handleCategoryChange}
					>
						{categoryMenuItems}
					</Select>
					{imgPlotTag}
				</ExpansionPanelDetails>
			</ExpansionPanel>
		);
	}

	/**
	 * Handles Change to Gene Parameter.
	 */
	handleGeneChange(event: any, newValue: any) {
		console.log(newValue.props.value);
		this.props.lunaState.plotByGene = newValue.props.value;
	}

	/**
	 * Handles Change to Category Parameter.
	 */
	handleCategoryChange(event: any, newValue: any) {
		console.log(newValue.props.value);
		this.props.lunaState.plotByCategory = newValue.props.value;
	}

	/**
	 * Gets Category Menu Items.
	 */
	getCategoryMenuItems() {
		let menuItems: Array<any> = [];
		menuItems.push(
			<MenuItem key={"plot_gene_by_none"} value={"none"}>
				None
			</MenuItem>
		);
		for (let clusterKey of this.props.lunaState.annotationState.annotationKeyList) {
			menuItems.push(
				<MenuItem key={"plot_by_" + clusterKey} value={clusterKey}>
					Category: {clusterKey}
				</MenuItem>
			);
		}
		return menuItems;
	}

	/**
	 * Gets Gene Menu Items.
	 */
	getGeneMenuItems() {
		let menuItems: Array<any> = [];
		menuItems.push(
			<MenuItem key={"plot_category_by_none"} value={"none"}>
				None
			</MenuItem>
		);
		for (let gene of this.props.lunaState.geneState.geneList) {
			menuItems.push(
				<MenuItem key={"plot_by" + gene} value={gene}>
					{gene}
				</MenuItem>
			);
		}
		return menuItems;
	}

	/**
	 * Gets the Plot Image Tag.
	 */
	getPlotImgTag() {
		if (
			this.props.lunaState.plotByCategory !== LunaState.NONE &&
			this.props.lunaState.plotByGene !== LunaState.NONE
		) {
			let plotUrl =
				Luna.BASE_URL +
				"/boxplot/" +
				this.props.lunaState.plotByGene +
				"/" +
				this.props.lunaState.plotByCategory +
				".png";
			return <img alt="boxplot" src={plotUrl} />;
		} else {
			return <div></div>;
		}
	}
}

export default PlotsPanel;