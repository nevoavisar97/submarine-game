

//מחלקת שחקן

export class Player {
    constructor(name, position, target,isComputer) {
        this.name = name;
        this.position = position;
        this.target = target;
        this.isComputer = isComputer;

    }

    setPosition(position) {
        this.position = position;
    }

    getPosition() {
        return this.position;
    }

    getTarget() {
        return this.target;
    }
    getIsComputer(){
        return this.isComputer;
    }


  
}
