const HistoryTable = ({ rows }) => {
  if (!rows.length) return null;

  return (
    <section className="card">
      <h2>Recent Predictions</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Study Time</th>
              <th>Attendance</th>
              <th>Quiz</th>
              <th>Assignments</th>
              <th>Attempts</th>
              <th>Lesson Completion</th>
              <th>Prediction</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item._id}>
                <td>{item.studentId}</td>
                <td>{item.studyTime}</td>
                <td>{item.attendancePercentage}</td>
                <td>{item.quizScore}</td>
                <td>{item.assignmentCompletion}</td>
                <td>{item.numberOfAttempts}</td>
                <td>{item.lessonCompletionPercentage}</td>
                <td>{item.prediction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default HistoryTable;
