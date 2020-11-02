import React from 'react';
import { observer } from "mobx-react";
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import LunaState from "../state/LunaState";
import { Button } from '@material-ui/core';

interface CategoryPickerProps {
    mapState: LunaState;
}

@observer
class CategoryPicker extends React.Component<CategoryPickerProps> {
    maxActiveSwitches = 8;
    numActiveSwitches = 0;

    constructor(props: CategoryPickerProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleChange(event: any, index: number) {

        // REPLACE ALL THIS WITH ONE CALL TO setCategoryActive()

        let clusterKey = this.props.mapState.clusterState.selectedClusterKey;
        if (clusterKey) {
            let uniqueValuesSelectedList = 
                this.props.mapState.clusterState.uniqueCategoriesSelectedMap.get(clusterKey);
            if (uniqueValuesSelectedList) {
                var currentSwitchState = uniqueValuesSelectedList[index];
                if (currentSwitchState === true) {
                    uniqueValuesSelectedList[index] = ! uniqueValuesSelectedList[index];
                    this.numActiveSwitches -=1;
                } else if (this.numActiveSwitches < this.maxActiveSwitches) {
                    uniqueValuesSelectedList[index] = ! uniqueValuesSelectedList[index];
                    this.numActiveSwitches +=1;
                }
                this.updateColorLookupMap();
                this.props.mapState.hexBinHack();
            }
        }
    }

    // Update the Color Lookup Map.
    // For example, cluster1 = 2 color index
    // cluster2 = -1 means that the cluster is associated with the default other color.
    updateColorLookupMap() {
        let clusterKey = this.props.mapState.clusterState.selectedClusterKey;
        if (clusterKey) {
            let uniqueValuesSelectedList = 
                this.props.mapState.clusterState.uniqueCategoriesSelectedMap.get(clusterKey);
            if (uniqueValuesSelectedList) {        
                let categoryToColorIndex = this.props.mapState.clusterState.categoryToColorIndex.get(clusterKey);
                let clusterList = this.props.mapState.clusterState.uniqueCategoriesMap.get(clusterKey);
                if (categoryToColorIndex && clusterList) {
                    let colorIndex = 0;
                    for (let i=0; i<clusterList.length; i++) {
                        let categoryName = clusterList[i];
                        let categorySelected = uniqueValuesSelectedList[i];
                        if (categorySelected === true) {
                            console.log("Active:  " + categoryName + " color index:  " + colorIndex);
                            categoryToColorIndex.set(categoryName, colorIndex);
                            colorIndex +=1;
                        } else {
                            if (categoryToColorIndex.has(categoryName)) {
                                categoryToColorIndex.delete(categoryName);
                            }
                        }
                    }
                }
            }
        }
    }

    handleButtonClick(event: any) {
        this.props.mapState.clusterState.showClusterDialogPicker = false;
    }

    render() {
        var style = {
            marginLeft: "20px",
            marginRight: "20px",
            marginBottom: "20px"
        }
        let switches = this.createCategorySwitches();
        return (
            <Dialog aria-labelledby="simple-dialog-title"
                open={this.props.mapState.clusterState.showClusterDialogPicker}>
                <div style={style}>
                    <DialogTitle id="simple-dialog-title">Select Clusters for Display</DialogTitle>
                    <p>Select up to {this.maxActiveSwitches} clusters below.
                    &nbsp;&nbsp;
                    <Button 
                        size="small" 
                        onClick={this.handleButtonClick}
                        variant="contained"
                        color="primary">Done</Button>
                    </p>
                    <FormControl component="fieldset">
                        <FormGroup>
                            { switches }
                        </FormGroup>
                    </FormControl>
                </div>
            </Dialog>
        )
    }

    createCategorySwitches() {
        let switches: Array<any> = [];
        this.numActiveSwitches = 0;
        let clusterState = this.props.mapState.clusterState;
        let clusterKey = this.props.mapState.clusterState.selectedClusterKey;
        if (clusterKey) {
            let uniqueValuesList = clusterState.uniqueCategoriesMap.get(clusterKey)
            let uniqueValuesSelectedList = clusterState.uniqueCategoriesSelectedMap.get(clusterKey);
            if (uniqueValuesList && uniqueValuesSelectedList) {
                for (let i=0; i<uniqueValuesList.length; i++) {
                    let uniqueValue = uniqueValuesList[i];
                    let name = "option " + i;
                    let key = "category_picker_option_" + i;
                    let checkedOption = uniqueValuesSelectedList[i];
                    if (checkedOption !== undefined) {
                        if (checkedOption === true) {
                            this.numActiveSwitches +=1;
                        }
                        switches.push(<FormControlLabel
                            key={key}
                            control={<Switch 
                                checked={checkedOption} 
                                name={name} 
                                onChange={(e) => this.handleChange(e, i)}/>}
                            label={uniqueValue}
                        />)
                    }
                }
            }
        }
        return switches;
    }
}

export default CategoryPicker;