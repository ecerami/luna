import React from "react";
import { observer } from "mobx-react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

@observer
class SummaryPanel extends React.Component {
  render() {
    return (
        <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>What am I looking at?</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className="control">
            You are looking at single cell RNASeq data from a mouse. Each
            hexagon represents a group of cells that have been clustered via
            U-Map.
            <p/>
            Only three clusters are highlighted:
            <br />
            <div className="cluster2">microglial cell</div>
            <div className="cluster3">leukocyte</div>
            <div className="cluster1">all other</div>
            <br />
            This map also only includes the expression of a single gene, P2ry12.
            <br />
            <br />
            If you enable 3D Mode, expression of P2ry12 is denoted as
            elevation, and you can quickly confirm that microglial cells and
            leukocytes have increased expression of P2ry12.
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default SummaryPanel;