const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

/** ml-model/ lives at repo root; __dirname is backend/ml-integration */
function resolvePredictScript() {
  const fromEnv = process.env.ML_PREDICT_SCRIPT;
  const candidates = [];

  if (fromEnv) {
    if (path.isAbsolute(fromEnv)) {
      candidates.push(fromEnv);
    } else {
      candidates.push(path.resolve(__dirname, fromEnv));
      candidates.push(path.resolve(process.cwd(), fromEnv));
    }
  }

  candidates.push(path.resolve(__dirname, '../../ml-model/predict.py'));
  candidates.push(path.join(process.cwd(), 'ml-model', 'predict.py'));

  const seen = new Set();
  for (const p of candidates) {
    const n = path.normalize(p);
    if (seen.has(n)) continue;
    seen.add(n);
    if (fs.existsSync(n)) return n;
  }

  const tried = [...seen].join('\n  ');
  throw new Error(
    `predict.py not found. Set ML_PREDICT_SCRIPT to an existing file (repo layout: ml-model/predict.py at project root, not inside backend/). Tried:\n  ${tried}`
  );
}

const runModel = (payload) =>
  new Promise((resolve, reject) => {
    let resolvedScriptPath;
    try {
      resolvedScriptPath = resolvePredictScript();
    } catch (err) {
      reject(err);
      return;
    }

    const pythonPath = process.env.PYTHON_PATH || 'python';
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
