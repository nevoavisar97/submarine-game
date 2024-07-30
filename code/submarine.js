
//מחלקת צוללת
export class Submarine {
    static counter = 0; 

    constructor(position, size) {
        this.id=Submarine.counter++; // הגדרת ID שונה לכל צוללת
        this.position = position;
        this.size = size;
        this.hasMoved = false; // תכונה לציון אם הצוללת הוזזה בעבר
    }

    getPosition() {
        return this.position;
    }

    setPosition(position) {
        this.position = position;
    }

    getSize() {
        return this.size;
    }
    static resetCounter() {
        Submarine.counter = 0;
    }

}
