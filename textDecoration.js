const canvas = document.getElementById('canvas');
const addTextBtn = document.getElementById('addText');
const undoBtn = document.getElementById('undoBtn');

const redoBtn = document.getElementById('redoBtn');

const fontSizeSelect = document.getElementById('fontSize');
const fontStyleSelect = document.getElementById('fontStyle');
const textDecorationSelect = document.getElementById('textDecoration');
const textColorInput = document.getElementById('textColor');


let selectedTextBox = null;
let actions = []; 
let undoneActions = []; 

// Add text box to the blank page
addTextBtn.addEventListener('click', () => {
  const textBox = document.createElement('div');
  textBox.contentEditable = true;
  textBox.className = 'text-box editing'; // Add class to remove border while typing
  textBox.style.top = '50px';

  textBox.style.left = '50px';
  textBox.innerText = 'Edit Me';

  // For Enable Text dragging
  textBox.addEventListener('mousedown', (e) => {
    selectedTextBox = textBox;
    const rect = canvas.getBoundingClientRect();
    const shiftX = e.clientX - textBox.getBoundingClientRect().left;

    const shiftY = e.clientY - textBox.getBoundingClientRect().top;

    const moveAt = (pageX, pageY) => {
      textBox.style.left = pageX - rect.left - shiftX + 'px';

      textBox.style.top = pageY - rect.top - shiftY + 'px';
    };

    const onMouseMove = (event) => moveAt(event.pageX, event.pageY);

    document.addEventListener('mousemove', onMouseMove);

    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', onMouseMove);
    }, { once: true });
  });

  // Add the text box to the blank page
  canvas.appendChild(textBox);

  // Save the action (add text box)
  actions.push({ type: 'add', element: textBox });
  undoneActions = [];
});

// Undo action Code
undoBtn.addEventListener('click', () => {
  if (actions.length === 0) return;
  const lastAction = actions.pop();
  undoneActions.push(lastAction);
  
  if (lastAction.type === 'add') {
    canvas.removeChild(lastAction.element);
  }
});

// Redo action Code
redoBtn.addEventListener('click', () => {
  if (undoneActions.length === 0) return;
  const lastUndoneAction = undoneActions.pop();
  actions.push(lastUndoneAction);
  
  if (lastUndoneAction.type === 'add') {
    canvas.appendChild(lastUndoneAction.element);
  }
});

// Change font size of the selected Font
fontSizeSelect.addEventListener('change', () => {
  if (selectedTextBox) {
    selectedTextBox.style.fontSize = fontSizeSelect.value;
    saveAction('resize', selectedTextBox);
  }
});

// Change font style of the selected Font
fontStyleSelect.addEventListener('change', () => {
  if (selectedTextBox) {
    selectedTextBox.style.fontFamily = fontStyleSelect.value;
    saveAction('fontStyle', selectedTextBox);
  }
});

// Change text decoration of the selected Font
textDecorationSelect.addEventListener('change', () => {
  if (selectedTextBox) {
    selectedTextBox.style.textDecoration = textDecorationSelect.value;
    saveAction('textDecoration', selectedTextBox);
  }
});


// Some Additional Features Change text color
textColorInput.addEventListener('input', () => {
    if (selectedTextBox) {
      selectedTextBox.style.color = textColorInput.value;
      saveAction('textColor', selectedTextBox);
    }
  });
  
 

// Function to save action for undo/redo
function saveAction(type, element) {
  actions.push({ type, element });
  undoneActions = [];
}
