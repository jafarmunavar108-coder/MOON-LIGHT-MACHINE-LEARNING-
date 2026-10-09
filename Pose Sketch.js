let poseModelURL = 'https://teachablemachine.withgoogle.com/models/PASTE_YOUR_MODEL_ID_HERE/';

let classifier, video, label = "Ready", confidence = 0.0;
let repCount = 0, isDown = false;

function setup() {
  createCanvas(640, 520);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  classifier = ml5.imageClassifier(poseModelURL + 'model.json', video, () => classifyVideo());
}

function classifyVideo() { classifier.classify(gotResult); }

function gotResult(err, res) {
  if (!err && res.length > 0) {
    label = res[0].label;
    confidence = res[0].confidence;
    trackReps();
  }
  classifyVideo();
}

function trackReps() {
  if (confidence > 0.85) {
    let cur = label.toLowerCase();
    if (cur.includes("squat") && !isDown) { isDown = true; }
    if (cur.includes("stand") && isDown) { repCount += 1; isDown = false; }
  }
}

function draw() {
  background(20);
  push(); translate(width, 0); scale(-1, 1);
  image(video, 0, 0, width, 440);
  pop();

  fill(0, 180, 100); rect(0, 0, width, 60);
  fill(255); textAlign(CENTER, CENTER); textSize(28);
  text("SQUAT REPS: " + repCount, width / 2, 30);

  fill(30); rect(0, 440, width, 80);
  fill(255); textSize(20); textAlign(LEFT, CENTER);
  text("Pose: " + label, 20, 480);
  textAlign(RIGHT, CENTER);
  text("Certainty: " + floor(confidence * 100) + "%", width - 20, 480);
}
