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
import Grid from "@material-ui/core/Grid";
import ComponentProps from "./ComponentProps";
import BlurOnIcon from "@material-ui/icons/BlurOn";

@observer
class DataSummaryPanel extends React.Component<ComponentProps> {
  constructor(props: ComponentProps) {
    super(props);
    this.handleGeneButtonClick = this.handleGeneButtonClick.bind(this);
    this.handleGeneTextUpdate = this.handleGeneTextUpdate.bind(this);
  }

  handleGeneButtonClick(event: any) {
    this.props.lunaState.geneState.addGene(
      this.props.lunaState.currentGeneText
    );
  }

  handleGeneTextUpdate(event: any) {
    this.props.lunaState.currentGeneText = event.target.value;
  }

  render() {
    if (this.props.lunaState != null) {
      return (
        <ExpansionPanel defaultExpanded={true}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <BlurOnIcon />
            &nbsp;<Typography>Genes</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className="control">
            <FormControl>
              <Grid container alignItems="center" spacing={4}>
                <Grid item xs={8}>
                  <TextField
                    id="target_gene"
                    value={this.props.lunaState.currentGeneText}
                    onChange={this.handleGeneTextUpdate}
                    label="Gene."
                    helperText="Hint:  Try Mouse Genes:  Egfr, P2ry12 or Serpina1c."
                  />
                </Grid>
                <Grid item xs={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleGeneButtonClick}
                  >
                    Add
                  </Button>
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
