import React, { useState } from 'react';
import './css/variables.css';
import './css/App.css';
import './css/components.css';

import ClassListPage from './pages/ClassListPage';
import StudentClass from './model/StudentClass';
import ClassPage from './pages/ClassPage';


enum Page {
  CLASS_LIST,
  CLASS_WHEEL
}


function App() {
  const [currentPage, setCurrentPage] = useState(Page.CLASS_LIST);
  const [currentClass, setCurrentClass] = useState<StudentClass>(new StudentClass(0, ""));
  const goToClassCallback = (studentClass :StudentClass) => {
    setCurrentPage(Page.CLASS_WHEEL);
    setCurrentClass(studentClass);
  }
  const goToClassListCallback = () => {
    setCurrentPage(Page.CLASS_LIST);
  }
  
  return (
    <div className="App">
      {currentPage===Page.CLASS_LIST && <ClassListPage goToClassCallback={goToClassCallback}/>}
      {currentPage===Page.CLASS_WHEEL && <ClassPage studentClass={currentClass} goToClassListCallback={goToClassListCallback}/>}
    </div>
  );
}



export default App;
