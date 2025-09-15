import { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes, FaCog, FaEye, FaSearch } from "react-icons/fa";
import "./css/table.css";
import Spinner from "./Spinner";

// 🆕 Import your modal components
import ConfirmModal from "./modals/ConfirmModal";
import TorModal from "./modals/TorModal";
import VcModal from "./modals/VcModal";

function StudentTable() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  // Modals
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTORModal, setShowTORModal] = useState(false);
  const [showVCModal, setShowVCModal] = useState(false);

  // TOR
  const [tor, setTor] = useState([]);
  const [torLoading, setTorLoading] = useState(false);

  // VC
  const [vc, setVc] = useState(null);
  const [vcLoading, setVcLoading] = useState(false);

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

  // 🔹 Show confirmation modal
  const handleConfirmView = (student) => {
    setSelectedStudent(student);
    setShowConfirmModal(true);
  };

  // 🔹 Load TOR
  const handleViewTOR = () => {
    setShowConfirmModal(false);
    setShowTORModal(true);
    setTor([]);
    setTorLoading(true);

    axios
      .get(`http://localhost:5000/api/students/${selectedStudent._id}/tor`)
      .then((res) => {
        setTor(res.data);
        setTorLoading(false);
      })
      .catch(() => {
        setTor([]);
        setTorLoading(false);
      });
  };

  // 🔹 Load VC
  const handleViewVC = () => {
    setShowConfirmModal(false);
    setShowVCModal(true);
    setVc(null);
    setVcLoading(true);

    axios
      .get(`http://localhost:5000/api/students/${selectedStudent._id}`)
      .then((res) => {
        setVc(res.data); // student data as VC JSON
        setVcLoading(false);
      })
      .catch(() => {
        setVc(null);
        setVcLoading(false);
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
                      <button
                        type="submit"
                        className="btn btn-primary d-flex align-items-center"
                      >
                        <FaSearch className="me-1" /> Search
                      </button>
                    </form>

                    {/* 📊 Students Table */}
                    <div className="table-responsive">
                      <table className="table table-borderless mb-0">
                        <thead>
                          <tr>
                            <th></th>
                            <th>#</th>
                            <th>Student Number</th>
                            <th>Name</th>
                            <th>Program</th>
                            <th>GWA</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((stu, index) => (
                            <tr key={stu._id}>
                              <td>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                  />
                                </div>
                              </td>
                              <td>{index + 1}</td>
                              <td>{stu.studentNumber}</td>
                              <td>{stu.fullName}</td>
                              <td>{stu.program}</td>
                              <td>{stu.gwa}</td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-info btn-sm px-3 me-2"
                                  onClick={() => handleConfirmView(stu)}
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

      {/* ⚡ Modals */}
      <ConfirmModal
        show={showConfirmModal}
        student={selectedStudent}
        onClose={() => setShowConfirmModal(false)}
        onViewVC={handleViewVC}
        onViewTOR={handleViewTOR}
      />

      <TorModal
        show={showTORModal}
        student={selectedStudent}
        tor={tor}
        loading={torLoading}
        onClose={() => setShowTORModal(false)}
      />

      <VcModal
        show={showVCModal}
        student={selectedStudent}
        vc={vc}
        loading={vcLoading}
        onClose={() => setShowVCModal(false)}
      />
    </section>
  );
}

export default StudentTable;
