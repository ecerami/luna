import React from "react";
import { observer } from "mobx-react";
import ComponentProps from "./ComponentProps";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import BrushIcon from '@material-ui/icons/Brush';

/**
 * Legend Panel for Gene Expression and Annotations.
 */
@observer
class LegendPanel extends React.Component<ComponentProps> {
	constructor(props: ComponentProps) {
		super(props);
		this.handleLegendButtonClick = this.handleLegendButtonClick.bind(this);
	}

	render() {
		let legend = this.getLegend();
		let legendControl = this.getLegendControls();
		if (this.props.lunaState != null) {
			return (
				<ExpansionPanel defaultExpanded={false}>
					<ExpansionPanelSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1a-content"
						id="panel1a-header"
					>
					<BrushIcon/>&nbsp;<Typography>Legend</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails className="legend">
						{legendControl}
						<table id="legend">
							<tbody>{legend}</tbody>
						</table>
					</ExpansionPanelDetails>
				</ExpansionPanel>
			);
		} else {
			return <div />;
		}
	}

  /**
   * Shows the Category Picker Component.
   */
	handleLegendButtonClick(event: any) {
		this.props.lunaState.annotationState.showAnnotationDialogPicker = true;
	}

  /**
   * Gets the Gene or Annotation Legend.
   */
	getLegend() {
		if (this.props.lunaState.geneState.selectedGene !== undefined) {
			return this.getGeneLegend();
		} else if (this.props.lunaState.annotationState.selectedAnnotationId !== undefined) {
			return this.getAnnotationLegend();
		}
		return <div></div>;
	}

  /**
   * Gets the Gene Legend.
   */
	private getGeneLegend() {
		let legend: Array<any> = [];
		let colorList = this.props.lunaState.getColorListByFormat("hex");
		colorList = colorList.reverse();
		let index = 0;
		let maxGeneExpression = Math.ceil(
			this.props.lunaState.geneState.getSelectedGeneMaxExpression()
		);
		let tick = maxGeneExpression / colorList.length;
		for (let color in colorList) {
			let currentColor: string = colorList[color];
			currentColor = currentColor.toString();
			legend.push(this.getColorBox(currentColor, (index * tick).toFixed(2)));
			index += 1;
		}
		return legend;
	}

  /**
   * Gets the Annotation Legend.
   */
	private getAnnotationLegend() {
		let legend: Array<any> = [];
		let annotationState = this.props.lunaState.annotationState;
		let annotationId = annotationState.selectedAnnotationId;
		if (annotationId) {
			let cellAnnotation = annotationState.cellAnnotationMap.get(annotationId);
			if (cellAnnotation) {
				let colorList = cellAnnotation.getActiveColorListHex();
				let uniqueCategoryList = cellAnnotation.getUniqueCategoryList();
				for (let categoryName of uniqueCategoryList) {
					if (cellAnnotation.isCategoryActive(categoryName)) {
						let colorIndex = cellAnnotation.getCategoryIndexColor(categoryName);
						if (colorIndex !== undefined) {
							legend.push(this.getColorBox(colorList[colorIndex], categoryName));
						}
					}
				}
			}
		}
		return legend;
	}

	/**
	 * Gets the Edit Categories Button.
	 */
	private getLegendControls() {
		if (this.props.lunaState.annotationState.selectedAnnotationId) {
			let cellAnnotation = this.props.lunaState.annotationState.cellAnnotationMap.get(
				this.props.lunaState.annotationState.selectedAnnotationId);
			let style = {
				paddingBottom: "20px",
			};
			return (
				<div style={style}>
					<Button
						variant="contained"
						size="small"
						color="primary"
						onClick={this.handleLegendButtonClick}
					>
						Edit:  {cellAnnotation?.getLabel()}
					</Button>
				</div>
			);
		}
	}

	/**
	 * Gets the Legend CSS Color Box.
	 * @param currentColor Current Hex Color.
	 * @param categoryValue Current Category Value.
	 */
	private getColorBox(currentColor: any, categoryValue: string) {
		let boxStyle = {
			width: "50px",
			height: "12px",
			display: "inline-block",
			backgroundColor: currentColor,
		};

		// Keys required by React
		let key1 = "legend_box_tr_" + categoryValue;
		let key2 = "legend_box_td1_" + categoryValue;
		let key3 = "legend_box_td2_" + categoryValue;
		let key4 = "legend_box_a_" + categoryValue;
		let key5 = "legend_box_b_" + categoryValue;

		return (
			<tr key={key1}>
				<td key={key2}>{categoryValue}</td>
				<td key={key3}>
					<div key={key4}>
						<span key={key5} style={boxStyle}></span>
					</div>
				</td>
			</tr>
		);
	}
}

export default LegendPanel;
