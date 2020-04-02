import React from "react";
import data from "./data/umap_clusters.json";
import { VictoryChart, VictoryScatter } from "victory";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import "./App.css";

class App extends React.Component {
  private getColor(datum: any) {
    //  colors:  https://colorbrewer2.org/
    //  only currently supports up to 9 colors
    let colors = [
      "#a6cee3",
      "#1f78b4",
      "#b2df8a",
      "#33a02c",
      "#fb9a99",
      "#e31a1c",
      "#fdbf6f",
      "#ff7f00",
      "#cab2d6",
    ]
    let cluster = datum.leiden;
    return colors[cluster];
  }

  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">
              Luna:  Single Cell Visualizer
            </Typography>
          </Toolbar>
        </AppBar>
        <div id="plot">
          <VictoryChart>
            <VictoryScatter
              size={1}
              style={{
                data: {
                  fill: ({ datum }) => this.getColor(datum)
                }
              }}
              data={data}
            />
          </VictoryChart>
        </div>
      </div>
    );
  }
}

export default App;
