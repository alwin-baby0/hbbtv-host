function insertLightningScript() {
  var script = document.createElement('script');
  script.type = 'module';
  script.src = '/src/index.js';
  document.head.appendChild(script);
}
