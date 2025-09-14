import { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes, FaCog } from "react-icons/fa";
import "./css/table.css";
import Spinner from "./Spinner"; 

function StudentTable() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState(""); // search input

  // fetch passing students on first load
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
      fetchPassingStudents(); // if search is empty, reset
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

  if (loading) return <Spinner />;  // ✅ Use spinner here
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <section className="intro">
      <div className="bg-image h-100">
        <div className="mask d-flex align-items-center h-100">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <div className="card shadow-2-strong" style={{ backgroundColor: "#f5f7fa" }}>
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
                      <button type="submit" className="btn btn-primary">Search</button>
                    </form>

                    <div className="table-responsive">
                      <table className="table table-borderless mb-0">
                        <thead>
                          <tr>
                            <th scope="col">
                              <div className="form-check">
                                <input className="form-check-input" type="checkbox" />
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
                                  <input className="form-check-input" type="checkbox" />
                                </div>
                              </th>
                              <td>{index + 1}</td>
                              <td>{stu.studentNumber}</td>
                              <td>{stu.fullName}</td>
                              <td>{stu.program}</td>
                              <td>{stu.gwa}</td>
                              <td>
                                <button type="button" className="btn btn-primary btn-sm px-3 me-2">
                                  <FaCog />
                                </button>
                                <button type="button" className="btn btn-danger btn-sm px-3">
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
    </section>
  );
}

export default StudentTable;
