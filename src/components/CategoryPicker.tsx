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

	handleChange(event: any, categoryName: string) {
        let annotationState = this.props.lunaState.annotationState;
		let annotationSlug = this.props.lunaState.annotationState.selectedAnnotationSlug;
		if (annotationSlug) {
            let cellAnnotation = annotationState.cellAnnotationMap.get(annotationSlug);
            let currentState = cellAnnotation?.isCategoryActive(categoryName);
            cellAnnotation?.setCategoryActive(categoryName, !currentState);
            this.props.lunaState.hexBinHack();
        }
	}

	handleButtonClick(event: any) {
		this.props.lunaState.annotationState.showAnnotationDialogPicker = false;
	}

	render() {
		var style = {
			marginLeft: "20px",
			marginRight: "20px",
			marginBottom: "20px",
		};
		let switches = this.createCategorySwitches();
		return (
			<Dialog
				aria-labelledby="simple-dialog-title"
				open={this.props.lunaState.annotationState.showAnnotationDialogPicker}
			>
				<div style={style}>
					<DialogTitle id="simple-dialog-title">Select Clusters for Display</DialogTitle>
					<p>
						Select up to {CellAnnotation.DEFAULT_MAX_ACTIVE_CATEGORIES} categories below. &nbsp;&nbsp;
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

	createCategorySwitches() {
		let switches: Array<any> = [];
		let annotationState = this.props.lunaState.annotationState;
		let annotationId = this.props.lunaState.annotationState.selectedAnnotationSlug;
		if (annotationId) {
            let cellAnnotation = annotationState.cellAnnotationMap.get(annotationId);
            if (cellAnnotation) {
                let uniqueCategoryList = cellAnnotation.getUniqueCategoryList();
                if (uniqueCategoryList) {
                    for (let i = 0; i < uniqueCategoryList.length; i++) {
                        let categoryName = uniqueCategoryList[i];
                        let key = "category_picker_option_" + categoryName;
                        switches.push(
                            <FormControlLabel
                                key={key}
                                control={
                                    <Switch
                                        checked={cellAnnotation.isCategoryActive(categoryName)}
                                        name={categoryName}
                                        onChange={(e) => this.handleChange(e, categoryName)}
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
