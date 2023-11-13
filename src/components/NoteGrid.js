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
  height: 250px;
  padding-top: 120px;
  border: 1px solid black;
  border-left: none;
`;

const RowNumbersContainer = styled.div`
  position: sticky;
  left: 0;
  width: 40px;
  background-color: #fafafa;
  z-index: 2;
  text-align: center;
`;

const ColumnNamesContainer = styled.div`
  position: sticky;
  top: 0;
  white-space: nowrap;
  z-index: 1;
  text-align: center;
  margin-left: 40px;
  font-size: 14px;
`;

const ColumnName = styled.div`
  display: inline-block;
  width: 120px;
  background-color: #fafafa;
  border: 1px solid black;
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
    changeNote: PropTypes.func.isRequired
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
    const { data, changeNote } = this.props;
    const width = 2300;
    const height = 16020;

    // const kick = getColumns(data.drums.kick, 0, changeNote, "drums", "kick");
    // const snare = getColumns(data.drums.snare, 1, changeNote, "drums", "snare");
    let i = -1;
    const all = Object.keys(data).map(instrumentGroup => {
      return Object.keys(data[instrumentGroup]).map(instrument => {
        i++;
        return (
          <Instrument
            key={instrumentGroup + instrument + i}
            ref={this.instrumentRefs[i]}
            instrument={data[instrumentGroup][instrument]}
            index={i}
            changeNote={changeNote}
            instrumentGroupName={instrumentGroup}
            instrumentName={instrument}
          />
        );
      }).reverse();
    }).reverse();
    // ^^^^^^^^^^^ Reverse the columns as we're viewing it from the back

    // const RowNumbers = new Array(64).fill(false).map((_, i) => {
    //   return (
    //     <RowNumber key={"RowNumber" + i} x={30} y={i * 250 + 40}>
    //       {i + 1}
    //     </RowNumber>
    //   );
    // });    // const RowNumbers = new Array(64).fill(false).map((_, i) => {
    //   return (
    //     <RowNumber key={"RowNumber" + i} x={30} y={i * 250 + 40}>
    //       {i + 1}
    //     </RowNumber>
    //   );
    // });

    // The divider and gates have a unique number for each column because "left" and "right" track
    // switch when viewed from the back.
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
            {leftColumn} &nbsp; {instrumentShortname} &nbsp; {rightColumn}
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
