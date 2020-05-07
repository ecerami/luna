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
    return (
      <div>
      <h4>{this.props.mapState.getCurrentTargetGene()}</h4>
      {legend}
      </div>
    );
  }

  getLegend() {
    let legend:any = [];
    let colorList = this.props.mapState.getColorListByFormat("hex");
    let index = 0;  
    for (let color in colorList) {
      let currentColor: string = colorList[color];
      currentColor = currentColor.toString();
      let boxStyle = {
        width: "20px",
        height: "8px",
        backgroundColor: currentColor
      }
      let tickMark = "";
      if (index === 0) {
        legend.push(<div style={boxStyle}><span className="legend-tick">Tick</span></div>);
      } else if (index === colorList.length-2) {
        legend.push(<div style={boxStyle}><span className="legend-tick">0.0</span></div>);
      } else {
        legend.push(<div style={boxStyle}></div>);
      }
      index +=1;
    }
    return legend;
  }
}

export default LegendPanel;