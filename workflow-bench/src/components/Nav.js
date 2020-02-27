import React from 'react';
import Node from './Node';
import nodes from '../data/nodes';

const Nav = ({ className }) => {
  return (
    <div className={className}>
      <h1 className="text-2xl">Choose a snap</h1>
      <div className="grid grid-rows-5 grid-flow-col gap-4">
        {
          nodes.map(node => <Node key={node.name} node={node} />)
        }
      </div>
    </div>
  )
}

export default Nav
