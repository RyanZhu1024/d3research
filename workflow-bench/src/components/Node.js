import React from 'react';

const shapesMap = {
  reader: <circle r={50} cx={75} cy={75} stroke="blue" fill="none" />,
  writer: <rect height={75} width={75} x={75} y={75} stroke="black" fill="none" />,
  if: <rect height={75} width={75} x={75} y={75} stroke="orange" fill="none" />,
  start: <circle r={50} cx={75} cy={75} stroke="green" fill="green" />,
  end: <circle r={50} cx={75} cy={75} stroke="red" fill="red" />,
}

const Node = ({ node }) => {
  return (
    <div>
      <svg width="100%">
        {
          shapesMap[node.type]
        }
      </svg>
    </div>
  )
}

export default Node
