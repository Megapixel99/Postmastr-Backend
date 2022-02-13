function hideRows(tr, filter = "", min = 0, max = 5) {
  let rows = [];
  for (let i = 1; i < tr.length; i++) {
    tr[i].style.display = "none";
    let tds = tr[i].getElementsByTagName("td");
    if (tds) {
      for (let j = 0; j < tds.length; j++) {
        if (tds[j]) {
          txtValue = tds[j].textContent || tds[j].innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            rows.push(tr[i]);
            break;
          }
        }
      }
    }
  }
  if (max > rows.length) {
    max = rows.length;
  }
  for (let i = min; i < max; i++) {
    if (rows[i]) {
      rows[i].style.display = "";
    }
  }
  let tablePages = document.getElementById('table-pages');
  tablePages.innerHTML = "";
  tablePages.innerHTML += `<li class="page-item">
    <a class="page-link" onclick="changeTablePage(this)">
      <i class="fas fa-angle-left"></i>
      <span class="sr-only">Previous</span>
    </a>`;
  for (let i = 0; i < (rows.length / 5); i++) {
    if (i === 0) {
      tablePages.innerHTML += `<li class="page-item active">
        <a class="page-link" id="page-link-${i + 1}" onclick="changeTablePage(this)">${i + 1}</a>
      </li>`
    } else {
      tablePages.innerHTML += `<li class="page-item">
        <a class="page-link" id="page-link-${i + 1}" onclick="changeTablePage(this)">${i + 1}</a>
      </li>`
    }
  }
  tablePages.innerHTML += `<li class="page-item">
    <a class="page-link" onclick="changeTablePage(this)">
      <i class="fas fa-angle-right"></i>
      <span class="sr-only">Next</span>
    </a>
  </li>`;
}
function changeTablePage(elem) {
  let min;
  let max;
  let num = 0;
  let pageItems = document.getElementsByClassName('page-item');
  let node = document.getElementsByClassName('page-item active')[0].querySelector('.page-link');
  if (pageItems[1].querySelector('.page-link').isEqualNode(node) && pageItems[0].querySelector('.page-link').isEqualNode(elem)) {
    return;
  }else if (pageItems[pageItems.length - 2].querySelector('.page-link').isEqualNode(node) && pageItems[pageItems.length - 1].querySelector('.page-link').isEqualNode(elem)) {
    return;
  }
  if (Number(elem.innerHTML)) {
    min = Math.floor((Number(elem.innerHTML) - 1) * 5);
    max = Math.floor(Number(elem.innerHTML) * 5);
  } else {
    let item = elem;
    elem = document.getElementsByClassName('page-item active')[0].querySelector('.page-link');
    if (pageItems[0].querySelector('.page-link').isEqualNode(item)) {
      num = -1;
    } else if (pageItems[pageItems.length - 1].querySelector('.page-link').isEqualNode(item)) {
      num = 1;
    }
    min = Math.floor((Number(elem.innerHTML) + num - 1) * 5);
    max = Math.floor((Number(elem.innerHTML) + num) * 5);
  }
  tr = table.getElementsByTagName("tr");

  hideRows(tr, document.getElementById('search').value.toUpperCase(), min, max)

  for (let i = 0; i < pageItems.length; i++) {
    pageItems[i].className = "page-item";
  }
  pageItems[Number(elem.innerHTML) + num].className = "page-item active";
}
function tableLookup(input) {
  let filter, tr, td, txtValue;
  filter = input.value.toUpperCase();
  table = document.getElementById('table')
  tr = table.getElementsByTagName("tr");

  hideRows(tr, filter)
}
