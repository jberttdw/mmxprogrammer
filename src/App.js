import React, { Component } from "react";
import PropTypes from "prop-types";
import NoteGrid from "./components/NoteGrid";
import MidiUpload from "./components/Midiupload";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

const styles = theme => ({
  controls: {
    width: 540,
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    margin: 30,
    marginTop: 0
  }
});

// To change manual/alternating
// 1-49 Manual Channel 1
// 50-99 Alternating
// 100-127 manual Channel 2
const instruments = {
  drums: {
    kick: [12],
    snare: [24],
    hihat: [36],
    cymbal: [48],
    combined: [12, 24, 36, 48]
  },
  bass: {
    E: [
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25
    ],
    A: [
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51,
      52,
      53,
      54,
      55,
      56
    ],
    D: [
      62,
      63,
      64,
      65,
      66,
      67,
      68,
      69,
      70,
      71,
      72,
      73,
      74,
      75,
      76,
      77,
      78,
      79,
      80,
      81,
      82,
      83
    ],
    G: [
      91,
      92,
      93,
      94,
      95,
      96,
      97,
      98,
      99,
      100,
      101,
      102,
      103,
      104,
      105,
      106,
      107,
      108,
      109,
      110,
      111,
      112
    ],
    combined: [
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51,
      52,
      53,
      54,
      55,
      56,
      62,
      63,
      64,
      65,
      66,
      67,
      68,
      69,
      70,
      71,
      72,
      73,
      74,
      75,
      76,
      77,
      78,
      79,
      80,
      81,
      82,
      83,
      91,
      92,
      93,
      94,
      95,
      96,
      97,
      98,
      99,
      100,
      101,
      102,
      103,
      104,
      105,
      106,
      107,
      108,
      109,
      110,
      111,
      112
    ]
  },
  // To be changed later, E-minor is here as an example
  vibraphone: {
    bars: [35, 36, 38, 40, 42, 43, 45, 47, 48, 50, 52],
    combined: [35, 36, 38, 40, 42, 43, 45, 47, 48, 50, 52]
  }
};

const scales = {
  C: {
    name: "C",
    notes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  },
  CSharp: {
    name: "C#",
    notes: [35, 36, 38, 40, 42, 43, 45, 47, 48, 50, 52]
  }
};

// Init instrument data structure:
// Each instrument, be that a vibraphone bar, drum or bass guitar string has a marble gate
// with 2 channels for marbles and 2 triggers. Each trigger can be activated
// by a pin in one of 3 programming tracks, with the tracks having holes offset from each other.
// There are 64 measures, each one representing 1 quarter note.
// The first track in this datastructure contains 256 holes around the wheel because there are 4 holes per measure.
// These holes model 16th notes, with the first note alligned to the start of the measure. The next hole
// represents the 3rd 16th note in the measure because there obviously need to be solid material between holes.
// The second track also has 4 holes to model 16th notes but the first hole is aligned with the 2nd 16th note
// in the measure and the hole after that represents the 4th 16th note of the measure, and so on.
// The third track models holes for triplets (i.e. a measure divided in 3 parts). The first note in
// each triplet is the same as the first 16th note, so out of 3 holes needed for a triplet this track
// has 2 holes per measure the 2nd and the 3rd of the 3 notes.
//
// The next 3 tracks are the same, but then for the other trigger.
// 
// Note that the Instrument component visualizes this data in a slightly different order so that
// it matches the layout of the MMX. There the 6 tracks are in a special setup:
// First the triplet track, then the on-beats, then the off-beats, then a small space, then the off-beats of the other trigger,
// on-beats of the other trigger and finally the triplets of the other trigger.
//
// Also note that the UI shows the program upside down and mirrored (the "left" tracks are actually for what we called
// the "other trigger", i.e. array indices 3-5) because the programmer views the MMX from the back.
function initInstrument() {
  return [
    Array(64 * 4).fill(false),
    Array(64 * 4).fill(false),
    Array(64 * 2).fill(false),
    Array(64 * 4).fill(false),
    Array(64 * 4).fill(false),
    Array(64 * 2).fill(false)
  ];
}

function nearInt(op) {
  const target = 0;
  const range = 0.05;
  return op < target + range && op > target - range;
}

