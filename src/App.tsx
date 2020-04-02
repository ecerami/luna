import React from "react";
import data from "./data/umap_clusters.json";
import { VictoryChart, VictoryScatter } from "victory";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import "./App.css";

class App extends React.Component {
  private getColor(datum: any) {
    if (datum.leiden === 1) {
      return "red";
    } else if (datum.leiden === 2) {
      return "blue";
    } else if (datum.leiden === 3) {
      return "purple";
    } else if (datum.leiden === 4) {
      return "orange";
    } else {
      return "green";
    }
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
