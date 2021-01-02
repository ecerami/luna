import React from "react";
import { observer } from "mobx-react";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import ComponentProps from "./ComponentProps";
import { Button } from "@material-ui/core";
import CellAnnotation from "../utils/CellAnnotation";

@observer
class CategoryPicker extends React.Component<ComponentProps> {
  /**
   * Constructor.
   * @param props ComponentProps
   */
  constructor(props: ComponentProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange(event: any, categoryName: string): void {
    const annotationState = this.props.lunaState.annotationState;
    const annotationSlug = this.props.lunaState.annotationState
      .selectedAnnotationSlug;
    if (annotationSlug) {
      const cellAnnotation = annotationState.cellAnnotationMap.get(
        annotationSlug
      );
      const currentState = cellAnnotation?.isCategoryActive(categoryName);
      cellAnnotation?.setCategoryActive(categoryName, !currentState);
      this.props.lunaState.hexBinHack();
    }
  }

  handleButtonClick(): void {
    this.props.lunaState.annotationState.showAnnotationDialogPicker = false;
  }

  render(): JSX.Element{
    const style = {
      marginLeft: "20px",
      marginRight: "20px",
      marginBottom: "20px",
    };
    const switches = this.createCategorySwitches();
    return (
      <Dialog
        aria-labelledby="simple-dialog-title"
        open={this.props.lunaState.annotationState.showAnnotationDialogPicker}
      >
        <div style={style}>
          <DialogTitle id="simple-dialog-title">
            Select Clusters for Display
          </DialogTitle>
          <p>
            Select up to {CellAnnotation.DEFAULT_MAX_ACTIVE_CATEGORIES}{" "}
            categories below. &nbsp;&nbsp;
            <Button
              size="small"
              onClick={this.handleButtonClick}
              variant="contained"
              color="primary"
            >
              Done
            </Button>
          </p>
          <FormControl component="fieldset">
            <FormGroup>{switches}</FormGroup>
          </FormControl>
        </div>
      </Dialog>
    );
  }

  createCategorySwitches(): Array<JSX.Element> {
    const switches: Array<JSX.Element> = [];
    const annotationState = this.props.lunaState.annotationState;
    const annotationId = this.props.lunaState.annotationState
      .selectedAnnotationSlug;
    if (annotationId) {
      const cellAnnotation = annotationState.cellAnnotationMap.get(annotationId);
      if (cellAnnotation) {
        const uniqueCategoryList = cellAnnotation.getUniqueCategoryList();
        if (uniqueCategoryList) {
          for (let i = 0; i < uniqueCategoryList.length; i++) {
            const categoryName = uniqueCategoryList[i];
            const key = "category_picker_option_" + categoryName;
            switches.push(
              <FormControlLabel
                key={key}
                control={
                  <Switch
                    checked={cellAnnotation.isCategoryActive(categoryName)}
                    name={categoryName}
                    onChange={(e): void => this.handleChange(e, categoryName)}
                  />
                }
                label={categoryName}
              />
            );
          }
        }
      }
    }
    return switches;
  }
}

export default CategoryPicker;
