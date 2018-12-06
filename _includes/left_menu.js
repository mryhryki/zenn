var headers = document.querySelectorAll('h2');

var menuList = [];
headers.forEach((header) => {
  menuList.push({ id: header.id, title: header.textContent });
});
var listItems = menuList.map(function(menu) {
  return ('<div><a href="#' + menu.id + '">' + menu.title + '</a></div>');
});

document.getElementById('left-content').innerHTML = ('<ul>' + listItems.join('') + '</ul>');
