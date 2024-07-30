//פונקצית הערכה לחישוב מרחק לשימוש ב A*
// פונקציה לחישוב מרחק אוקלידי
export function euclideanDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

// אלגוריתם A*
export function aStar(start, goal, grid) {
    const openSet = [start];
    const cameFrom = new Map();

    const gScore = new Map();
    gScore.set(`${start.x},${start.y}`, 0);

    const fScore = new Map();
    fScore.set(`${start.x},${start.y}`, euclideanDistance(start.x, start.y, goal.x, goal.y));

    while (openSet.length > 0) {
        openSet.sort((a, b) => fScore.get(`${a.x},${a.y}`) - fScore.get(`${b.x},${b.y}`));
        const current = openSet.shift();

        if (current.x === goal.x && current.y === goal.y) {
            let path = [];
            let temp = current;
            while (cameFrom.has(`${temp.x},${temp.y}`)) {
                path.push(temp);
                temp = cameFrom.get(`${temp.x},${temp.y}`);
            }
            return path.reverse();
        }

        const neighbors = getNeighbors(current, grid);
        for (const neighbor of neighbors) {
            const tentativeGScore = gScore.get(`${current.x},${current.y}`) + 1;
            if (!gScore.has(`${neighbor.x},${neighbor.y}`) || tentativeGScore < gScore.get(`${neighbor.x},${neighbor.y}`)) {
                cameFrom.set(`${neighbor.x},${neighbor.y}`, current);
                gScore.set(`${neighbor.x},${neighbor.y}`, tentativeGScore);
                fScore.set(`${neighbor.x},${neighbor.y}`, tentativeGScore + euclideanDistance(neighbor.x, neighbor.y, goal.x, goal.y));
                if (!openSet.some(n => n.x === neighbor.x && n.y === neighbor.y)) {
                    openSet.push(neighbor);
                }
            }
        }
    }

    return null; // No path found
}


// פונקצית עזר למציאת שכנים ש A* משתמש בה
function getNeighbors(node, grid) {
    const neighbors = [];
    const directions = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
        { x: 1, y: 1 },
        { x: 1, y: -1 },
        { x: -1, y: 1 },
        { x: -1, y: -1 }
    ];

    for (const dir of directions) {
        const newX = node.x + dir.x;
        const newY = node.y + dir.y;
        if (newX >= 0 && newX < 10 && newY >= 0 && newY < 10 && !grid[newX][newY]) {
            neighbors.push({ x: newX, y: newY });
        }
    }

    return neighbors;
}


