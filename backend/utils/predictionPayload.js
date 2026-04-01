/**
 * Validates and normalizes prediction input to match ML training ranges.
 * study_time: 0–6; attendance: 40–100; quiz 0–100; assignment 0–10 (or 0–100% scaled);
 * attempts: 1–5; lessons 0–100.
 */
function buildPredictionPayload(body) {
  const errors = [];

  const studyTime = Number(body.studyTime);
  const attendancePercentage = Number(body.attendancePercentage);
  const quizScore = Number(body.quizScore);
  let assignmentCompletion = Number(body.assignmentCompletion);
  let numberOfAttempts = Number(body.numberOfAttempts);
  const lessonCompletionPercentage = Number(body.lessonCompletionPercentage);

  if (Number.isNaN(studyTime) || studyTime < 0 || studyTime > 6) {
    errors.push('studyTime must be between 0 and 6 (hours)');
  }
  if (Number.isNaN(attendancePercentage) || attendancePercentage < 40 || attendancePercentage > 100) {
    errors.push('attendancePercentage must be between 40 and 100');
  }
  if (Number.isNaN(quizScore) || quizScore < 0 || quizScore > 100) {
    errors.push('quizScore must be between 0 and 100');
  }
  if (Number.isNaN(assignmentCompletion)) {
    errors.push('assignmentCompletion is required');
  } else if (assignmentCompletion > 10) {
    assignmentCompletion = Math.min(10, Math.max(0, Math.round(assignmentCompletion / 10)));
  } else if (assignmentCompletion < 0 || assignmentCompletion > 10) {
    errors.push('assignmentCompletion must be between 0 and 10 (or use 0–100 as percentage)');
  }

  if (Number.isNaN(numberOfAttempts)) {
    errors.push('numberOfAttempts is required');
  } else {
    numberOfAttempts = Math.round(numberOfAttempts);
    if (numberOfAttempts < 1) numberOfAttempts = 1;
    if (numberOfAttempts > 5) numberOfAttempts = 5;
  }

  if (Number.isNaN(lessonCompletionPercentage) || lessonCompletionPercentage < 0 || lessonCompletionPercentage > 100) {
    errors.push('lessonCompletionPercentage must be between 0 and 100');
  }

  if (errors.length) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    forModel: {
      study_time: studyTime,
      attendance_percentage: attendancePercentage,
      quiz_score: quizScore,
      assignment_completion: assignmentCompletion,
      number_of_attempts: numberOfAttempts,
      lesson_completion_percentage: lessonCompletionPercentage,
    },
    forDb: {
      studyTime,
      attendancePercentage,
      quizScore,
      assignmentCompletion,
      numberOfAttempts,
      lessonCompletionPercentage,
    },
  };
}

module.exports = { buildPredictionPayload };
