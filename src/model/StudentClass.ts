class StudentClass {
    id :number;
    name: string;
    deleted: boolean;

    constructor(id :number, name :string) {
        this.id = id;
        this.name = name;
        this.deleted = false;
    }    

}

export default StudentClass;
