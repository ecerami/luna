import React from "react";
import { observer } from "mobx-react";
import ComponentProps from "./ComponentProps";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import BrushIcon from "@material-ui/icons/Brush";

/**
 * Legend Panel for Gene Expression and Annotations.
 */
@observer
class LegendPanel extends React.Component<ComponentProps> {
  constructor(props: ComponentProps) {
    super(props);
    this.handleLegendButtonClick = this.handleLegendButtonClick.bind(this);
  }

  render(): JSX.Element {
    const legend = this.getLegend();
    const legendControl = this.getLegendControls();
    if (this.props.lunaState != null) {
      return (
        <ExpansionPanel defaultExpanded={false}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <BrushIcon />
            &nbsp;<Typography>Legend</Typography>
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
  handleLegendButtonClick(): void {
    this.props.lunaState.annotationState.showAnnotationDialogPicker = true;
  }

  /**
   * Gets the Gene or Annotation Legend.
   */
  getLegend(): JSX.Element[] {
    if (this.props.lunaState.geneState.selectedGene !== undefined) {
      return this.getGeneLegend();
    } else if (
      this.props.lunaState.annotationState.selectedAnnotationSlug !== undefined
    ) {
      return this.getAnnotationLegend();
    } else {
      const legend: Array<JSX.Element> = [];
      legend.push(<div></div>);
      return legend;
    }
  }

  /**
   * Gets the Gene Legend.
   */
  private getGeneLegend(): JSX.Element[] {
    const legend: Array<JSX.Element> = [];
    const colorList = this.props.lunaState.getColorListHex();
    let index = 0;
    const maxGeneExpression = Math.floor(
      this.props.lunaState.geneState.getSelectedGeneMaxExpression()
    );
    const tick = maxGeneExpression / colorList.length;
    for (const color in colorList) {
      let currentColor: string = colorList[color];
      currentColor = currentColor.toString();
      const currentValue = maxGeneExpression - index * tick;
      legend.push(this.getColorBox(currentColor, currentValue.toFixed(2)));
      index += 1;
    }
    return legend;
  }

  /**
   * Gets the Annotation Legend.
   */
  private getAnnotationLegend(): JSX.Element[] {
    const legend: Array<JSX.Element> = [];
    const annotationState = this.props.lunaState.annotationState;
    const annotationSlug = annotationState.selectedAnnotationSlug;
    if (annotationSlug) {
      const cellAnnotation = annotationState.cellAnnotationMap.get(
        annotationSlug
      );
      if (cellAnnotation) {
        const colorList = cellAnnotation.getActiveColorListHex();
        const uniqueCategoryList = cellAnnotation.getUniqueCategoryList();
        for (const categoryName of uniqueCategoryList) {
          if (cellAnnotation.isCategoryActive(categoryName)) {
            const colorIndex = cellAnnotation.getCategoryIndexColor(
              categoryName
            );
            if (colorIndex !== undefined) {
              legend.push(
                this.getColorBox(colorList[colorIndex], categoryName)
              );
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
  private getLegendControls(): JSX.Element {
    if (this.props.lunaState.annotationState.selectedAnnotationSlug) {
      const cellAnnotation = this.props.lunaState.annotationState.cellAnnotationMap.get(
        this.props.lunaState.annotationState.selectedAnnotationSlug
      );
      const style = {
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
            Edit: {cellAnnotation?.getLabel()}
          </Button>
        </div>
      );
    } else {
      return <div></div>;
    }
  }

  /**
   * Gets the Legend CSS Color Box.
   * @param currentColor Current Hex Color.
   * @param categoryValue Current Category Value.
   */
  private getColorBox(
    currentColor: string,
    categoryValue: string
  ): JSX.Element {
    const boxStyle = {
      width: "50px",
      height: "12px",
      display: "inline-block",
      backgroundColor: currentColor,
    };

    // Keys required by React
    const key1 = "legend_box_tr_" + categoryValue;
    const key2 = "legend_box_td1_" + categoryValue;
    const key3 = "legend_box_td2_" + categoryValue;
    const key4 = "legend_box_a_" + categoryValue;
    const key5 = "legend_box_b_" + categoryValue;

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
