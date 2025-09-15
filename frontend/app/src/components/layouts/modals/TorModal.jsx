import Spinner from "../Spinner";

function TorModal({ show, student, tor, loading, onClose }) {
  if (!show || !student) return null;

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-xl modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Transcript of Records – {student.fullName}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {loading ? (
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
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TorModal;
