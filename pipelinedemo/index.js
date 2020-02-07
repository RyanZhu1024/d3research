import shortid from "shortid";
import * as d3 from "d3";
import "./styles.css";
const TYPE = {
  READ: {
    name: "read", color: '#16af11', data: {
      shape: 'polygon',
      shapeKey: 'points',
      shapeValue: '13.7376816 -1.13686838e-13 62 -1.10044352e-13 48.5884438 64 8.81072992e-13 64'
    }
  },
  PARSE: {
    name: "parse", color: '#FECD01', data: {
      shape: 'polygon',
      shapeKey: 'points',
      shapeValue: '67.1111111 1.10134124e-13 99.5534668 64 34.9741211 64'
    }
  },
  TRANSFORM: {
    name: "transform", color: '#4c4cfc', data: {
      shape: 'polygon',
      shapeKey: 'points',
      shapeValue: '0.5 -2.5243549e-29 62.5 1.13686838e-13 62.5 64 0.5 64'
    }
  },
  FLOW: {
    name: "flow", color: '#06c8c9', data: {
      shape: 'polygon',
      shapeKey: 'points',
      shapeValue: '10.1923882 9.372583 55.0936688 9.4713024 55.4472222 54.627417 10.2825028 54.2824683'
    }
  },
  FORMAT: {
    name: "format", color: '#ffdbac', data: {
      shape: 'path',
      shapeKey: 'd',
      shapeValue: 'M41,0 L103.053467,0 C103.053467,31.7568359 103.053467,47.6352539 103.053467,47.6352539 C68.9863281,42.627417 81.5400391,73.1982422 41,60.9418945 C41,60.9418945 41,40.6279297 41,0 Z'
    }
  },
  WRITE: {
    name: "write", color: '#d581d9', data: {
      shape: 'path',
      shapeKey: 'd',
      shapeValue: 'M102.465187,0 C102.465187,0 54.0915693,0 54.0915693,0 C36.5241674,17.0163039 35.6392161,47.2629566 53.2066179,64 C53.2066179,64 102.465187,63.8647624 102.465187,63.8647624 C87.2510825,47.1763573 87.2510825,16.6337554 102.465187,0 Z'
    }
  }
};

const pipelineNodes = [
  {
    id: shortid.generate(),
    type: TYPE.READ,
    name: "File Reader",
  },
  {
    id: shortid.generate(),
    type: TYPE.PARSE,
    name: "CSV Parser",
  },
  {
    id: shortid.generate(),
    type: TYPE.TRANSFORM,
    name: "Mapper",
  },
  {
    id: shortid.generate(),
    type: TYPE.FLOW,
    name: "Copy",
  },
  {
    id: shortid.generate(),
    type: TYPE.TRANSFORM,
    name: "Aggregate"
  },
  {
    id: shortid.generate(),
    type: TYPE.TRANSFORM,
    name: "Mapper 1"
  },
  {
    id: shortid.generate(),
    type: TYPE.TRANSFORM,
    name: "Join"
  },
  {
    id: shortid.generate(),
    type: TYPE.TRANSFORM,
    name: "Structure"
  },
  {
    id: shortid.generate(),
    type: TYPE.FORMAT,
    name: "JSON Formatter"
  },
  {
    id: shortid.generate(),
    type: TYPE.WRITE,
    name: "File Writer"
  },
  {
    id: shortid.generate(),
    type: TYPE.TRANSFORM,
    name: "Aggregate 1"
  },
  {
    id: shortid.generate(),
    type: TYPE.TRANSFORM,
    name: "Mapper 2"
  }
];

const pipelineLinks = [
  { source: pipelineNodes[0], target: pipelineNodes[1] },
  { source: pipelineNodes[1], target: pipelineNodes[2] },
  { source: pipelineNodes[2], target: pipelineNodes[3] },
  { source: pipelineNodes[3], target: pipelineNodes[4] },
  { source: pipelineNodes[4], target: pipelineNodes[5] },
  { source: pipelineNodes[5], target: pipelineNodes[6] },
  { source: pipelineNodes[6], target: pipelineNodes[7] },
  { source: pipelineNodes[7], target: pipelineNodes[8] },
  { source: pipelineNodes[8], target: pipelineNodes[9] },
  { source: pipelineNodes[3], target: pipelineNodes[10] },
  { source: pipelineNodes[10], target: pipelineNodes[11] },
  { source: pipelineNodes[11], target: pipelineNodes[6] }
];

const width = window.innerWidth,
  height = window.innerHeight;
const svg = d3
  .select("#app")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const root = svg.append("g");
const zoomed = function () { root.attr("transform", d3.event.transform); }
svg.call(
  d3
    .zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([-8, 8])
    .on("zoom", zoomed)
);

const simulation = d3
  .forceSimulation()
  .force("link", d3.forceLink().links(pipelineLinks).id(d => d.id))
  .force('collide', d3.forceCollide(function (d) { return d.r + 9 }).iterations(16))
  .force("charge", d3.forceManyBody().strength(-200))
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force('y', d3.forceY(0))
  .force('x', d3.forceX(0))
  .nodes(pipelineNodes).on('tick', tick);
const linksGroup = root
  .append("g")
  .attr("class", "linksGroup")
  .selectAll("line")
  .data(pipelineLinks)
  .enter()
  .append("line")
  .attr("stroke", "black");
const nodesGroup = root
  .append("g")
  .attr("class", "nodesGroup")
  .selectAll(function (d) { return d.type.shape })
  .data(pipelineNodes)
  .enter()
  .append(function (d) { return d.type.shape })
  .attr(function (d) { return d.type.shapeKey }, function (d) { return d.type.shapeValue })
  .attr("r", 10)
  .attr('fill', function (d) { return d.type.color })
  .call(
    d3
      .drag()
      .on("start", dragStarted)
      .on("drag", dragged)
      .on("end", dragEnded)
  );
function dragStarted(d) {
  if (!d3.event.active) {
    simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
}
function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}
function dragEnded(d) {
  if (!d3.event.active) {
    simulation.alphaTarget(0);
  }
  d.fx = null;
  d.fy = null;
}

function tick() {
  linksGroup
    .attr("x1", function (d) {
      return d.source.x;
    })
    .attr("y1", function (d) {
      return d.source.y;
    })
    .attr("x2", function (d) {
      return d.target.x;
    })
    .attr("y2", function (d) {
      return d.target.y;
    });
  nodesGroup.attr('transform', function (d) { return `translate(${d.x}, ${d.y})` })
};