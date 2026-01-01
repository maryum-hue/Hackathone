import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, doc, getDoc } from '../config/Firebase';
import './styles.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function StudentCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchStudent();
    } else {
      // If no ID, check if current user is a student
      const userEmail = localStorage.getItem('userEmail');
      findStudentByEmail(userEmail);
    }
  }, [id]);

  const fetchStudent = async () => {
    try {
      console.log("Fetching student with ID:", id);
      const docRef = doc(db, "students", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const studentData = { id: docSnap.id, ...docSnap.data() };
        console.log("Student found:", studentData);
        setStudent(studentData);
      } else {
        console.log("No student found with ID:", id);
        alert("Student not found! Redirecting to dashboard.");
        navigate("/dashboard");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching student:", error);
      alert("Error loading student data. Please try again.");
      setLoading(false);
      navigate("/dashboard");
    }
  };

  const findStudentByEmail = async (email) => {
    try {
      const { collection, getDocs } = await import('../config/Firebase');
      const querySnapshot = await getDocs(collection(db, "students"));
      
      let foundStudent = null;
      querySnapshot.forEach((doc) => {
        const studentData = doc.data();
        if (studentData.email === email) {
          foundStudent = { id: doc.id, ...studentData };
        }
      });

      if (foundStudent) {
        setStudent(foundStudent);
        console.log("Student found by email:", foundStudent);
      } else {
        alert("You are not registered as a student. Please register first.");
        navigate("/form");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error finding student:", error);
      setLoading(false);
    }
  };

  const generateCard = async () => {
    if (!student) {
      alert("No student data available!");
      return;
    }

    const cardElement = document.getElementById('student-card');
    if (!cardElement) {
      alert("Card element not found!");
      return;
    }

    try {
      const canvas = await html2canvas(cardElement, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${student.name}-${student.rollNo}-student-card.pdf`);
      alert("Card downloaded successfully!");
    } catch (error) {
      console.error("Error generating card:", error);
      alert("Error generating card. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading student card...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="not-found-container">
        <h2>Student not found</h2>
        <p>Please register as a student first.</p>
        <button 
          onClick={() => navigate('/form')}
          className="btn-primary blue-btn"
        >
          Register Now
        </button>
        <button 
          onClick={() => navigate('/dashboard')}
          className="btn-secondary"
          style={{ marginLeft: '10px' }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="student-card-container">
      <div className="card-header">
        <h1>Student ID Card</h1>
        <div className="card-actions">
          <button onClick={generateCard} className="btn-primary blue-btn">
            Download Card
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Card for download */}
      <div id="student-card" className="student-card printable">
        <div className="card-background"></div>
        <div className="card-content">
          <div className="card-header-blue">
            <h2>XYZ School & College</h2>
            <p>Official Student ID Card</p>
            <p style={{ fontSize: '10px', marginTop: '2px' }}>
              Student ID: {student.id?.substring(0, 8).toUpperCase()}
            </p>
          </div>
          
          <div className="card-body">
            <div className="student-photo">
              <div className="photo-placeholder">
                <span>Student Photo</span>
                <small>Upload 2x2 photo</small>
              </div>
            </div>
            
            <div className="student-details">
              <div className="detail-row">
                <span className="label">Full Name:</span>
                <span className="value">{student.name || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="label">Roll Number:</span>
                <span className="value">{student.rollNo || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="label">Class:</span>
                <span className="value">{student.classGrade || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="label">Email:</span>
                <span className="value">{student.email || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="label">Join Date:</span>
                <span className="value">{student.joinDate || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className="value" style={{ color: '#4CAF50' }}>
                  Active Student
                </span>
              </div>
            </div>
          </div>

          <div className="card-footer">
            <div className="signature">
              <p>Principal's Signature</p>
              <div className="signature-line"></div>
              <p style={{ fontSize: '10px', marginTop: '5px' }}>
                XYZ School & College
              </p>
            </div>
            <div className="validity">
              <p>Valid Until: 31/12/2024</p>
              <p style={{ fontSize: '10px', color: '#666' }}>
                Academic Year 2023-2024
              </p>
            </div>
          </div>

          <div className="card-qr">
            <div className="qr-placeholder">
              <span>QR Code</span>
              <small>Scan for verification</small>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="instructions">
        <h3>Instructions:</h3>
        <ul>
          <li>Click "Download Card" to save as PDF</li>
          <li>Print the card on thick paper (A4 size)</li>
          <li>Laminate the card for durability</li>
          <li>Always carry this card for identification</li>
          <li>Report lost cards immediately</li>
        </ul>
        
        <div className="card-info">
          <p><strong>Student ID:</strong> {student.id?.substring(0, 8).toUpperCase()}</p>
          <p><strong>Generated on:</strong> {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

export default StudentCard;