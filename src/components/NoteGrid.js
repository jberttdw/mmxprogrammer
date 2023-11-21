import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Instrument from "../atoms/Instrument";

const SvgContainer = styled.svg`
  position: absolute;
  top: 20px;
  left: 40px;
`;

const Container = styled.div`
  position: relative;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
`;

const RowNumber = styled.div`
  width: 40px;
  height: 125px;
  padding-top: 60px;
  border: 1px solid black;
  border-left: none;
  text-align: center;
`;

const RowNumbersContainer = styled.div`
  position: sticky;
  left: 0;
  width: 40px;
  background-color: #fafafa;
  z-index: 2;
`;

const ColumnNamesContainer = styled.div`
  position: sticky;
  top: 0;
  white-space: nowrap;
  z-index: 1;
  margin-left: 40px;
  font-size: 14px;
`;

const ColumnName = styled.div`
  display: inline-block;
  width: 60px;
  background-color: #fafafa;
  border: 1px solid black;
  text-align: center;
`;

class NoteGrid extends Component {
  constructor(props) {
    super(props);

    this.instrumentRefs = new Array(19).fill().map((_, i) => {
      return React.createRef();
    });
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
    changeNote: PropTypes.func.isRequired,
    readonly: PropTypes.bool
  };

  update = () => {
    this.instrumentRefs.forEach(ref => {
      ref.current.forceUpdate();
    });
  };

  // shouldComponentUpdate = (nextProps, nextState) => {
  //   return this.props.data !== nextProps.data;
  // };

  render() {
    const { data, changeNote, readonly } = this.props;
    const width = 1150;
    const height = 8010;

    // Reverse the key lists so that we show instruments mirrored
    // because the programmer views it from the back of the MMX.
    let i = -1;
    const all = Object.keys(data).reverse().map(instrumentGroup => {
      return Object.keys(data[instrumentGroup]).reverse().map(instrument => {
        i++;
        return (
          <Instrument
            key={instrumentGroup + instrument + '-' + i}
            ref={this.instrumentRefs[i]}
            instrument={data[instrumentGroup][instrument]}
            index={i}
            changeNote={changeNote}
            instrumentGroupName={instrumentGroup}
            instrumentName={instrument}
            readonly={readonly}
          />
        );
      });
    });

    // The divider and gates have a unique number for each column because "left" and "right" track
    // switch when viewed from the front versus the back.
    const ColumnNames = Object.keys(data).map(instrumentGroup => {
      i = -1;
      return Object.keys(data[instrumentGroup]).map(instrument => {
        var instrumentShortname;
        if (instrumentGroup === "bass") {
          instrumentShortname = instrument;
          i = -1;
        } else if (instrumentGroup === "drums") {
          instrumentShortname = instrument.substring(0,1).toUpperCase();
          i = -1;
        } else if (instrumentGroup === "vibraphone") {
          instrumentShortname = "V";
        }
        i++;
        let leftColumn = i*2 + 2;
        let rightColumn = i*2 + 1;
        return (
          <ColumnName key={instrumentGroup + instrument + i}>
            {leftColumn}&ensp;{instrumentShortname}&ensp;{rightColumn}
          </ColumnName>
        );
      }).reverse();
    }).reverse();
    // ^^^^^^^^^^^ Reverse the columns as we're viewing it from the back

    // Start numbering from the bottom and by plate - again, programming happens in the back
    const plateIds = ['A', 'B', 'C', 'D'];
    const RowNumbers = new Array(64).fill(false).map((_, i) => {
      let plateId = plateIds[Math.floor(i / 16)];
      let beatOnPlate = i % 16;
      return <RowNumber key={"RowNumber" + i}>{plateId}-{beatOnPlate + 1}</RowNumber>;
    }).reverse();

    return (
      <Container>
        <ColumnNamesContainer>{ColumnNames}</ColumnNamesContainer>
        <RowNumbersContainer>{RowNumbers}</RowNumbersContainer>
        <SvgContainer width={width} height={height}>
          {all}
        </SvgContainer>
      </Container>
    );
  }
}

export default NoteGrid;
