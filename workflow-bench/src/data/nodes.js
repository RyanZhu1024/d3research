const TYPE = {
  READ: {
    name: "read", color: '#16af11',
    shapeValue: 'm -9,-17 26,0 -7,34 -27,0 z',
    input: 2,
    output: 2,
  },
  PARSE: {
    name: "parse", color: '#FECD01',
    shapeValue: 'm 0,-17 17,34 -34,0 z',
    input: 2,
    output: 2,
  },
  TRANSFORM: {
    name: "transform", color: '#4c4cfc',
    shapeValue: 'm -16,-16 32,0 0,32 -32,0 z',
    input: 2,
    output: 2,
  },
  FLOW: {
    name: "flow", color: '#06c8c9',
    shapeValue: 'm 0,-17 17,17 -17,17 -17,-17 17,-17 z',
    input: 2,
    output: 2,
  },
  FORMAT: {
    name: "format", color: '#ffdbac',
    shapeValue: 'm -17,-17 34,0 0,26 C -4,8 5,21 -17,16 z',
    input: 2,
    output: 2,
  },
  WRITE: {
    name: "write", color: '#d581d9',
    shapeValue: 'm -11,-17 28,0 c 0,0 -6,7 -6,17 0,10 6,17 6,17 l -28,0 c 0,0 -6,-7 -6,-17 0,-10 6,-17 6,-17 z',
    input: 2,
    output: 2,
  }
};

export default [
  {
    name: 'Salesforce Reader',
    type: TYPE.READ,
  },
  {
    name: 'AWS Writer',
    type: TYPE.WRITE,
  },
  {
    name: 'IF Check',
    type: TYPE.PARSE
  },
  {
    name: 'Starter',
    type: TYPE.FLOW,
  },
  {
    name: 'End',
    type: TYPE.TRANSFORM,
  }
];
