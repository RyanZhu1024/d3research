const shortid = require('shortid');

const TYPE = {
  READ, PARSE, TRANSFORM, COPY, FORMAT, WRITE
}

const pipelines = [
  {
    id: shortid.generate(),
    type: TYPE.READ,
    name: 'File Reader',
  },
  {
    id: shortid.generate(),
    type: TYPE.PARSE,
    name: 'CSV Parser',
  },
  {
    id: shortid.generate(),
    type: TYPE.TRANSFORM,
    name: 'Mapper',
  },
  {
    id: shortid.generate(),
    type: TYPE.COPY,
    name: 'Copy',
  },
  {
    id: shortid.generate(),
    type: TYPE.TRANSFORM,
    name: 'Aggregate'
  },
  {
    id: shortid.generate(),
    type: TYPE.TRANSFORM,
    name: 'Mapper 1',
  },
  {
    id: shortid.generate(),
    type: TYPE.TRANSFORM,
    name: 'Join',
  },
  {
    id: shortid.generate(),
    type: TYPE.TRANSFORM,
    name: 'Structure',
  },
  {
    id: shortid.generate(),
    type: TYPE.FORMAT,
    name: 'JSON Formatter',
  },
  {
    id: shortid.generate(),
    type: TYPE.WRITE,
    name: 'File Writer',
  },
  {
    id: shortid.generate(),
    type: TYPE.TRANSFORM,
    name: 'Aggregate 1',
  },
  {
    id: shortid.generate(),
    type: TYPE.TRANSFORM,
    name: 'Mapper 2'
  }
]

const links = [
  { source: pipelines[0], target: pipelines[1] },
  { source: pipelines[1], target: pipelines[2] },
  { source: pipelines[2], target: pipelines[3] },
  { source: pipelines[3], target: pipelines[4] },
  { source: pipelines[4], target: pipelines[5] },
  { source: pipelines[5], taregt: pipelines[6] },
  { source: pipelines[6], target: pipelines[7] },
  { source: pipelines[7], target: pipelines[8] },
  { source: pipelines[8], taregt: pipelines[9] },
  { source: pipelines[3], target: pipelines[10] },
  { source: pipelines[10], taregt: pipelines[11] },
  { source: pipelines[11], taregt: pipelines[6] }
]

console.log('pipelines', pipelines);
console.log('links', links);