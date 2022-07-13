function addScript(srcJS, srcStyle){
  var script = document.createElement('script');
  var styles = document.createElement('link');
  styles.href = srcStyle
  script.src = srcJS;
  script.async = true; // чтобы гарантировать порядок
  const div = document.createElement('div');
  div.className = 'widget-container';
  document.body.appendChild(div);
  document.body.appendChild(styles)
  document.body.appendChild(script);
}

addScript('/Users/okibolat/Documents/projects/Fullstack/server/mods/index.js', '/Users/okibolat/Documents/projects/Fullstack/server/mods/index.css')
