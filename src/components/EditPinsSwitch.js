import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

// const ColumnName = styled.div`
//   display: inline-block;
//   width: 60px;
//   background-color: #fafafa;
//   border: 1px solid black;
//   text-align: center;
// `;

class EditPinsSwitch extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    freePinEditModeEnabled: PropTypes.bool.isRequired,
    handleChange: PropTypes.func
  };

  handleModeChange = (e) => {
    const newValue = e.currentTarget.value;
    const callback = this.props.handleChange;
    if (newValue === "placePins") {
        callback(true);
    } else if (newValue === "switchChannel") {
        callback(false);
    }
  }

  render() {
    const choice = this.props.freePinEditModeEnabled ? "placePins" : "switchChannel"
    return (
        <FormControl>
          <RadioGroup
            row
            name="freePinEditMode-group"
            value={choice}
            onChange={this.handleModeChange}
          >
            <FormControlLabel value="placePins"     control={<Radio />} label="Place Pins" />
            <FormControlLabel value="switchChannel" control={<Radio />} label="Switch Channels" />
          </RadioGroup>
        </FormControl>
      );
  }
}

export default EditPinsSwitch;