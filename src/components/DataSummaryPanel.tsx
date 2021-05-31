import React from "react";
import { observer } from "mobx-react";
import ComponentProps from "./ComponentProps";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import InfoIcon from '@material-ui/icons/Info';

/**
 * Vignette Details Panel.
 */
@observer
class DataSummaryPanel extends React.Component<ComponentProps> {
  constructor(props: ComponentProps) {
    super(props);
  }

  render(): JSX.Element {
    const details = this.getDetails();
    if (this.props.lunaState != null) {
      return (
        <ExpansionPanel defaultExpanded={true}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <InfoIcon />
            &nbsp;<Typography>Data Summary</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className="legend">
            { details}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    } else {
      return <div />;
    }
  }

  getDetails(): JSX.Element[] {
    const details: Array<JSX.Element> = [];
    const bucketSlug = this.props.lunaState.bucketSlug;
    const bucketMap = this.props.lunaState.bucketState.bucketMap;
    const vignetteSlug = this.props.lunaState.vignetteSlug;
    const vignetteMap = this.props.lunaState.bucketState.vignetteMap;
    if (bucketSlug) {
      const bucket = bucketMap.get(bucketSlug);
      if (bucket) {
        details.push(<div key="current_bucket">
          <b>{bucket.name}</b>:
          {bucket.description}
          </div>)
      }
      if (vignetteSlug) {
        const currentVignetteMap = vignetteMap.get(bucketSlug);
        if (currentVignetteMap) {
          const currentVignette = currentVignetteMap.get(vignetteSlug);
          if (currentVignette) {
            const activeList: Array<JSX.Element> = [];
            if (currentVignette.active){
              for (const currentCategory of currentVignette.active) {
                activeList.push(<li key={"active_" + currentCategory}>{currentCategory}</li>)
              }
            }
            details.push(<div key="current_vignette">
              <p><b>Currently Highlighted:  </b>
              {currentVignette.description}
              </p>
              <p>
              {activeList}
              </p>
              </div>
            );
          }
        }
      }
    }
    return details;
  }
}

export default DataSummaryPanel;