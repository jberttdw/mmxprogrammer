import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
//import Typography from "@material-ui/core/Typography";


const Bar = styled.span`
  margin-right: 10px;
  white-space:nowrap;
`;

const BarText = styled.span`
  display: inline-block;
  width: 3.2em;
`;

const Rect = styled.span`
  border: 1px solid black;
  width: 2em;
  text-align: center;
  display: inline-block;
`;

class VibraphoneBarInfo extends Component {

  static propTypes = {
    barIndex: PropTypes.number.isRequired,
    note: PropTypes.string.isRequired
  };
  
  constructor(props) {
    super(props);
  }
  
  render() {

    const {
      barIndex,
      note
    } = this.props;

    return (
      <Bar><BarText>Bar {barIndex + 1}: </BarText><Rect>{note}</Rect></Bar>
    );
  }
}

export default VibraphoneBarInfo;