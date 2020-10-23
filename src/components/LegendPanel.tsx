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
    // return (
    //   <div id="legend">
    //     <br />
    //     {this.getExpressionLegend()}
    //     <hr />
    //   </div>
    // );
    return (<div></div>)
  }

  selectCluster(clusterCategory: string, clusterName: string) {
    //this.props.mapState.setClusterSelected(clusterCategory, clusterName);
  }

  unSelectCluster(clusterCategory: string, clusterName: string) {
    //this.props.mapState.unsetClusterSelected();
  }

  getExpressionLegend() {
    let legend = this.getLegend();
    let tdStyle = {
      width: "200px",
    };
    return (
      <table>
        <tbody>
          <tr>
            <td>
              {/* <b>{this.props.mapState.getCurrentTargetGene()}</b> */}
            </td>
            <td style={tdStyle}>{legend}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  // addClusterRow(
  //   clusterReactList: any[],
  //   currentCluster: ClusterList,
  //   clusterKey: string
  // ) {
  //   clusterReactList.push(
  //     this.addRow(
  //       clusterKey,
  //       currentCluster.cluster_value,
  //       currentCluster.min,
  //       currentCluster.median,
  //       currentCluster.max,
  //       currentCluster.q1,
  //       currentCluster.q3
  //     )
  //   );
  // }

  // addRow(
  //   clusterKey: string,
  //   label: string,
  //   min: number,
  //   median: number,
  //   max: number,
  //   q1: number,
  //   q3: number
  // ) {
  //   let tdStyle = {
  //     width: "150px",
  //   };
  //   let truncatedLabel = this.truncateLabel(label);
  //   if (q3 - q1 > 0.0001) {
  //     return (
  //       <tr>
  //         <td>
  //           <span className="cluster-label">
  //             {/* <a
  //               href="#"
  //               onMouseOver={() => this.selectCluster(clusterKey, label)}
  //               onMouseOut={() => this.unSelectCluster(clusterKey, label)}
  //             > */}
  //             {truncatedLabel}
  //             {/* </a> */}
  //           </span>
  //         </td>
  //         <td style={tdStyle}>
  //           {this.getVictoryBoxPlot(label, min, median, max, q1, q3)}
  //         </td>
  //       </tr>
  //     );
  //   }
  // }

  private getVictoryBoxPlot(
    label: string,
    min: number,
    median: number,
    max: number,
    q1: number,
    q3: number
  ) {
    return (
      <VictoryGroup height={35} width={350}>
        <VictoryBoxPlot
          data={[{ x: 1, min: min, median: median, max: max, q1: q1, q3: q3 }]}
          horizontal
          boxWidth={40}
          domain={{
            y: [0, this.props.mapState.getSelectedGeneMaxExpression()],
          }}
        />
      </VictoryGroup>
    );
  }

  private truncateLabel(label: string) {
    // Truncate labels and convert to all lowercase
    let MAX_LEN = 15;
    label = label.toLowerCase();
    if (label.length > MAX_LEN) {
      label = label.substr(0, MAX_LEN) + "...";
    }
    return label;
  }

  getLegend() {
    let legend: any = [];

    // //  Get current color map and max gene expression
    // let colorList = this.props.mapState.getColorListByFormat("hex");
    // colorList = colorList.reverse();
    // let index = 0;
    // let maxGeneExpression = Math.round(
    //   this.props.mapState.getCurrentTargetGeneMaxExpression()
    // );

    // // Iterate through the color map
    // for (let color in colorList) {
    //   let currentColor: string = colorList[color];
    //   currentColor = currentColor.toString();
    //   if (index === 0) {
    //     legend.push(this.getColorBox(currentColor, index, 0));
    //   } else if (index === colorList.length - 1) {
    //     legend.push(this.getColorBox(currentColor, index, maxGeneExpression));
    //   } else {
    //     legend.push(this.getColorBox(currentColor, index));
    //   }
    //   index += 1;
    // }
    return legend;
  }

  private getColorBox(currentColor: any, index: number, value: number = -1) {
    //  Style for CSS Box with Specific Background Color
    let boxStyle = {
      width: "7px",
      height: "12px",
      display: "inline-block",
      backgroundColor: currentColor,
    };

    // Keys required by React
    let key1 = "legend_box_a" + index;
    let key2 = "legend_box_b" + index;
    let key3 = "legend_box_c" + index;

    // Only show min/max values
    let valueStr = "";
    if (value > -1) {
      valueStr = value + ".0";
    }
    if (value === 0) {
      return (
        <span key={key1}>
          <span key={key3} className="legend-tick-min">
            {valueStr}
          </span>
          <span key={key2} style={boxStyle}></span>
        </span>
      );
    } else {
      return (
        <span key={key1}>
          <span key={key2} style={boxStyle}></span>
          <span key={key3} className="legend-tick-max">
            {valueStr}
          </span>
        </span>
      );
    }
  }
}

export default LegendPanel;
