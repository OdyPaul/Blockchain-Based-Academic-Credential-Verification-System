import { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes, FaCog, FaEye, FaSearch } from "react-icons/fa";
import "./css/table.css";
import Spinner from "./Spinner";

function StudentTable() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tor, setTor] = useState([]); // TOR data
  const [torLoading, setTorLoading] = useState(false);

  useEffect(() => {
    fetchPassingStudents();
  }, []);

  const fetchPassingStudents = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/students/passing")
      .then((res) => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching students");
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query) {
      fetchPassingStudents();
      return;
    }

    setLoading(true);
    axios
      .get(`http://localhost:5000/api/students/search?q=${query}`)
      .then((res) => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error searching students");
        setLoading(false);
      });
  };

  const handleViewTOR = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
    setTor([]);
    setTorLoading(true);

    axios
      .get(`http://localhost:5000/api/students/${student._id}/tor`)
      .then((res) => {
        setTor(res.data);
        setTorLoading(false);
      })
      .catch(() => {
        setTor([]);
        setTorLoading(false);
      });
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <section className="intro">
      <div className="bg-image h-100">
        <div className="mask d-flex align-items-center h-100">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <div
                  className="card shadow-2-strong"
                  style={{ backgroundColor: "#f5f7fa" }}
                >
                  <div className="card-body">
                    {/* 🔎 Search Section */}
                    <form onSubmit={handleSearch} className="d-flex mb-3">
                      <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Search by name, student number, or program"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      <button type="submit" className="btn btn-primary d-flex align-items-center">
                        <FaSearch className="me-1" /> Search
                      </button>
                    </form>

                    <div className="table-responsive">
                      <table className="table table-borderless mb-0">
                        <thead>
                          <tr>
                            <th scope="col">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                />
                              </div>
                            </th>
                            <th scope="col">#</th>
                            <th scope="col">Student Number</th>
                            <th scope="col">Name</th>
                            <th scope="col">Program</th>
                            <th scope="col">GWA</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((stu, index) => (
                            <tr key={stu._id}>
                              <th scope="row">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                  />
                                </div>
                              </th>
                              <td>{index + 1}</td>
                              <td>{stu.studentNumber}</td>
                              <td>{stu.fullName}</td>
                              <td>{stu.program}</td>
                              <td>{stu.gwa}</td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-info btn-sm px-3 me-2"
                                  onClick={() => handleViewTOR(stu)}
                                >
                                  <FaEye />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm px-3 me-2"
                                >
                                  <FaCog />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm px-3"
                                >
                                  <FaTimes />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {students.length === 0 && <p>No students found.</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📄 TOR Modal */}
      {selectedStudent && (
      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        tabIndex="-1"
        onClick={() => setShowModal(false)} // 👉 Close when clicking backdrop
      >
        <div
          className="modal-dialog modal-xl modal-dialog-centered"
          onClick={(e) => e.stopPropagation()} // 👉 Prevent close when clicking inside modal
        >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Transcript of Records - {selectedStudent.fullName}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {torLoading ? (
                  <Spinner />
                ) : tor.length > 0 ? (
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Subject Code</th>
                        <th>Description</th>
                        <th>Final Grade</th>
                        <th>Units</th>
                        <th>Remarks</th>
                        <th>Year Level</th>
                        <th>Semester</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tor.map((subject, idx) => (
                        <tr key={idx}>
                          <td>{subject.subjectCode}</td>
                          <td>{subject.subjectDescription}</td>
                          <td>{subject.finalGrade}</td>
                          <td>{subject.units}</td>
                          <td>{subject.remarks}</td>
                          <td>{subject.yearLevel}</td>
                          <td>{subject.semester}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No TOR data available.</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default StudentTable;
