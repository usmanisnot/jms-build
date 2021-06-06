import bwipjs from "bwip-js";

const callStack = [];

function next() {
  const { cb, canvas, text } = callStack[0];
  bwipjs(
    canvas,
    {
      bcid: "code128",
      text,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: "center",
    },
    (err, cvs) => {
      if (err) cb(err);
      else cb(null, cvs);
      callStack.shift();
      if (callStack.length) next();
    }
  );
}

function registerNewCallback(cb, canvas, text) {
  callStack.push({ cb, canvas, text });
  if (callStack.length == 1) next();
}

export default /**
 * @arg {string | HTMLCanvasElement} canvas
 * @arg {string} text
 * @return {Promise<HTMLCanvasElement>}
 */
(canvas, text) => {
  return new Promise((resolve, reject) => {
    registerNewCallback(
      (err, cvs) => {
        if (err) reject(err);
        else resolve(cvs);
      },
      canvas,
      text
    );
  });
};