function getTimingPosition(time) {
  if (nearInt(time, 0) || nearInt(time % 0.5)) {
    return { column: 0, index: Math.floor(time / 0.5) };
  } else if (nearInt(time % 0.25)) {
    return { column: 1, index: (Math.floor(time / 0.25) - 1) / 2 };
  } else if (nearInt((time % 1) % 0.33)) {
    return {
      column: 2,
      index: Math.floor(time / 0.66) - 1 - Math.floor(time / 2)
    };
  } else {
    // throw new Error("Invalid note timing");
    // console.error("invalid note timing",time)
    return false;
  }
}
/*
0
,66  = 0
1,33 = 1

2
2,66 = 2
3,33 = 3

4
4,66 = 4
5,33 = 5

6
6,66 = 6
7,33 = 7

8
8,66 = 8
9,33 = 9

10
10,66 = 10
11,33 = 11

*/
const initialState = {
  data: {
    vibraphone: {
      bar1: initInstrument(),
      bar2: initInstrument(),
      bar3: initInstrument(),
      bar4: initInstrument(),
      bar5: initInstrument(),
      bar6: initInstrument(),
      bar7: initInstrument(),
      bar8: initInstrument(),
      bar9: initInstrument(),
      bar10: initInstrument(),
      bar11: initInstrument()
    },
    drums: {
      cymbal: initInstrument(),
      kick: initInstrument(),
      snare: initInstrument(),
      hihat: initInstrument()
    },
    bass: {
      E: initInstrument(),
      A: initInstrument(),
      D: initInstrument(),
      G: initInstrument()
    }
  }
};

class App extends Component {
  state = initialState;
  pinPlacingEnabled = false;
  pinPlacingShortcut = 0;
  
  constructor(props) {
    super(props);
    this.noteGridRef = React.createRef();
  }

  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  triggerHiddenModeCheck() {
    this.pinPlacingShortcut++;
    if (this.pinPlacingShortcut >= 5) {
      this.pinPlacingEnabled = true;
      this.forceUpdate();
    }
  }

  changeNote = (instrumentGroup, instrument, column, index, newValue) => {
    let newInstrument = this.state.data[instrumentGroup][instrument].slice();

    if (this.pinPlacingEnabled) {
      // Advanced mode where you can place pins anywhere
      newInstrument[column][index] = newValue;
    } else {
      // Mode where clicking a pin moves it to the other channel.
      // Since the data model is symmetric instead of mirrored like the UI we can do sum + modulo
      newInstrument[column][index] = false;
      var otherChannel = (column + 3) % 6;
      newInstrument[otherChannel][index] = true;
    }

    this.setState({
      data: {
        ...this.state.data,
        [instrumentGroup]: {
          ...this.state.data[instrumentGroup],
          [instrument]: newInstrument
        }
      }
    });
  };

  setData = data => {
    instruments.vibraphone.bars = scales[data.scale].notes;
    instruments.vibraphone.combined = scales[data.scale].notes;

    let result = Object.assign({}, initialState.data);

    /*
    [15:56, 3/16/2018] Martin Molin: 1-49 Manual Channel 1
    [15:56, 3/16/2018] Martin Molin: 50-99 Alternating
    [15:56, 3/16/2018] Martin Molin: 100-127 manual Channel 2
    */
    const manual1Treshold = 0.3858267716535433;
    const alternatingTreshold = 0.7795275590551181;

    let previousChannel = 1;
    Object.keys(instruments).forEach(instrumentGroup => {
      data[instrumentGroup].notes
        .filter(note =>
          instruments[instrumentGroup].combined.includes(note.midi)
        )
        .forEach((note, noteIndex) => {
          let key = undefined;

          Object.keys(instruments[instrumentGroup])
            .filter(instrument => instrument !== "combined")
            .forEach(instrument => {
              if (
                instruments[instrumentGroup][instrument].includes(note.midi)
              ) {
                key = instrument;
              }
            });

          if (key === undefined) {
            console.log(note.midi);
            console.error("this shouldn't happen...");
          }

          const timingPosition = getTimingPosition(note.time);

          if (timingPosition === false) {
            console.log("timingPosition === false", note);
          } else {
            const { column, index } = timingPosition;

            let channel;
            if (note.velocity > 0 && note.velocity < manual1Treshold) {
              // manual 1
              channel = 0;
            } else if (note.velocity < alternatingTreshold) {
              // manual 2
              channel = 3;
            } else {
              // alternating
              if (noteIndex === 0 || previousChannel === 3) {
                channel = 0;
              } else {
                channel = 3;
              }
            }
            previousChannel = channel;
            const newColumn = column + channel; //((column + 1) * channel) - 1;
            result[instrumentGroup][key][newColumn][index] = true;
          }
        });
    });

    this.setState({ data: result });
    this.update();
  };

  update = () => {
    this.noteGridRef.current.update();
  };

  render() {
    const { data } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <Typography variant="display4" gutterBottom onClick={() => this.triggerHiddenModeCheck()}>
          MMX Programmer
        </Typography>
        <Paper className={classes.controls}>
          <MidiUpload
            setData={this.setData}
            instruments={instruments}
            scales={scales}
          />
        </Paper>
        <NoteGrid
          ref={this.noteGridRef}
          data={data}
          changeNote={this.changeNote}
          readonly={!(this.pinPlacingEnabled)}
        />
      </div>
    );
  }
}

export default withStyles(styles)(App);
