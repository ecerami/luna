import React from "react";
import { observer } from "mobx-react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Slider from "@material-ui/core/Slider";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MapState from "../utils/MapState";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";

interface ControlPanelProps {
    mapState: MapState;
}

@observer
class ControlPanel extends React.Component<ControlPanelProps> {

  constructor(props: ControlPanelProps) {
    super(props);
    this.handleRadiusChange = this.handleRadiusChange.bind(this);
    this.handleElevationChange = this.handleElevationChange.bind(this);
    this.handle3DChange = this.handle3DChange.bind(this);
    this.handleColorBySelectChange = this.handleColorBySelectChange.bind(this);
  }

  handleRadiusChange(event: any, newValue: any) {
    this.props.mapState.hexBinRadiusSliderValue = newValue;
    this.props.mapState.hexBinRadius = newValue * MapState.HEX_BIN_RADIUS_SCALE;
  }

  handleElevationChange(event: any, newValue: any) {
    this.props.mapState.elevationScale = newValue;
  }

  handle3DChange(event: any, newValue: any) {
    this.props.mapState.checked3D = newValue;
  }

  handleColorBySelectChange(event: any, newValue: any) {
    this.props.mapState.setColorBySelected(newValue.props.value);
  }

  render() {
    let colorByMenuItems = this.getColorByMenuItems();
    return (
      <ExpansionPanel defaultExpanded={true}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>View</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className="control">
          <InputLabel id="colorBySelectLabel">Color by:</InputLabel>
          <Select id="colorBySelect" 
            labelId="colorBySelectLabel"
            value={this.props.mapState.colorBySelected}
            onChange={this.handleColorBySelectChange}>
            { colorByMenuItems }
          </Select>
          <br/><br/>
          <Typography>Hex Bin radius:</Typography>
          <Slider
            onChange={this.handleRadiusChange}
            value={this.props.mapState.hexBinRadiusSliderValue}
            min={5}
            max={200}
            step={10}
            valueLabelDisplay="auto"
          />
          <FormControlLabel
            control={
              <Switch
                checked={this.props.mapState.checked3D}
                onChange={this.handle3DChange}
                name="checked3d"
                color="primary"
              />
            }
            label="3D Mode"
          />
          <Typography>Elevation Scale:</Typography>
          <Slider
            onChange={this.handleElevationChange}
            value={this.props.mapState.elevationScale}
            disabled={!this.props.mapState.checked3D}
            min={1}
            max={1000}
            step={1}
            valueLabelDisplay="auto"
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

  getColorByMenuItems() {
    let menuItems: Array<any> = [];
    menuItems.push(
      <MenuItem key={"none"} value={"none"}>
        None
      </MenuItem>
    );    
    for (let gene of this.props.mapState.geneList) {
      menuItems.push(
        <MenuItem key={"color_by_" + gene} value={gene}>
          Gene:  { gene }
        </MenuItem>
      );
    }
    for (let clusterKey of this.props.mapState.clusterList) {
      menuItems.push(
        <MenuItem key={"color_by_" + clusterKey} value={clusterKey}>
          Cluster:  { clusterKey }
        </MenuItem>
      );
    }
    return menuItems;
  }
}

export default ControlPanel;
