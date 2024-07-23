class Student {
    key :number;
    classId :number;
    firstname: string;
    lastname: string;

    constructor(key :number, classId :number, firstname :string, lastname :string) {
        this.key = key;
        this.classId = classId;
        this.firstname = firstname.trim();
        this.lastname = lastname.trim();
    }    

}

export default Student;