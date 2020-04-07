import React from "react";
import data from "./data/umap_clusters.json";
import { VictoryChart, VictoryScatter } from "victory";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { observable } from "mobx";
import { observer } from "mobx-react";

import "./App.css";

@observer
class App extends React.Component {
  @observable colorMenu = 0;

  constructor() {
    super({});
    this.handleColorMenuChange = this.handleColorMenuChange.bind(this);
  }  

  private getColor(datum: any): string {
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
      "#cab2d6"
    ];
    if (this.colorMenu === 1) {
      return colors[datum.leiden];
    } else if (this.colorMenu === 2) {
      return colors[datum.louvain];
    } else {
      return "black";
    }
  }

  handleColorMenuChange(event: any) {
    this.colorMenu = event.target.value;
    console.log("Event:  " + event.target.value);
  }

  render() {
    let formStyle = {
      minWidth: 200,
      paddingTop: 20,
      paddingLeft: 20
    };

    let chipStyle = {
        borderRadius: 5,
        background: "#73AD21",
        marginLeft:20,
        marginTop:10,
        padding: 2,
        width: 10,
        height: 15,
    };

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Luna: Single Cell Visualizer</Typography>
          </Toolbar>
        </AppBar>

        <FormControl style={formStyle}>
          <Select
            value={this.colorMenu}
            onChange={this.handleColorMenuChange}
          >
            <MenuItem value={0}>No Color Coding</MenuItem>
            <MenuItem value={1}>Color Code by Louvian Cluster</MenuItem>
            <MenuItem value={2}>Color Code by Ledein Cluster</MenuItem>
          </Select>
        </FormControl>
        <div style={chipStyle}></div>

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
