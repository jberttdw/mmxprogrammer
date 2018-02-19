import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Circle = styled.div`
  border: 1px solid black;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: block;
  margin: 10px;
  &:hover {
    cursor: pointer;
  }
`;

export class Note extends Component {
  state = {
    on: false
  };

  static propTypes = {
    id: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired
  };

  switch = () => {
    this.setState({ on: !this.state.on });
    this.props.callback(this.props.id);
  };

  render() {
    const { on } = this.state;
    let color;
    if (on) {
      color = "black";
    } else {
      color = "#cccc";
    }
    return <Circle style={{ backgroundColor: color }} onClick={this.switch} />;
  }
}