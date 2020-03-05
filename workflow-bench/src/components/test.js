import * as d3 from 'd3';
import shortid from "shortid";

export default () => {

  const stepNodes = [
    { id: shortid.generate(), type: 'step', color: 'green', },
    { id: shortid.generate(), type: 'step', color: 'green', },
    { id: shortid.generate(), type: 'step', color: 'green', },
  ]

  const connectorNodes = [
    { id: shortid.generate(), type: 'input', color: 'red', step: stepNodes[0] },
    { id: shortid.generate(), type: 'input', color: 'red', step: stepNodes[1] },
    { id: shortid.generate(), type: 'input', color: 'red', step: stepNodes[2] },
    { id: shortid.generate(), type: 'output', color: 'blue', step: stepNodes[0] },
    { id: shortid.generate(), type: 'output', color: 'blue', step: stepNodes[1] },
    { id: shortid.generate(), type: 'output', color: 'blue', step: stepNodes[2] },
  ]

  const stepLinks = [
    {
      source: stepNodes[0],
      target: connectorNodes[0],
      distance: 100,
      stroke: 'black',
      strokeWidth: 5,
    },
    {
      source: stepNodes[0],
      target: connectorNodes[3],
      distance: 100,
      stroke: 'black',
      strokeWidth: 5,
    },
    {
      source: stepNodes[1],
      target: connectorNodes[1],
      distance: 100,
      stroke: 'black',
      strokeWidth: 5,
    },
    {
      source: stepNodes[1],
      target: connectorNodes[4],
      distance: 100,
      stroke: 'black',
      strokeWidth: 5,
    },
    {
      source: stepNodes[2],
      target: connectorNodes[2],
      distance: 100,
      stroke: 'black',
      strokeWidth: 5,
    },
    {
      source: stepNodes[2],
      target: connectorNodes[5],
      distance: 100,
      stroke: 'black',
      strokeWidth: 5,
    },
  ]

  let width, height, currentConnector;
  const svg = d3.select("#workbench");

  width = parseFloat(svg.style('width').slice(0, -2));
  height = parseFloat(svg.style('height').slice(0, -2));

  const root = svg.append('g');

  const simulation = d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(function (d) { return d.type === 'step' ? -300 : -100 }))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('link', d3.forceLink().links(stepLinks).distance(function (d) { return d.distance }))
    .nodes([...stepNodes, ...connectorNodes])
    .on('tick', tick);


  const stepLinksGroup = root.append('g')
    .selectAll('line')
    .data(stepLinks)
    .enter()
    .append('line')
    .attr('stroke', function (d) { return d.stroke })
    .attr('stroke-width', function (d) { return d.strokeWidth });

  const stepNodesGroup = root.append('g')
    .selectAll('circle')
    .data([...stepNodes, ...connectorNodes], function (n) { return n.id })
    .enter()
    .append('circle')
    .attr('fill', function (d) { return d.color })
    .attr('class', function (d) { return d.type === 'step' ? 'step' : 'connector' })
    .attr('cursor', 'pointer')
    .attr('r', function (d) { return d.type === 'step' ? 50 : 10 });
  d3.selectAll('.step').call(d3.drag().on('start', dragStarted).on('drag', dragged).on('end', dragEnded));
  d3.selectAll('.connector')
    .on('mousedown', connectorMousedown)
    .on('mouseover', connectorMouseover);

  function connectorMousedown(d) {
    currentConnector = d.step;
    svg.on('mousemove', connectorMousemove)
    svg.on('mouseup', connectorMouseup)
    svg.append('line')
      .attr('id', 'drawline')
      .attr('stoke', 'black')
      .attr('stoke-width', 5)
      .attr('x1', d.x)
      .attr('y1', d.y)
      .attr('x2', d.x)
      .attr('y2', d.y);
  }
  function connectorMouseup() {
    currentConnector = null;
    svg.on('mousemove', null);
    svg.select('#drawline').remove();
  }
  function connectorMouseover(d) {
  }

  function connectorMousemove() {
    svg.select('#drawline').attr('x2', d3.mouse(this)[0]).attr('y2', d3.mouse(this)[1]);
  }

  function tick() {
    stepNodesGroup.attr('cx', function (d) { return d.x }).attr('cy', function (d) { return d.y })
    stepLinksGroup
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
}