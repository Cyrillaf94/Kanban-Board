// Note: items in this version are only dragable once you focusout, user-wise it seems more adapted to either edit or drag, and not enter editing when you just want to drag 


const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const itemLists = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('onHold-list');

// Items
let updateOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArray = [];
// Drag Functionality
let draggedItem;
let currentColumn;
let previousColumn;


// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}


function drag(event) {
  draggedItem = event.target;
}

// Column Allows for Item to Drop
function allowDrop(e) {
  e.preventDefault();
}

// Allow Drop
function drop(event) {
event.preventDefault()
 // Remove all background colors
itemLists.forEach((column) => {
column.classList.remove('over');
 });
// Add Item to Column
const parent = itemLists[currentColumn];
parent.appendChild(draggedItem);
// Update Array
updateArrays();
}

// When Iten Enters Column Area
function dragEnter(column) {
  itemLists[column].classList.add('over');
  currentColumn = column;
  }


// Set localStorage Arrays
function updateSavedColumns() {
  // Reinitiate columns
  listArray = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  arrayNames.forEach((item, index) => {
  localStorage.setItem(`${item}Items`, JSON.stringify(listArray[index]));
  })
}

function updateArrays () {
backlogListArray = Array.from(backlogList.children).map(i => i.textContent);
progressListArray = Array.from(progressList.children).map(i => i.textContent);
completeListArray = Array.from(completeList.children).map(i => i.textContent);
onHoldListArray = Array.from(onHoldList.children).map(i => i.textContent);
//Update local Storage
updateSavedColumns();
}


// Add to Column List, Reset Textbox
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  addItems[column].textContent = '';
  const selectedArray = listArray[column];
  selectedArray.push(itemText);
  updateSavedColumns();
  updateDOM();
  console.log(addBtns[column]);
}


// Add Item Input Box
function showInputBox(column) {
console.log("It's Happening");
addBtns[column].style.visibility = 'hidden';
saveItemBtns[column].style.display = 'flex';
addItemContainers[column].style.display = 'flex';
}

// Add Item Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
  }


// FocusOut Event
function updateItem(index, column) {
const previousValue = listArray[column][index];
const newValue = itemLists[column].children[index].textContent;
if (!newValue) {
  listArray[column].splice(index,1);
  itemLists[column].children[index].remove();
} else {listArray[column][index] = itemLists[column].children[index].textContent;}
// Update LocalStorage
updateSavedColumns();
}


// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  if(!item) {}
  else {
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.textContent = item;
  listEl.setAttribute('onclick', "this.contentEditable=true;");
  listEl.setAttribute('onfocusout', `this.contentEditable=false; updateItem(${index}, ${column});`);
  columnEl.appendChild(listEl);}
  }


// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
if(!updateOnLoad) {
  getSavedColumns();
}
  // Backlog Column
backlogList.textContent='';
backlogListArray.forEach((backlogItem, index) => 
createItemEl(backlogList, 0, backlogItem, index));
  // Progress Column
  progressList.textContent='';
  progressListArray.forEach((progressItem, index) => 
  createItemEl(progressList, 1, progressItem, index));
  // Complete Column
  completeList.textContent='';
  completeListArray.forEach((completeItem, index) => 
  createItemEl(completeList, 2, completeItem, index));
  // On Hold Column
  onHoldList.textContent='';
  onHoldListArray.forEach((onHoldItem, index) => 
  createItemEl(onHoldList, 3, onHoldItem, index));
  // Run getSavedColumns only once, Update Local Storage


}

updateDOM();
updateSavedColumns();
