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
    maxActiveSwitches = 12;
    numActiveSwitches = 0;

    constructor(props: CategoryPickerProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleChange(event: any, index: number) {
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
            }
        }
    }

    handleButtonClick(event: any) {
        this.props.mapState.clusterState.showClusterDialogPicker = false;
    }

    render() {
        var style = {
            marginLeft: "20px",
            marginRight: "20px"
        }
        let switches = this.createCategorySwitches();
        return (
            <Dialog aria-labelledby="simple-dialog-title"
                open={this.props.mapState.clusterState.showClusterDialogPicker}>
                <div style={style}>
                    <DialogTitle id="simple-dialog-title">Select Clusters for Display</DialogTitle>
                    <p>Select up to 12 clusters below.
                    &nbsp;&nbsp;
                    <Button 
                        size="small" 
                        onClick={this.handleButtonClick}
                        variant="contained"
                        color="primary">Submit</Button>
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
                    let checkedOption = uniqueValuesSelectedList[i];
                    if (checkedOption !== undefined) {
                        if (checkedOption === true) {
                            this.numActiveSwitches +=1;
                        }
                        switches.push(<FormControlLabel
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