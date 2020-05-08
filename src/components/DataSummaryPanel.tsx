import React from "react";
import { observer } from "mobx-react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MapState from "../utils/MapState";
import config from "../data/lunaConfig.json";

interface DataSummaryPanelProps {
  mapState: MapState;
}

@observer
class DataSummaryPanel extends React.Component<DataSummaryPanelProps> {
  constructor(props: DataSummaryPanelProps) {
    super(props);
    this.handleVignetteChange = this.handleVignetteChange.bind(this);
  }

  handleVignetteChange(event: any) {
    this.props.mapState.vignetteSelected = event.target.value;

    //  The code below is a small bit of hackery.
    //  When you change vignette, you have to trigger to Deck.gl
    //  to recall all the color values;  you can force this by making a
    //  very tiny change to the hex bin radius.
    this.props.mapState.hexBinRadius = this.props.mapState.hexBinRadius + 1;
  }

  render() {
    let vignetteList = this.getVignetteMenuItems();
    let vignetteDescription = "Select a vignette above to get started.";
    if (this.props.mapState.vignetteHasBeenSelected()) {
      vignetteDescription =
        config["vignettes"][this.props.mapState.vignetteSelected][
          "description"
        ];
    }
    return (
      <ExpansionPanel defaultExpanded={true}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Data Summary</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className="control">
          <b>{config["label"]}:</b>
          <br />
          <br />
          {config["description"]}
          <br />
          <br />
          <FormControl>
            <InputLabel>Vignette</InputLabel>
            <Select
              value={this.props.mapState.vignetteSelected}
              onChange={this.handleVignetteChange}
            >
              {vignetteList}
            </Select>
          </FormControl>
          <br />
          {vignetteDescription}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

  getVignetteMenuItems() {
    let menuItems: Array<any> = [];
    menuItems.push(
      <MenuItem key={"vignette_0"} value={-1}>
        Select a Vignette
      </MenuItem>
    );
    for (let key in config["vignettes"]) {
      let vignette = config["vignettes"][key];
      menuItems.push(
        <MenuItem key={"vignette_" + key} value={key}>
          {vignette["label"]}
        </MenuItem>
      );
    }
    return menuItems;
  }
}

export default DataSummaryPanel;
