import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";
import PropTypes from "prop-types";
import VibraphoneBarInfo from "../atoms/VibraphoneBarInfo";

class VibraphoneInfo extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    data: PropTypes.object.isRequired
  };

  render() {
    const { data } = this.props;
    let i = 0;
    const numberOfBars = Object.keys(data.vibraphone).length;
    const noteInfo = Array.apply(null, Array(numberOfBars)).map(function (_, i) {
      const note = data.vibraphoneNotes[i];
      return [<VibraphoneBarInfo
          barIndex={i}
          note={note}
        />,
        <wbr/>];
    });
    return <Typography variant="body1">
    {noteInfo}
    </Typography>
  }
}

export default VibraphoneInfo;