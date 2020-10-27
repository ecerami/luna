import React from "react";
import { observer } from "mobx-react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Grid from '@material-ui/core/Grid';
import LunaState from "../utils/LunaState";

interface DataSummaryPanelProps {
  mapState: LunaState;
}

@observer
class DataSummaryPanel extends React.Component<DataSummaryPanelProps> {
  constructor(props: DataSummaryPanelProps) {
    super(props);
    this.handleGeneButtonClick = this.handleGeneButtonClick.bind(this);
    this.handleGeneTextUpdate = this.handleGeneTextUpdate.bind(this);
  }

  handleGeneButtonClick(event: any) {
    this.props.mapState.addGene(this.props.mapState.currentGeneText);
  }

  handleGeneTextUpdate(event: any) {
    this.props.mapState.currentGeneText = event.target.value;
  }  

  render() {
    if (this.props.mapState != null) {
      return (
        <ExpansionPanel defaultExpanded={true}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Genes</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className="control">
            <FormControl>
              <Grid container alignItems="center" spacing={4}>
                <Grid item xs={8}>
                  <TextField id="target_gene"
                    value={this.props.mapState.currentGeneText}
                    onChange={this.handleGeneTextUpdate}
                    label="Gene" />
                </Grid>
                <Grid item xs={3}>
                  <Button variant="contained"
                    onClick={this.handleGeneButtonClick}>Add</Button>
                </Grid>
              </Grid>
            </FormControl>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    } else {
      return <div />;
    }
  }
}

export default DataSummaryPanel;
