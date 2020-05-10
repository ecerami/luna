import React from "react";
import { observer } from "mobx-react";
import MapState from "../utils/MapState";
import { VictoryBoxPlot, VictoryGroup } from "victory";


interface LegendPanelProps {
  mapState: MapState;
}

@observer
class LegendPanel extends React.Component<LegendPanelProps> {
  constructor(props: LegendPanelProps) {
    super(props);
  }

  render() {
    let legend = this.getLegend();
    let tdStyle = {
      width: "200px",
    };
    if (this.props.mapState.vignetteHasBeenSelected()) {
      return (
        <div id="legend">
          <br/>
          <table>
            <tr>
              <td><b>{this.props.mapState.getCurrentTargetGene()}</b></td>
              <td style={tdStyle}>{legend}</td>
            </tr>
          </table>
          <hr/>
          <table>
            {this.addRow("microglial cell", 7, 9, 10, 8, 9.6)}
            {this.addRow("luminal epithelial cell", 0, 1, 2, 2, 3)}
            {this.addRow("basal cell of epidermis", 0, 1, 2, 2, 3)}
            {this.addRow("basal cell of epidermis", 0, 1, 2, 2, 3)}
            {this.addRow("basal cell of epidermis", 0, 1, 2, 2, 3)}
            {this.addRow("basal cell of epidermis", 0, 1, 2, 2, 3)}
            {this.addRow("basal cell of epidermis", 0, 1, 2, 2, 3)}
            {this.addRow("basal cell of epidermis", 0, 1, 2, 2, 3)}
          </table>
        </div>
      );
    } else {
      return <span />;
    }
  }

  addRow(label: string, min: number, median:number, max: number, q1: number, q3: number) {
    let tdStyle = {
      width: "150px",
    };
    return(
      <tr>
      <td><span className="cluster-label">{label}</span></td>
      <td style={tdStyle}>
        <VictoryGroup height={15} width={350}>
          <VictoryBoxPlot
            data={[{ x: 1, min: min, median: median, max: max, q1: q1, q3: q3 }]}
            horizontal
            boxWidth={30}
            domain={{y: [0, 10]}}
          />
        </VictoryGroup>
      </td>
    </tr>
    )
  }

  getLegend() {
    let legend: any = [];
    let colorList = this.props.mapState.getColorListByFormat("hex");
    colorList = colorList.reverse();
    let index = 0;
    let maxGeneExpression = Math.round(
      this.props.mapState.getCurrentTargetGeneMaxExpression()
    );
    for (let color in colorList) {
      let currentColor: string = colorList[color];
      currentColor = currentColor.toString();
      let boxStyle = {
        width: "7px",
        height: "12px",
        display: "inline-block",
        backgroundColor: currentColor,
      };
      let key = "legend_box_" + index;
      if (index === 0) {
        legend.push(
          <span>
          <span className="legend-tick-min">0.0</span>
          <span key={key} style={boxStyle}>
          </span>
          </span>
        );
      } else if (index === colorList.length - 1) {
        legend.push(
          <span>
          <span key={key} style={boxStyle}></span>
          <span className="legend-tick-max">{maxGeneExpression}.0</span>
          </span>
        );
      } else {
        legend.push(<span key={key} style={boxStyle}></span>);
      }
      index += 1;
    }
    return legend;
  }
}

export default LegendPanel;
