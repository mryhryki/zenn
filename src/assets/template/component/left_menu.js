var headers = [];
document.querySelectorAll('h2').forEach(function(header) {
  headers.push('<div><a href="#' + header.id + '">' + header.textContent + '</a></div>');
});
document.getElementById('left-content').innerHTML = headers.join('');
