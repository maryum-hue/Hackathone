import { useState, useEffect } from "react";
import { db, collection, addDoc, getDocs } from '../config/Firebase';
import './styles.css'

function Form() {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [classGrade, setClassGrade] = useState("");
  const [email, setEmail] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch students from Firebase
  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "students"));
      const studentsData = [];
      querySnapshot.forEach((doc) => {
        studentsData.push({ id: doc.id, ...doc.data() });
      });
      setStudents(studentsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const addStudent = async () => {
    if (!name || !rollNo || !classGrade) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const newStudent = {
        name,
        rollNo,
        classGrade,
        email: email || "N/A",
        joinDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };

      // Add to Firebase
      const docRef = await addDoc(collection(db, "students"), newStudent);
      
      // Update local state
      setStudents([{ id: docRef.id, ...newStudent }, ...students]);
      
      // Clear form
      setName("");
      setRollNo("");
      setClassGrade("");
      setEmail("");
      
      alert("Student added successfully!");
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Error adding student. Please try again.");
    }
  };

  return (
    <div style={{ flex: 1 }}>
      <div className="card blue-theme">
        <h3 className="blue-header">Fill From To Register</h3>
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            placeholder="Enter student name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="flex" style={{ gap: "15px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Roll Number *</label>
            <input
              type="text"
              placeholder="e.g., 2021001"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
            />
          </div>
          
          <div className="form-group" style={{ flex: 1 }}>
            <label>Class *</label>
            <select value={classGrade} onChange={(e) => setClassGrade(e.target.value)}>
              <option value="">Select Class</option>
              <option value="10-A">10-A</option>
              <option value="10-B">10-B</option>
              <option value="11-A">11-A</option>
              <option value="11-B">11-B</option>
              <option value="12-A">12-A</option>
              <option value="12-B">12-B</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="text"
            placeholder="student@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <button className="btn-primary blue-btn" onClick={addStudent}>
          Add Student
        </button>
      </div>

      {/* Statistics */}
      <div className="card mt-20 blue-theme">
        <h3 className="blue-header">Class Distribution</h3>
        {loading ? (
          <div className="loading">Loading statistics...</div>
        ) : (
          <div style={{ marginTop: "20px" }}>
            {["10-A", "10-B", "11-A", "11-B", "12-A", "12-B"].map(grade => {
              const count = students.filter(s => s.classGrade === grade).length;
              if (count === 0) return null;
              
              return (
                <div key={grade} style={{ marginBottom: "15px" }}>
                  <div className="flex-between">
                    <span>{grade}</span>
                    <span style={{ color: "#2196f3", fontWeight: "600" }}>{count} students</span>
                  </div>
                  <div style={{ 
                    width: "100%", 
                    height: "8px", 
                    background: "#e3f2fd", 
                    borderRadius: "4px",
                    marginTop: "5px",
                    overflow: "hidden"
                  }}>
                    <div style={{ 
                      width: `${(count / students.length) * 100}%`, 
                      height: "100%", 
                      background: "linear-gradient(90deg, #2196f3, #1976d2)",
                      borderRadius: "4px"
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Form;