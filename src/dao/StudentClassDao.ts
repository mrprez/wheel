import Student from "../model/Student";
import StudentClass from "../model/StudentClass";

type StudentJson = {
  id :number;
  classId :number;
  firstname :string;
  lastname :string;
  drawCount :number;
}

type StudentClassJson = {
  id :number;
  name: string;
  deleted: boolean;
}


class StudentClassDao {
  private static CLASSES_KEY = "classes";
  private static STUDENTS_PREFIX = "students_";
  private static STUDENT_MAX_ID_KEY = "student_max_id";





  private listAllClasses(): StudentClass[] {
    const classsesAsString = localStorage.getItem(StudentClassDao.CLASSES_KEY)
    if (!classsesAsString) {
      return [];
    }
    const json = JSON.parse(classsesAsString) as StudentClassJson[];
    return json.map((studentClassJson) => {
      const studentClass = new StudentClass(studentClassJson.id, studentClassJson.name);
      studentClass.deleted = studentClassJson.deleted;
        return studentClass;
    });
  }

  public listClasses(): StudentClass[] {
    return this.listAllClasses().filter(studentClass => !studentClass.deleted);
  }

  public createClass(studentClass :StudentClass): void {
    const classList = this.listAllClasses();
    const idMax = classList.map(studentClass => studentClass.id).reduce((previousId, currentId) => Math.max(previousId, currentId), 0);
    studentClass.id = idMax + 1;
    classList.push(studentClass);
    localStorage.setItem(StudentClassDao.CLASSES_KEY, JSON.stringify(classList));
  }

  public updateClass(updatedStudentClass :StudentClass): void {
    const classList = this.listAllClasses();
    const updatedClassList = classList.map(studentClass => studentClass.id === updatedStudentClass.id ? updatedStudentClass : studentClass);
    localStorage.setItem(StudentClassDao.CLASSES_KEY, JSON.stringify(updatedClassList));
  }

  public deleteClass(classId :number) {
    const classList = this.listAllClasses();
    classList.forEach(studentClass => {
      if (studentClass.id === classId) {
        studentClass.deleted = true;
      }
    });
    localStorage.setItem(StudentClassDao.CLASSES_KEY, JSON.stringify(classList));
  }

  
  public listClassStudents(id :number): Student[] {
    const sudentListAsString = localStorage.getItem(StudentClassDao.STUDENTS_PREFIX + id);
    if (!sudentListAsString) {
      return [];
    }
    const json = JSON.parse(sudentListAsString) as StudentJson[];
    return json.map((studentJson) => {
      const student = new Student(studentJson.id, studentJson.classId, studentJson.firstname, studentJson.lastname)
      student.drawCount = studentJson.drawCount;
      return student;
    });
  }


  public saveStudentList(classId :number, studentList :Student[]) {
    let studentMaxId = parseInt(localStorage.getItem(StudentClassDao.STUDENT_MAX_ID_KEY) || "0");
    studentList.forEach((student) => {
      if (student.id < 0) {
        student.id = ++studentMaxId;
      }
    });
    localStorage.setItem(StudentClassDao.STUDENT_MAX_ID_KEY, studentMaxId.toString());

    localStorage.setItem(StudentClassDao.STUDENTS_PREFIX + classId, JSON.stringify(studentList));
  }

}

const studentClassDao = new StudentClassDao();

export default studentClassDao;
