import React from "react";
import { observer } from "mobx-react";
import MapState from "../utils/MapState";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from '@material-ui/core/Grid';
import { TextRotationAngledown } from "@material-ui/icons";

interface LegendPanelProps {
  mapState: MapState;
}

@observer
class LegendPanel extends React.Component<LegendPanelProps> {
  constructor(props: LegendPanelProps) {
    super(props);
  }

  render() {
    let legend = this.getLegend()
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
                <table>
                { legend }
                </table>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    } else {
      return <div />;
    }
  }
 
  getLegend() {
    let legend: Array<any> = [];
    //  Get current color map and max gene expression
    let colorList = this.props.mapState.getColorListByFormat("hex");
    colorList = colorList.reverse();
    let index = 0;
    let maxGeneExpression = Math.ceil(
      this.props.mapState.getSelectedGeneMaxExpression()
    );
    let tick = maxGeneExpression / colorList.length;

    // Iterate through the color map
    for (let color in colorList) {
      let currentColor: string = colorList[color];
      currentColor = currentColor.toString();
      legend.push(this.getColorBox(currentColor, index*tick, index))
      index += 1;
    }
    return legend;
  }

  private getColorBox(currentColor: any, tickValue: number, index: number) {
    //  Style for CSS Box with Specific Background Color
    let boxStyle = {
      width: "50px",
      height: "12px",
      display: "inline-block",
      backgroundColor: currentColor,
    };

    // Keys required by React
    let key1 = "legend_box_a" + index;
    let key2 = "legend_box_b" + index;

    return (
      <tr>
        <td>{tickValue.toFixed(2)}</td>
        <td>
          <div key={key1}>
            <span key={key2} style={boxStyle}></span>
          </div>
        </td>
      </tr>
    );
  }
}

export default LegendPanel;
