import Student from "../model/Student";
import StudentClass from "../model/StudentClass";

class StudentClassDao {
  private static CLASSES_KEY = "classes";
  private static STUDENTS_PREFIX = "students_";
  private static STUDENT_MAX_ID_KEY = "student_max_id";

  public listClasses(): StudentClass[] {
    const classsesAsString = localStorage.getItem(StudentClassDao.CLASSES_KEY)
    
    if (!classsesAsString) {
      return [];
    }
    return JSON.parse(classsesAsString) as StudentClass[];
  }

  public createClass(studentClass :StudentClass): void {
    const classList = this.listClasses();
    const idMax = classList.map(studentClass => studentClass.id).reduce((previousId, currentId) => Math.max(previousId, currentId), 0);
    studentClass.id = idMax + 1;
    classList.push(studentClass);
    localStorage.setItem(StudentClassDao.CLASSES_KEY, JSON.stringify(classList));
  }

  
  public listClassStudents(id :number): Student[] {
    const sudentListAsString = localStorage.getItem(StudentClassDao.STUDENTS_PREFIX + id);
    if (!sudentListAsString) {
      return [];
    }
    return JSON.parse(sudentListAsString) as Student[];
  }


  public saveStudentList(classId :number, studentList :Student[]) {
    let studentMaxId = parseInt(localStorage.getItem(StudentClassDao.STUDENT_MAX_ID_KEY) || "0");
    studentList.forEach((student) => {
      if (student.key === 0) {
        student.key = ++studentMaxId;
      }
    });
    localStorage.setItem(StudentClassDao.STUDENT_MAX_ID_KEY, studentMaxId.toString());

    localStorage.setItem(StudentClassDao.STUDENTS_PREFIX + classId, JSON.stringify(studentList));
  }

}

const studentClassDao = new StudentClassDao();

export default studentClassDao;
