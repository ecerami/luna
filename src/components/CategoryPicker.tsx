import React from 'react';
import { observer } from "mobx-react";
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import MapState from "../utils/MapState";
import { Button } from '@material-ui/core';
import { observable } from "mobx";

interface CategoryPickerProps {
    mapState: MapState;
}

@observer
class CategoryPicker extends React.Component<CategoryPickerProps> {
    numSwitches = 125;
    maxActiveSwitches = 12;
    numActiveSwitches = 0;
    @observable showCategoryPickerDialog = true;
    @observable categorySwitchList: Array<boolean> = [];

    constructor(props: CategoryPickerProps) {
        super(props);
        for (let i = 0; i < this.numSwitches; i++) {
            this.categorySwitchList.push(false);
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleChange(event: any, index: number) {
        console.log(index);
        var currentSwitchState = this.categorySwitchList[index];
        if (currentSwitchState === true) {
            this.categorySwitchList[index] = ! this.categorySwitchList[index];
            this.numActiveSwitches -=1;
        } else if (this.numActiveSwitches < this.maxActiveSwitches) {
            this.categorySwitchList[index] = ! this.categorySwitchList[index];
            this.numActiveSwitches +=1;
        }
    }

    handleButtonClick(event: any) {
        this.showCategoryPickerDialog = false;
    }

    render() {
        var style = {
            marginLeft: "20px",
            marginRight: "20px"
        }
        let switches = this.createCategorySwitches();
        return (
            <Dialog aria-labelledby="simple-dialog-title" open={this.showCategoryPickerDialog}>
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
        for (let i = 0; i < this.numSwitches; i++) {
            let name = "option " + i;
            let checkedOption = this.categorySwitchList[i];
            if (checkedOption !== undefined) {
                switches.push(<FormControlLabel
                    control={<Switch 
                        checked={checkedOption} 
                        name={name} 
                        onChange={(e) => this.handleChange(e, i)}/>}
                    label={name}
                />)
            }
        }
        return switches;
    }
}

export default CategoryPicker;