import React from "react";
import { observer } from "mobx-react";
import MapState from "../utils/MapState";

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
        </div>
      );
    } else {
      return <span/>
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
