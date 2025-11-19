import React from 'react';

function Footer() {
  return (
    <footer className="ocean-surface ocean-shadow ocean-rounded" style={{margin:'1.5rem 0.5rem 0.6rem', padding:'1.1rem 0'}}>
      <div style={{maxWidth:900, margin:'0 auto', color:'#5d6678', textAlign:'center', fontSize:'0.98em'}}>
        &copy; {new Date().getFullYear()} OceanShop Furniture &mdash; Made with <span role="img" aria-label="heart">💙</span> for your home.
      </div>
    </footer>
  );
}
export default Footer;
