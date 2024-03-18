const WeatherState = {
  WHITE: "ocean",
  BLACK: "black",
  BLUE: "blue",
  MOUNTAIN:"grey",
  SNOW: "snow",
};

// Grid size
const gridSize = 160;

// Create a 2D array to represent the grid
const grid = Array.from({
    length: gridSize
  }, () =>
  Array.from({
    length: gridSize
  }, () => WeatherState.WHITE)
);

// Function to get a valid index within the grid boundaries
function getValidIndex(index, size) {
  return Math.max(0, Math.min(size - 1, index));
}

// Function to access a specific cell in the grid
function getCell(x, y) {
  const validX = getValidIndex(x, gridSize);
  const validY = getValidIndex(y, gridSize);
  return grid[validY][validX];
}

// Function to set the state of a specific cell in the grid
function setCell(x, y, state) {
  const validX = getValidIndex(x, gridSize);
  const validY = getValidIndex(y, gridSize);
  grid[validY][validX] = state;
}

function initializeGrid() {
  const weatherProbabilities = {
    [WeatherState.WHITE]: 0.45, // 45% chance
    [WeatherState.BLACK]: 0.55, // 55% chance
    [WeatherState.BLUE]: 0.0, // 0% chance
    [WeatherState.MOUNTAIN]: 0.0, // 0% chance
    [WeatherState.SNOW]: 0.0, // 0% chance
  };

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const randomValue = Math.random();
      let cumulativeProbability = 0;

      for (const state in weatherProbabilities) {
        cumulativeProbability += weatherProbabilities[state];
        if (randomValue < cumulativeProbability) {
          setCell(x, y, state);
          break; // Stop iterating after finding the state
        }
      }
    }
  }
}


function updateCell(x, y) {
  const currentState = getCell(x, y);
  let newState = currentState;

  // Count the occurrences of each weather state around the cell
  const stateCounts = {
    [WeatherState.WHITE]: 0,
    [WeatherState.BLACK]: 0,
    [WeatherState.BLUE]: 0,
    [WeatherState.MOUNTAIN]: 0,
    [WeatherState.SNOW]: 0,
   };

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue; // Skip the current cell

      const neighborX = x + dx;
      const neighborY = y + dy;
      const neighborState = getCell(neighborX, neighborY);
      stateCounts[neighborState]++;
    }
  }
 
  // Apply transition rules based on current state and surroundings
  switch (currentState) {
  	case WeatherState.SNOW:
    	if (stateCounts[WeatherState.MOUNTAIN] > 0) {
       newState = WeatherState.SNOW;
      }
      if (stateCounts[WeatherState.SNOW] < 1 &&
      		stateCounts[WeatherState.WHITE] > 0) {
      	newState = WeatherState.WHITE;
      }
      if (stateCounts[WeatherState.BLACK] > 1) {
       newState = WeatherState.MOUNTAIN;
      }
    break;
    
  	case WeatherState.MOUNTAIN:
    	if (stateCounts[WeatherState.WHITE] > 0) {
      	newState = WeatherState.BLACK;
      }  else {
      	newState = WeatherState.MOUNTAIN;
      }
      if (stateCounts[WeatherState.MOUNTAIN] > 3 &&
      		(getCell(x + 4, y + 4) == WeatherState.MOUNTAIN ||
           getCell(x + 4, y + 4) == WeatherState.SNOW) &&
          (getCell(x + 4, y - 4) == WeatherState.MOUNTAIN ||
           getCell(x + 4, y - 4) == WeatherState.SNOW) &&
          (getCell(x - 4, y + 4) == WeatherState.MOUNTAIN ||
           getCell(x - 4, y + 4) == WeatherState.SNOW) &&
          (getCell(x - 4, y - 4) == WeatherState.MOUNTAIN ||
           getCell(x - 4, y - 4) == WeatherState.SNOW) &&
           stateCounts[WeatherState.BLACK] < 1) {
      	newState = WeatherState.SNOW;
      } else {
      	newState = WeatherState.MOUNTAIN;
      }
      if (stateCounts[WeatherState.WHITE] > 0) {
      	newState = WeatherState.BLACK;
      }
    break;
    case WeatherState.WHITE:
     if (stateCounts[WeatherState.BLACK] > stateCounts[WeatherState.WHITE]) {
     	newState = WeatherState.BLACK;
     }
     if (stateCounts[WeatherState.WHITE] > stateCounts[WeatherState.BLACK]) {
     	newState = WeatherState.WHITE;
     }
     if (stateCounts[WeatherState.WHITE] > 1 &&
         stateCounts[WeatherState.BLACK] > 1) {
     	newState = WeatherState.BLUE;
     }
     if (stateCounts[WeatherState.BLACK] == 0 && 
     		 stateCounts[WeatherState.BLUE] == 0) {
     	newState = WeatherState.BLUE;
     }
     if (stateCounts[WeatherState.MOUNTAIN] > 3) {
     	newState = WeatherState.MOUNTAIN;
     }
      break;
    case WeatherState.BLACK:
      if (stateCounts[WeatherState.BLACK] > stateCounts[WeatherState.WHITE]) {
     	newState = WeatherState.BLACK;
     }
     if (stateCounts[WeatherState.WHITE] > stateCounts[WeatherState.BLACK]) {
     	newState = WeatherState.WHITE;
     }
     if (stateCounts[WeatherState.WHITE] > 1 &&
         stateCounts[WeatherState.BLACK] > 1) {
     	 newState = WeatherState.BLUE;
     }
     if ((getCell(x, y + 7) == WeatherState.BLACK ||
     			getCell(x, y + 7) == WeatherState.MOUNTAIN) &&
         (getCell(x, y - 7) == WeatherState.BLACK ||
     			getCell(x, y - 7) == WeatherState.MOUNTAIN) &&
         (getCell(x + 7, y) == WeatherState.BLACK ||
     			getCell(x + 7, y) == WeatherState.MOUNTAIN) &&
         (getCell(x - 7, y) == WeatherState.BLACK ||
     			getCell(x - 7, y) == WeatherState.MOUNTAIN) &&
          stateCounts[WeatherState.BLUE] == 0) {
     	newState = WeatherState.MOUNTAIN;
     }
     if (stateCounts[WeatherState.BLACK] < 1) {
     	newState = WeatherState.SNOW;
     }
     break;
    case WeatherState.BLUE:
     	if (stateCounts[WeatherState.BLACK] > stateCounts[WeatherState.WHITE]) {
     	newState = WeatherState.BLACK;
     }
     if (stateCounts[WeatherState.WHITE] > stateCounts[WeatherState.BLACK]) {
     	newState = WeatherState.WHITE;
     }
     if (stateCounts[WeatherState.WHITE] > 1 &&
         stateCounts[WeatherState.BLACK] > 1) {
     	newState = WeatherState.BLUE;
     }
     break;
    }
  setCell(x, y, newState);
}


// Initialize the grid with random weather
initializeGrid();

const gridContainer = document.getElementById("grid-container");

function updateDisplay() {
  gridContainer.innerHTML = ""; // Clear the container before adding new cells
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.classList.add(grid[y][x]); // Add class based on weather state
      gridContainer.appendChild(cell);
    }
  }
}
// Function to update the entire grid
function updateGrid() {
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      updateCell(x, y);
    }
  }
}

// Update the grid and display every 2 seconds
setInterval(() => {
  updateGrid();
  updateDisplay();
}, 500);
