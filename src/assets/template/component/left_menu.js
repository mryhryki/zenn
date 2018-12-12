var leftContent = document.getElementById('left-content');
if (leftContent != null) {
  var headers = [];
  document.querySelectorAll('h2').forEach(function(header) {
    headers.push('<div><a href="#' + header.id + '">' + header.textContent + '</a></div>');
  });
  leftContent.innerHTML = headers.join('');
}
