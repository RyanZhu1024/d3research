import shortid from "shortid";
import { sample } from 'lodash/collection';
import * as d3 from "d3";
import "./styles.css";
const TYPE = {
  READ: {
    name: "read", color: '#16af11',
    shapeValue: 'm -9,-17 26,0 -7,34 -27,0 z'
  },
  PARSE: {
    name: "parse", color: '#FECD01',
    shapeValue: 'm 0,-17 17,34 -34,0 z'

  },
  TRANSFORM: {
    name: "transform", color: '#4c4cfc',
    shapeValue: 'm -16,-16 32,0 0,32 -32,0 z'

  },
  FLOW: {
    name: "flow", color: '#06c8c9',
    shapeValue: 'm 0,-17 17,17 -17,17 -17,-17 17,-17 z'

  },
  FORMAT: {
    name: "format", color: '#ffdbac',
    shapeValue: 'm -17,-17 34,0 0,26 C -4,8 5,21 -17,16 z'

  },
  WRITE: {
    name: "write", color: '#d581d9',
    shapeValue: 'm -11,-17 28,0 c 0,0 -6,7 -6,17 0,10 6,17 6,17 l -28,0 c 0,0 -6,-7 -6,-17 0,-10 6,-17 6,-17 z'
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


const svg = d3
  .select("#app")
const width = parseFloat(svg.style('width').slice(0, -2)),
  height = parseFloat(svg.style('height').slice(0, -2));

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
  .force("link", d3.forceLink().links(pipelineLinks).distance(500).strength(0.5))
  .force('collide', d3.forceCollide(function (d) { return d.r + 9 }).iterations(16))
  // .force("charge", d3.forceManyBody().strength(-300))
  // .force("center", d3.forceCenter(width / 2, height / 2))
  // .force('y', d3.forceY(0))
  // .force('x', d3.forceX(0))
  .nodes(pipelineNodes).on('tick', tick);
let linksGroup = root
  .append("g")
  .attr("class", "linksGroup")
  .selectAll("line");

let nodesGroup = root
  .append("g")
  .attr("class", "nodesGroup")
  .selectAll('path');

let labelsGroup = root
  .append('g')
  .attr('class', 'textsGroup')
  .selectAll('text');

const update = () => {
  // update link
  linksGroup = linksGroup.data(pipelineLinks, function (d) { return `${d.source.id}-${d.target.id}` });
  linksGroup.exit().remove();
  linksGroup = linksGroup.enter()
    .append("line")
    .attr("stroke", "black")
    .merge(linksGroup);
  // update nodes group
  nodesGroup = nodesGroup.data(pipelineNodes, function (d) { return d.id });
  nodesGroup.exit().remove();
  nodesGroup = nodesGroup.enter()
    .append('path')
    .attr('d', function (d) { return d.type.shapeValue })
    .attr('fill', function (d) { return d.type.color })
    .attr('cursor', 'pointer')
    .on('click', onClickNode)
    .call(
      d3
        .drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded)
    )
    .merge(nodesGroup);
  // update labels group
  labelsGroup = labelsGroup.data(pipelineNodes);
  labelsGroup.exit().remove();
  labelsGroup = labelsGroup.enter()
    .append('text')
    .text(function (d) { return d.name })
    .attr('font-size', '10px')
    .attr('fill', 'red')
    .merge(labelsGroup);
  simulation.nodes(pipelineNodes);
  simulation.force('link').links(pipelineLinks);
  simulation.alpha(1).restart();
}
// run
update();

function onClickNode(d) {
  alert(`You select ${d.name}`)
}
function dragStarted(d) {
  if (!d3.event.active) {
    simulation.alphaTarget(0.8).restart();
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
  labelsGroup.attr('x', function (d) { return d.x + 20 }).attr('y', function (d) { return d.y })
};
d3.select('#addSnap').on('click', () => {
  const type = sample(Object.values(TYPE));
  const newNode = {
    id: shortid.generate(),
    type: TYPE.READ,
    name: `Snap ${type.name}`,
    x: width / 2,
    y: height / 2,
  }
  pipelineNodes.push(newNode);
  update();
});
