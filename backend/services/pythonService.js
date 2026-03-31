const path = require('path');
const { spawn } = require('child_process');

const runModelPrediction = (payload) =>
  new Promise((resolve, reject) => {
    const pythonPath = process.env.PYTHON_PATH || 'python';
    const scriptPath = process.env.ML_PREDICT_SCRIPT || '../ml/predict.py';
    const resolvedScriptPath = path.resolve(__dirname, scriptPath);

    const pyProcess = spawn(pythonPath, [resolvedScriptPath, JSON.stringify(payload)]);

    let stdout = '';
    let stderr = '';

    pyProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pyProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pyProcess.on('close', (code) => {
      if (code !== 0) {
        return reject(
          new Error(`Python script exited with code ${code}. Details: ${stderr || 'No stderr output'}`)
        );
      }

      try {
        const parsed = JSON.parse(stdout.trim());
        resolve(parsed);
      } catch (err) {
        reject(new Error(`Invalid model response: ${stdout}`));
      }
    });
  });

module.exports = { runModelPrediction };
