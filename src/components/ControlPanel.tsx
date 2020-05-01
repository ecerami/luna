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
  }

  handleRadiusChange(event: any, newValue: any) {
    this.props.mapState.hexBinRadius = newValue;
  }

  handleElevationChange(event: any, newValue: any) {
    this.props.mapState.elevationScale = newValue;
  }

  handle3DChange(event: any, newValue: any) {
    this.props.mapState.checked3D = newValue;
  }

  render() {
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Controls</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className="control">
          <Typography>Hex Bin radius:</Typography>
          <Slider
            onChange={this.handleRadiusChange}
            defaultValue={MapState.HEX_BIN_RADIUS_DEFAULT}
            min={0}
            max={30000}
            step={500}
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
            defaultValue={MapState.ELEVATION_SCALE_DEFAULT}
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
}

export default ControlPanel;
