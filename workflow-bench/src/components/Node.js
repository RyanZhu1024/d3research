import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../data/dragTypes';

const shapesMap = {
  reader: <circle r={50} cx={75} cy={75} stroke="blue" fill="blue" />,
  writer: <rect height={75} width={75} x={75} y={75} stroke="black" fill="black" />,
  if: <rect height={75} width={75} x={75} y={75} stroke="orange" fill="orange" />,
  start: <circle r={50} cx={75} cy={75} stroke="green" fill="green" />,
  end: <circle r={50} cx={75} cy={75} stroke="red" fill="red" />,
}

const Node = ({ node }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.WORKFLOW_NODE, node },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  })
  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, }}>
      <svg width="100%">
        <g >
          <path d={node.type.shapeValue} fill={node.type.color} cursor="pointer" />
        </g>
      </svg>
    </div>
  )
}

export default Node
