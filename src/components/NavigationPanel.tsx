import React from "react";
import { observer } from "mobx-react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import OpenWithIcon from '@material-ui/icons/OpenWith';

@observer
class NavigationPanel extends React.Component {
  render() {
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
        <OpenWithIcon/>&nbsp;<Typography>How do I navigate?</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className="control">
          You navigate the map with your mouse.
          <ul>
            <li>Scroll to zoom in/out.</li>
            <li>Click + Drag to Pan</li>
            <li>Option + Drag to Change Perspective</li>
          </ul>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default NavigationPanel;