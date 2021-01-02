import React from "react";
import { observer } from "mobx-react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Slider from "@material-ui/core/Slider";
import LunaState from "../state/LunaState";
import ComponentProps from "./ComponentProps";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import VisibilityIcon from "@material-ui/icons/Visibility";

@observer
class ControlPanel extends React.Component<ComponentProps> {
  constructor(props: ComponentProps) {
    super(props);
    this.handleRadiusChange = this.handleRadiusChange.bind(this);
    this.handleElevationChange = this.handleElevationChange.bind(this);
    this.handle3DChange = this.handle3DChange.bind(this);
    this.handleColorBySelectChange = this.handleColorBySelectChange.bind(this);
    this.handleElevationBySelectChange = this.handleElevationBySelectChange.bind(
      this
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleRadiusChange(event: any, newValue: any): void {
    this.props.lunaState.hexBinRadiusSliderValue = newValue;
    this.props.lunaState.hexBinRadius =
      newValue * LunaState.HEX_BIN_RADIUS_SCALE;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleElevationChange(event: any, newValue: any): void {
    this.props.lunaState.elevationScale = newValue;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle3DChange(event: any, newValue: any): void {
    this.props.lunaState.checked3D = newValue;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleColorBySelectChange(event: any, newValue: any): void {
    this.props.lunaState.setColorBySelected(newValue.props.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleElevationBySelectChange(event: any, newValue: any): void {
    this.props.lunaState.elevationBySelected = newValue.props.value;
    if (this.props.lunaState.elevationBySelected === "none") {
      this.props.lunaState.checked3D = false;
    } else {
      this.props.lunaState.checked3D = true;
    }
    this.props.lunaState.hexBinHack();
  }

  render(): JSX.Element {
    const colorByMenuItems = this.getColorByMenuItems();
    const elevationByMenuItems = this.getElevationByMenuItems();
    return (
      <ExpansionPanel defaultExpanded={true}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <VisibilityIcon />
          &nbsp;<Typography>View</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className="control">
          <InputLabel id="colorBySelectLabel">Color by:</InputLabel>
          <Select
            id="colorBySelect"
            labelId="colorBySelectLabel"
            value={this.props.lunaState.colorBySelected}
            onChange={this.handleColorBySelectChange}
          >
            {colorByMenuItems}
          </Select>
          <br />
          <br />
          <InputLabel id="elevationBySelectLabel">Set elevation to:</InputLabel>
          <Select
            id="elevationBySelect"
            labelId="elevationBySelectLabel"
            value={this.props.lunaState.elevationBySelected}
            onChange={this.handleElevationBySelectChange}
          >
            {elevationByMenuItems}
          </Select>
          <br />
          <br />
          <Typography>Hex Bin radius:</Typography>
          <Slider
            onChange={this.handleRadiusChange}
            value={this.props.lunaState.hexBinRadiusSliderValue}
            min={5}
            max={200}
            step={10}
            valueLabelDisplay="auto"
          />
          <Typography>Elevation Scale:</Typography>
          <Slider
            onChange={this.handleElevationChange}
            value={this.props.lunaState.elevationScale}
            disabled={!this.props.lunaState.checked3D}
            min={1}
            max={2000}
            step={1}
            valueLabelDisplay="auto"
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

  getColorByMenuItems(): JSX.Element[] {
    const menuItems: Array<JSX.Element> = [];
    menuItems.push(
      <MenuItem key={"none"} value={"none"}>
        None
      </MenuItem>
    );
    for (const gene of this.props.lunaState.geneState.geneList) {
      menuItems.push(
        <MenuItem key={"color_by_" + gene} value={"gene_" + gene}>
          Gene: {gene}
        </MenuItem>
      );
    }
    for (const annotation of this.props.lunaState.annotationState
      .annotationList) {
      menuItems.push(
        <MenuItem
          key={"color_by_" + annotation.slug}
          value={"cluster_" + annotation.slug}
        >
          {annotation.label}
        </MenuItem>
      );
    }
    return menuItems;
  }

  getElevationByMenuItems(): JSX.Element[] {
    const menuItems: Array<JSX.Element> = [];
    menuItems.push(
      <MenuItem key={"none"} value={"none"}>
        None
      </MenuItem>
    );
    for (const gene of this.props.lunaState.geneState.geneList) {
      menuItems.push(
        <MenuItem key={"elevation_by_" + gene} value={gene}>
          {gene}
        </MenuItem>
      );
    }
    return menuItems;
  }
}

export default ControlPanel;
