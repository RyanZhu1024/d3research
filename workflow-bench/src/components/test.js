import * as d3 from 'd3';
import shortid from "shortid";

const stepNodes = [
  { id: shortid.generate() },
  { id: shortid.generate() },
  { id: shortid.generate() },
  { id: shortid.generate() },
  { id: shortid.generate() },
  { id: shortid.generate() },
  { id: shortid.generate() },
]

let width, height;
const svg = d3.select("#workbench");

width = parseFloat(svg.style('width').slice(0, -2));
height = parseFloat(svg.style('height').slice(0, -2));

const root = svg.append('g');

const simulation = d3.forceSimulation()
  .force('charge', d3.forceManyBody().strength(-300))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .nodes(stepNodes)
  .on('tick', tick);

const stepNodesGroup = root.append('g')
  .selectAll('circle')
  .data(stepNodes, function(n){return n.id})
  .enter()
  .append('circle')
  .attr('fill', 'green')
  .attr('r', 50)

function tick() {

}
