import React from 'react';

// Simplified static filters for demonstration
function Filters() {
  return (
    <form aria-label="Filter products" style={{display: 'flex', flexDirection:'column', gap:'1.1em'}}>
      <div>
        <strong>Category</strong>
        <div>
          <label><input type="checkbox" /> Chairs</label><br/>
          <label><input type="checkbox" /> Sofas</label><br/>
          <label><input type="checkbox" /> Tables</label>
        </div>
      </div>
      <div>
        <strong>Material</strong>
        <div>
          <label><input type="checkbox" /> Oak</label><br/>
          <label><input type="checkbox" /> Velvet</label><br/>
          <label><input type="checkbox" /> Rattan</label>
        </div>
      </div>
      <div>
        <strong>Price</strong>
        <div>
          <input type="range" min="0" max="1000" style={{width:'100%'}}/>
        </div>
      </div>
      <div>
        <strong>Rating</strong>
        <div>
          <label><input type="checkbox" /> 4+ stars</label>
        </div>
      </div>
    </form>
  );
}
export default Filters;
