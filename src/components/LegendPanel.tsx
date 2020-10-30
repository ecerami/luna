import React from "react";
import { observer } from "mobx-react";
import LunaState from "../state/LunaState";
import ClusterState from "../state/ClusterState";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";

interface LegendPanelProps {
  mapState: LunaState;
}

@observer
class LegendPanel extends React.Component<LegendPanelProps> {
  constructor(props: LegendPanelProps) {
    super(props);
    this.handleLegendButtonClick = this.handleLegendButtonClick.bind(this);
  }

  render() {
    let legend = this.getLegend();
    let legendControl = this.getLegendControls();
    if (this.props.mapState != null) {
      return (
        <ExpansionPanel defaultExpanded={false}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
          <Typography>Legend</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className="legend">
                { legendControl }
                <table id="legend">
                  <tbody>
                    { legend }
                  </tbody>
                </table>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    } else {
      return <div />;
    }
  }
 
  handleLegendButtonClick(event: any) {
    this.props.mapState.clusterState.showClusterDialogPicker = true;
  }

  getLegend() {
    let legend: Array<any> = [];
    if (this.props.mapState.geneState.selectedGene !== undefined) {
      return this.getGeneLegend(legend);
    } else if (this.props.mapState.clusterState.selectedClusterKey !== undefined) {
      return this.getClusterLegend(legend);
    }
  }

  private getGeneLegend(legend: any[]) {
    let colorList = this.props.mapState.getColorListByFormat("hex");
    colorList = colorList.reverse();
    let index = 0;
    let maxGeneExpression = Math.ceil(
      this.props.mapState.geneState.getSelectedGeneMaxExpression()
    );
    let tick = maxGeneExpression / colorList.length;
    for (let color in colorList) {
      let currentColor: string = colorList[color];
      currentColor = currentColor.toString();
      legend.push(this.getColorBox(currentColor, (index * tick).toFixed(2), index));
      index += 1;
    }
    return legend;
  }

  private getClusterLegend(legend: any[]) {
    let clusterState = this.props.mapState.clusterState;
    let colorList = clusterState.getColorList();
    let clusterKey = this.props.mapState.clusterState.selectedClusterKey;
    let numLegendItems = this.getNumLegendItems();
    let colorIndex = 0;
    if (clusterKey && numLegendItems > 0) {
      let uniqueCategoryList = clusterState.uniqueCategoriesMap.get(clusterKey)
      let uniqueCategorySelectedList = clusterState.uniqueCategoriesSelectedMap.get(clusterKey)
      if (uniqueCategoryList && uniqueCategorySelectedList) {
        for (let i=0; i< uniqueCategoryList.length; i++) {
          let categoryValue = uniqueCategoryList[i];
          let categorySelected = uniqueCategorySelectedList[i];
          if (categorySelected) {
            let currentColor: string = colorList[colorIndex];
            currentColor = currentColor.toString();
            legend.push(this.getColorBox(currentColor, categoryValue, i));
            colorIndex +=1;
          }
        }
        if (numLegendItems < uniqueCategoryList.length) {
          legend.push(this.getColorBox(ClusterState.OTHER_COLOR, "Other", 10000));  
        }
      }
    }
    return legend;
  }
  
  private getNumLegendItems() {
    let numLegendItems = 0;
    let clusterState = this.props.mapState.clusterState;
    let clusterKey = this.props.mapState.clusterState.selectedClusterKey;
    if (clusterKey) {
      let uniqueCategoryList = clusterState.uniqueCategoriesMap.get(clusterKey)
      let uniqueCategorySelectedList = clusterState.uniqueCategoriesSelectedMap.get(clusterKey)
      if (uniqueCategoryList && uniqueCategorySelectedList) {
        for (let i=0; i< uniqueCategoryList.length; i++) {
          let categorySelected = uniqueCategorySelectedList[i];
          if (categorySelected === true) {
            numLegendItems+=1;
          }
        }
      }
    }
    return numLegendItems;
  }

  private getLegendControls() {
    if (this.props.mapState.clusterState.selectedClusterKey) {
      let style = {
        paddingBottom: "20px",
      }
      return(
        <div style={style}>
         <Button variant="contained"
          size="small"
          color="primary" 
          onClick={this.handleLegendButtonClick}>Edit Clusters</Button>
        </div>
      )
    };
  }

  private getColorBox(currentColor: any, categoryValue: string, index: number) {
    //  Style for CSS Box with Specific Background Color
    let boxStyle = {
      width: "50px",
      height: "12px",
      display: "inline-block",
      backgroundColor: currentColor,
    };

    // Keys required by React
    let key1 = "legend_box_tr_" + index;
    let key2 = "legend_box_td1_" + index;
    let key3 = "legend_box_td2_" + index;
    let key4 = "legend_box_a_" + index;
    let key5 = "legend_box_b_" + index;

    return (
      <tr key={key1}>
        <td key={key2}>{ categoryValue }</td>
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
