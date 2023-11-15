import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Rect = styled.rect`
  stroke-width: 1;
  stroke: black;
  &:hover {
    stroke: red;
    cursor: pointer;
  }
`;
export class Note extends Component {
  state = {
    trueValue: null
  };

  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    callback: PropTypes.func.isRequired,
    instrument: PropTypes.string.isRequired,
    instrumentGroup: PropTypes.string.isRequired,
    track: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    if (props.value !== false) {
      this.state.trueValue = props.value;
    } else {
      this.state.trueValue = true;
    }
  }

  render() {
    const {
      x,
      y,
      instrumentGroup,
      instrument,
      track,
      index,
      value,
      callback
    } = this.props;

    return (
      <Rect
        x={x}
        y={y}
        width="5"
        height="15"
        stroke="black"
        strokeWidth="2"
        fill={value !== false ? "black" : "#ddd"}
        onClick={() => {
          callback(instrumentGroup, instrument, track, index, !value);
        }}
      />
    );
  }
}
