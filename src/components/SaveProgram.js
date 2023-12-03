import React, { Component } from "react";
import PropTypes from "prop-types";
import MakerJs from "makerjs";
import FileSaver from "file-saver";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    fileUpload: {
      width: 0.1,
      height: 0.1,
      opacity: 0,
      overflow: "hidden",
      position: "absolute",
      zIndex: -1
    },
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 120
    },
    button: {
      margin: theme.spacing.unit
    }
  });

class SaveProgram extends Component {
    static propTypes = {
      classes: PropTypes.object.isRequired,
      data: PropTypes.object.isRequired
    };

    saveFile() {
      let contentType = "application/vnd.mmxprogrammer+json;charset=utf-8";

      
      let exportData = {
          ContentType: contentType,
          formatVersion: "0",
          vibraphone: this.props.data.vibraphone,
          vibraphoneNotes: this.props.data.vibraphoneNotes,
          drums: this.props.data.drums,
          bass: this.props.data.bass
      };
      let blob = new Blob([JSON.stringify(exportData)], { type: contentType});
      FileSaver.saveAs(blob, "MMXProgram.json")
    }

    render() {
        const { classes, scales } = this.props;
        return (
            <span>
              {false ? (
                <CircularProgress className={classes.progress} />
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  component={"label"}
                  htmlFor="saveProgram"
                  onClick={() => this.saveFile()}
                >
                  Save Program
                </Button>
              )}
            </span>
          );      
    }
}

export default withStyles(styles)(SaveProgram);
