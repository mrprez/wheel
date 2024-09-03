class Student {
    key :number;
    classId :number;
    firstname :string;
    lastname :string;
    drawCount :number;

    constructor(key :number, classId :number, firstname :string, lastname :string) {
        this.key = key;
        this.classId = classId;
        this.firstname = firstname.trim();
        this.lastname = lastname.trim();
        this.drawCount = 0;
    }

    copy(): Student {
        const copy = new Student(this.key, this.classId, this.firstname, this.lastname);
        copy.drawCount = this.drawCount;
        return copy;
    }

    draw() {
        const copy = new Student(this.key, this.classId, this.firstname, this.lastname);
        copy.drawCount = this.drawCount + 1;
        return copy;
    }
}

export default Student;