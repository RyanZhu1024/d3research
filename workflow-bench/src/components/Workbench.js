import React, { useRef } from 'react';

const Workbench = ({ className }) => {
  const svgRef = useRef();
  return (
    <div className={className}>
      <svg ref={svgRef} className="w-full h-full"/>
    </div>
  )
}

export default Workbench
