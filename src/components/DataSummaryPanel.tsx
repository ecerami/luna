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
  }

  render() {
    let vignetteList = this.getVignetteMenuItems();
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
          <br/>{config["vignettes"][this.props.mapState.vignetteSelected]["description"]}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

  getVignetteMenuItems() {
    let menuItems: Array<any> = [];
    for (let key in config["vignettes"]) {
      let vignette = config["vignettes"][key];
      menuItems.push(<MenuItem value={key}>{vignette["label"]}</MenuItem>);
    }
    return menuItems;
  }
}

export default DataSummaryPanel;
