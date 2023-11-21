import React, { PureComponent } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Note } from "../atoms/Note";

const SurroundingRectangle = styled.rect`
  stroke-width: 3;
  stroke: rgb(0, 0, 0);
  fill: none;
`;

function getColumns(instrument, lane, callback, group, name) {
  // Width and height for one surrounding rectangle, AKA "crank"
  const width = 60;
  const height = 125;
  const horizontalSpacing = 7;

  const maxCranks = 64;
  const maxTotalHeight = maxCranks * height;

  const column1x = 6;
  const column2x = column1x + horizontalSpacing;
  const column3x = column2x + horizontalSpacing;
  // Leave some space in the middle
  const column4x = 14 + 3 * horizontalSpacing;
  const column5x = column4x + horizontalSpacing;
  const column6x = column5x + horizontalSpacing;
  const verticalSpacing = height / 4;
  const offset = verticalSpacing / 2;
  const columntripletspacing = height / 3;

  // Bind first 3 columns to "right-most" tracks in data structure.
  // Remember: the programmer shows the back view of the machine.
  const column1 = instrument[5].map((value, index) => {
    return (
      <Note
        key={name + "column1" + index}
        instrumentGroup={group}
        instrument={name}
        track={5}
        index={index}
        x={column1x}
        y={
          maxTotalHeight
          - ( (index + 1) * columntripletspacing
            + Math.floor(index / 2) * columntripletspacing)
        }
        value={value}
        callback={callback}
      />
    );
  });

  const column2 = instrument[3].map((value, index) => {
    return (
      <Note
        key={name + "column2" + index}
        instrumentGroup={group}
        instrument={name}
        track={3}
        index={index}
        x={column2x}
        y={maxTotalHeight - (index * verticalSpacing)}
        value={value}
        callback={callback}
      />
    );
  });

  const column3 = instrument[4].map((value, index) => {
    return (
      <Note
        key={name + "column3" + index}
        instrumentGroup={group}
        instrument={name}
        track={4}
        index={index}
        x={column3x}
        y={maxTotalHeight - (offset + index * verticalSpacing)}
        value={value}
        callback={callback}
      />
    );
  });

  const column4 = instrument[1].map((value, index) => {
    return (
      <Note
        key={name + "column4" + index}
        instrumentGroup={group}
        instrument={name}
        track={1}
        index={index}
        x={column4x}
        y={maxTotalHeight - (offset + index * verticalSpacing)}
        value={value}
        callback={callback}
      />
    );
  });

  const column5 = instrument[0]
    .map((value, index) => {
      return (
        <Note
          key={name + "column5" + index}
          instrumentGroup={group}
          instrument={name}
          track={0}
          index={index}
          x={column5x}
          y={maxTotalHeight - (index * verticalSpacing)}
          value={value}
          callback={callback}
        />
      );
    })
    .filter(v => v !== false);

  const column6 = instrument[2]
    .map((value, index) => {
      return (
        <Note
          key={name + "column6" + index}
          instrumentGroup={group}
          instrument={name}
          track={2}
          index={index}
          x={column6x}
          y={
            maxTotalHeight
            - ((index + 1) * columntripletspacing +
               Math.floor(index / 2) * columntripletspacing)
          }
          value={value}
          callback={callback}
        />
      );
    })
    .filter(v => v !== false);

  const surroundingRectangles = new Array(maxCranks).fill(false).map((_, i) => {
    return (
      <SurroundingRectangle
        key={group + name + "surroundingRectangle" + i}
        width={width}
        height={height}
        y={height * i}
      />
    );
  });
  return (
    <g key={group + name} transform={`translate(${lane * width},0)`}>
      {[
        ...column1,
        ...column2,
        ...column3,
        ...column4,
        ...column5,
        ...column6,
        ...surroundingRectangles
      ]}
    </g>
  );
}

export default class Instrument extends PureComponent {
  static propTypes = {
    instrument: PropTypes.array.isRequired,
    instrumentGroupName: PropTypes.string.isRequired,
    instrumentName: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    changeNote: PropTypes.func.isRequired
  };

  render() {
    const {
      instrument,
      instrumentGroupName,
      instrumentName,
      index,
      changeNote
    } = this.props;
    return getColumns(
      instrument,
      index,
      changeNote,
      instrumentGroupName,
      instrumentName
    );
  }
}
