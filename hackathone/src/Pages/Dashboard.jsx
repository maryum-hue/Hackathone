import { useState, useEffect } from "react";
import { db, collection, getDocs, deleteDoc, doc } from '../config/Firebase';
import { Link } from "react-router-dom";
import './styles.css';
import { getAuth } from "firebase/auth";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  useEffect(() => {
    // Get current user email from Firebase auth
    const auth = getAuth();
    const user = auth.currentUser;
    if (user && user.email) {
      setCurrentUserEmail(user.email);
      localStorage.setItem('userEmail', user.email);
    }
  }, []);

  // Fetch students from Firebase
  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "students"));
      const studentsData = [];
      querySnapshot.forEach((doc) => {
        studentsData.push({ 
          id: doc.id, 
          ...doc.data() 
        });
      });
      
      // Sort by join date (newest first)
      studentsData.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
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

  const deleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteDoc(doc(db, "students", id));
        setStudents(students.filter(student => student.id !== id));
        alert("Student deleted successfully!");
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Error deleting student. Please try again.");
      }
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if current user is a student
  const currentStudent = students.find(student => 
    student.email === currentUserEmail
  );

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="header-actions">
          <Link to="/form" className="btn-primary blue-btn">
            + Register New Student
          </Link>
          {currentStudent && (
            <Link 
              to={`/student/${currentStudent.id}`}
              className="btn-secondary blue-outline"
            >
              View My Card
            </Link>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search students by name, roll number, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Students</h3>
          <p className="stat-number">{students.length}</p>
        </div>
        <div className="stat-card">
          <h3>New This Month</h3>
          <p className="stat-number">
            {students.filter(s => {
              if (!s.joinDate) return false;
              const joinDate = new Date(s.joinDate);
              const now = new Date();
              return joinDate.getMonth() === now.getMonth() && 
                     joinDate.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Classes Active</h3>
          <p className="stat-number">
            {[...new Set(students.map(s => s.classGrade))].length}
          </p>
        </div>
      </div>

      {/* Students Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading">Loading students...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="no-results">
            <p>No students found. {searchTerm && "Try a different search term."}</p>
            <Link to="/form" className="btn-primary blue-btn">
              Register First Student
            </Link>
          </div>
        ) : (
          <>
            <p className="results-count">
              Showing {filteredStudents.length} of {students.length} students
            </p>
            <div className="table-responsive">
              <table className="blue-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Email</th>
                    <th>Join Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td style={{ fontWeight: "600", color: "#2196f3" }}>
                        {student.rollNo || "N/A"}
                      </td>
                      <td>{student.name || "N/A"}</td>
                      <td>
                        <span className="class-badge">
                          {student.classGrade || "N/A"}
                        </span>
                      </td>
                      <td>{student.email || "N/A"}</td>
                      <td>{student.joinDate || "N/A"}</td>
                      <td>
                        <div className="action-buttons">
                          <Link 
                            to={`/student/${student.id}`}
                            className="btn-secondary btn-small blue-outline"
                          >
                            View Card
                          </Link>
                          <button 
                            className="btn-secondary btn-small delete-btn"
                            onClick={() => deleteStudent(student.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;