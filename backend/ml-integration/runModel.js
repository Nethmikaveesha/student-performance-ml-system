const path = require('path');
const { spawn } = require('child_process');

const runModel = (payload) =>
  new Promise((resolve, reject) => {
    const pythonPath = process.env.PYTHON_PATH || 'python';
    const scriptPath = process.env.ML_PREDICT_SCRIPT || '../../ml-model/predict.py';
    const resolvedScriptPath = path.resolve(__dirname, scriptPath);

    const pyProcess = spawn(pythonPath, [resolvedScriptPath, JSON.stringify(payload)]);

    let stdout = '';
    let stderr = '';

    pyProcess.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    pyProcess.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    pyProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Model execution failed (${code}): ${stderr}`));
        return;
      }

      try {
        resolve(JSON.parse(stdout.trim()));
      } catch (_err) {
        reject(new Error(`Invalid model response: ${stdout}`));
      }
    });
  });

module.exports = { runModel };
