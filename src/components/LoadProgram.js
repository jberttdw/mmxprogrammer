import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";


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

class LoadProgram extends Component {
  state = {
    showErrorDialog: false,
    loading: false,
    error: undefined
  };
  static propTypes = {
    classes: PropTypes.object.isRequired,
    setInstrumentsData: PropTypes.func.isRequired
  };

  onChange = async e => {
    const fileName = e.target.files[0].name;
    this.setState({ fileName: fileName, loading: true });
    var text = await e.target.files[0].text();
    var fileData = JSON.parse(text);
    if (fileData.ContentType !== "application/vnd.mmxprogrammer+json;charset=utf-8") {
      this.setState({ showErrorDialog: true, error: "Unrecognized file type" });
      return;
    }
    if (fileData.formatVersion === "0") {
      var instruments = {};
      if (fileData.vibraphoneNotes) {
        instruments.vibraphoneNotes = fileData.vibraphoneNotes;
      }
      if (fileData.bass) {
        instruments.bass = fileData.bass;
      }
      if (fileData.vibraphone) {
        instruments.vibraphone = fileData.vibraphone;
      }
      this.props.setInstrumentsData(instruments);
    } else {
      this.setState({showErrorDialog: true, error: "Unrecognized MMX Program file format"});
      return;
    }
    this.setState({ loading: false});
  };

  handleErrorClose = () => {
    this.setState({ showErrorDialog: false, loading: false });
  };

  render() {
    const { classes } = this.props;
    const {
      loading,
      showErrorDialog,
      error
    } = this.state;

    return (
      <span>
        {loading ? (
          <CircularProgress className={classes.progress} />
        ) : (
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            component={"label"}
            htmlFor="uploadProgram"
          >
            Load Program
          </Button>
        )}
        <input
            id="uploadProgram"
            className={classes.fileUpload}
            type="file"
            accept=".json"
            onChange={this.onChange}
            />
        <Dialog
          open={showErrorDialog}
          onClose={this.handleErrorClose}
          aria-labelledby="error-dialog"
        >
          <DialogTitle id="error-dialog">Error</DialogTitle>
          <DialogContent>
            <DialogContentText id="error-dialog-description">
              There was an error loading the program file: {error}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleErrorClose} color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </span>
    );
  }
}

export default withStyles(styles)(LoadProgram);
