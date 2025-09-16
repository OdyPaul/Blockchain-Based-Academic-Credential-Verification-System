import { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes, FaCog, FaEye, FaSearch } from "react-icons/fa";
import "./css/table.css";
import Spinner from "./Spinner";

import ConfirmModal from "./modals/ConfirmModal";
import TorModal from "./modals/TorModal";
import VcModal from "./modals/VcModal";
import UnselectConfirmModal from "./modals/UnselectConfirmModal";
import CreateVCConfirmModal from "./modals/CreateVCConfirmModal";

function StudentTable() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [programs, setPrograms] = useState([]);

  // Program filter
  const [selectedProgram, setSelectedProgram] = useState("All");

  // Row selection
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Modals
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTORModal, setShowTORModal] = useState(false);
  const [showVCModal, setShowVCModal] = useState(false);
  const [showVCConfirmModal, setShowVCConfirmModal] = useState(false);

  // TOR + VC
  const [tor, setTor] = useState([]);
  const [torLoading, setTorLoading] = useState(false);
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

      // ✅ Extract unique programs only once
      const uniquePrograms = [...new Set(res.data.map((s) => s.program))];
      setPrograms(uniquePrograms);

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

  const handleApplyProgram = () => {
    if (selectedProgram === "All") {
      fetchPassingStudents();
    } else {
      setLoading(true);
      axios
        .get(`http://localhost:5000/api/students/search?q=${selectedProgram}`)
        .then((res) => {
          setStudents(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

// Unselect all selected rows
const handleUnselectSelected = () => {
  setSelectedRows([]);  // just clear state
  setShowDeleteModal(false);
};

  // Show confirmation modal
  const handleConfirmView = (student) => {
    setSelectedStudent(student);
    setShowConfirmModal(true);
  };

  // Load TOR
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

  // Load VC
  const handleViewVC = () => {
    setShowConfirmModal(false);
    setShowVCModal(true);
    setVc(null);
    setVcLoading(true);

    axios
      .get(`http://localhost:5000/api/students/${selectedStudent._id}`)
      .then((res) => {
        setVc(res.data);
        setVcLoading(false);
      })
      .catch(() => {
        setVc(null);
        setVcLoading(false);
      });
  };

// Toggle select all rows
const handleSelectAll = () => {
  if (selectedRows.length === students.length) {
    // if everything is already selected → clear
    setSelectedRows([]);
  } else {
    // select all visible students
    setSelectedRows(students.map((s) => s._id));
  }
};

const handleCreateVC = async () => {
  console.log("Creating VC for:", selectedRows); // debug
  try {
    await axios.post("http://localhost:5000/vc/bulk-issue", { studentIds: selectedRows });
    alert("VCs signed and saved successfully!");
    setShowVCConfirmModal(false);
    setSelectedRows([]);
  } catch (err) {
    console.error(err);
    alert("Failed to sign VCs");
  }
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
                    <div className="d-flex mb-3">
                <button
                  type="button"
                  className="btn btn-success me-3"
                  disabled={selectedRows.length === 0}
                  onClick={() => setShowVCConfirmModal(true)}   // ✅ open confirm modal
                >
                  Create VC
                </button>

                    {/* existing search + filters here */}
                  </div>

                    {/* 🔎 Search + Filters Section */}
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
                        className="btn btn-primary d-flex align-items-center me-2"
                      >
                        <FaSearch className="me-1" /> Search
                      </button>

                      <select
                        className="form-select me-2"
                        value={selectedProgram}
                        onChange={(e) => setSelectedProgram(e.target.value)}
                      >
                        <option value="All">All</option>
                        {programs.map((prog) => (
                          <option key={prog} value={prog}>
                            {prog}
                          </option>
                        ))}
                      </select>


                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={handleApplyProgram}
                      >
                        Apply
                      </button>
                      <button
                      type="button"
                      className="btn btn-outline-dark me-2"
                      onClick={handleSelectAll}
                    >
                      ALL
                    </button>

                      <button
                        type="button"
                        className="btn btn-danger d-flex align-items-center"
                        disabled={selectedRows.length === 0}
                        onClick={() => setShowDeleteModal(true)}
                      >
                        <FaTimes className="me-1" />
                        {selectedRows.length}
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
                                    checked={selectedRows.includes(stu._id)}
                                    onChange={() => handleRowSelect(stu._id)}
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

      <UnselectConfirmModal
        show={showDeleteModal}
        count={selectedRows.length}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleUnselectSelected}
      />
      <CreateVCConfirmModal
      show={showVCConfirmModal}
      count={selectedRows.length}
      onClose={() => setShowVCConfirmModal(false)}
      onConfirm={handleCreateVC}
    />


    </section>
  );
}

export default StudentTable;
