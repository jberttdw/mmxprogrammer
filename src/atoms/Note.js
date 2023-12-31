import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Rect = styled.rect`
  stroke-width: 1;
  ${(props) =>
    !props.readonly &&
    `&:hover {
      stroke: red;
      cursor: pointer;
    }`}
`;
export class Note extends Component {
  state = {
    trueValue: null
  };

  // [NOTE] y value is measured from bottom towards top.
  // Since SVG renders top to bottom we will need to do some math on the value.
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    callback: PropTypes.func.isRequired,
    instrument: PropTypes.string.isRequired,
    instrumentGroup: PropTypes.string.isRequired,
    track: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    readonly: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    if (props.value !== false) {
      this.state.trueValue = props.value;
      this.state.readonly = false;
    } else {
      this.state.trueValue = true;
      this.state.readonly = true;
    }
  }

  render() {
    const noteWidth = 5;
    const noteHeight = 7;

    const {
      x,
      y,
      instrumentGroup,
      instrument,
      track,
      index,
      value,
      readonly,
      callback
    } = this.props;

    let dottedStroke = undefined;
    // On every plate edge the off-beat tracks miss the last hole of the track.
    // There are 64 off-beat holes on a plate, so modulo math should return 63.
    if ((track == 1 || track == 4) && index % 64 == 63) {
      dottedStroke = "3,3";
    }

    return (
      <Rect
        x={x}
        y={y - noteHeight}
        width={noteWidth}
        height={noteHeight}
        stroke="black"
        strokeDasharray={dottedStroke}
        strokeWidth="2"
        fill={value !== false ? (dottedStroke == undefined ? "black" : "red") : "#ddd"}
        onClick={() => {
          if (!readonly)
            callback(instrumentGroup, instrument, track, index, !value);
        }}
        readonly={readonly}
      />
    );
  }
}
