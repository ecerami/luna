import React from "react";
import { observer } from "mobx-react";
import MapState from "../utils/MapState";
import { VictoryBoxPlot, VictoryChart } from "victory";

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
    if (this.props.mapState.vignetteHasBeenSelected()) {
      return (
        <div id="legend">
          <h4>{this.props.mapState.getCurrentTargetGene()}</h4>
          {legend}
          <VictoryChart domainPadding={20} height={180}>
            <VictoryBoxPlot
              data={[{ x: 2, min: 1, median: 4, max: 9, q1: 3, q3: 6 }]}
              horizontal
              boxWidth={10}
              categories={{
                x: ["cats"],
              }}
            />
            <VictoryBoxPlot
              data={[{ x: 1, min: 2, median: 5, max: 15, q1: 3, q3: 7 }]}
              horizontal
              boxWidth={10}
              categories={{
                x: ["dogs"],
              }}
            />
            <VictoryBoxPlot
              data={[{ x: 3, min: 2, median: 5, max: 25, q1: 3, q3: 7 }]}
              horizontal
              boxWidth={10}
              categories={{
                x: ["sheep"],
              }}
            />
          </VictoryChart>
        </div>
      );
    } else {
      return <span />;
    }
  }

  getLegend() {
    let legend: any = [];
    let colorList = this.props.mapState.getColorListByFormat("hex");
    let index = 0;
    let maxGeneExpression = Math.round(
      this.props.mapState.getCurrentTargetGeneMaxExpression()
    );
    for (let color in colorList) {
      let currentColor: string = colorList[color];
      currentColor = currentColor.toString();
      let boxStyle = {
        width: "20px",
        height: "8px",
        backgroundColor: currentColor,
      };
      let key = "legend_box_" + index;
      if (index === 0) {
        legend.push(
          <div key={key} style={boxStyle}>
            <span className="legend-tick">{maxGeneExpression}.0</span>
          </div>
        );
      } else if (index === colorList.length - 2) {
        legend.push(
          <div key={key} style={boxStyle}>
            <span className="legend-tick">0.0</span>
          </div>
        );
      } else {
        legend.push(<div key={key} style={boxStyle}></div>);
      }
      index += 1;
    }
    return legend;
  }
}

export default LegendPanel;
