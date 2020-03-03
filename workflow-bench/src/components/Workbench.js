import React, { useEffect } from 'react';
import shortid from "shortid";
import { times } from 'lodash';
import { ItemTypes } from '../data/dragTypes';
import * as d3 from 'd3';
import { useDrop } from 'react-dnd'

const pipelineNodes = [
  createNewNode({
    name: 'Salesforce Reader',
    type: TYPE.READ,
  })
];

const pipelineLinks = [
];

let linksGroup = null;

let nodesGroup = null;

let labelsGroup = null;

let simulation = null;

let ringsGroup = null;

let connectorGroup = null;

let width = 0;

let height = 0;

const nodesSimulation = [];

function init() {
  const svg = d3
    .select("#workbench")
  width = parseFloat(svg.style('width').slice(0, -2));
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

  simulation = d3
    .forceSimulation()
    .force("link", d3.forceLink().links(pipelineLinks).distance(300).strength(0.5))
    .force('collide', d3.forceCollide(function (d) { return d.r + 9 }).iterations(16))
    .force("charge", d3.forceManyBody().strength(-500))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force('y', d3.forceY(0))
    .force('x', d3.forceX(0))
    .nodes(pipelineNodes).on('tick', tick);
  ringsGroup = root
    .append('g')
    .attr('class', 'ringsGroup')
    .selectAll('circle');
  linksGroup = root
    .append("g")
    .attr("class", "linksGroup")
    .selectAll("line");

  nodesGroup = root
    .append("g")
    .attr("class", "nodesGroup")
    .selectAll('path');

  labelsGroup = root
    .append('g')
    .attr('class', 'textsGroup')
    .selectAll('text');
  initNodes();
}

const handleRingMouseDown = (d) => {
  console.log('clicked on rings' + d);
}

function initNodes() {
  pipelineNodes.forEach(node => {
    const inputOutputNodes = [
      ...times(node.type.input, () => {
        return {
          id: shortid.generate(),
          type: 'input',
        }
      }),
      ...times(node.type.output, () => {
        return {
          id: shortid.generate(),
          type: 'output',
        }
      }),
    ];
    const inputOutputLinks = inputOutputNodes.map(n => ({
      source: n,
      target: node,
    }));
    const nodeSim = d3
      .forceSimulation()
      .force("link", d3.forceLink().links(inputOutputLinks).distance(300).strength(0.5))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(node.x, node.y))
      .nodes([inputOutputNodes, node]).on('tick', connectorTick);
    nodesSimulation.push(nodeSim);
    connectorGroup = root
      .append('g')
      .attr('class', 'connectorGroup')
      .selectAll('circle')
      .data(inputOutputNodes)
      .enter()
      .append('curcle')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('fill', function (d) { return d.type === 'input' ? 'green' : 'red' });
  });
}

const connectorTick = () => {
  connectorGroup.attr('cx', function (d) { return d.x }).attr('cy', function (d) { return d.y });
}



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
  // update ring group
  ringsGroup = ringsGroup.data(pipelineNodes, function (d) { return d.id });
  ringsGroup.exit().remove();
  ringsGroup = ringsGroup.enter()
    .append('circle')
    .attr('stroke', 'blue')
    .attr('stroke-width', 1)
    .attr('fill', 'none')
    .attr('cursor', 'pointer')
    .attr('r', 40)
    .on('mousedown', handleRingMouseDown)
    .merge(ringsGroup);
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
  ringsGroup.attr('cx', function (d) { return d.x }).attr('cy', function (d) { return d.y });
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

const createNewNode = ({ node }) => {
  console.log(node);
  const newNode = {
    id: shortid.generate(),
    type: node.type,
    name: `Snap ${node.name}`,
    x: width / 2,
    y: height / 2,
  }
  pipelineNodes.push(newNode);
  update();
}

const Workbench = ({ className }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.WORKFLOW_NODE,
    drop: (item) => createNewNode(item),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  })
  useEffect(() => {
    init();
    update();
  }, []);
  console.log('render bench');
  return (
    <div className={className}>
      <svg ref={drop} id="workbench" className="w-full h-full" />
    </div>
  )
}

export default Workbench
