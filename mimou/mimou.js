let video = document.getElementById('background-video');
let mic;

// Fonction pour démarrer l'AudioContext après une interaction utilisateur
function startAudioContext() {
  if (typeof mic === 'undefined') {
    mic = new AudioContext();
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function(stream) {
        let source = mic.createMediaStreamSource(stream);
        let analyser = mic.createAnalyser();
        source.connect(analyser);
        analyser.fftSize = 256;

        let dataArray = new Uint8Array(analyser.frequencyBinCount);

        function updateVideoTime() {
          analyser.getByteFrequencyData(dataArray);
          let soundIntensity = dataArray.reduce((acc, val) => acc + val) / dataArray.length;

          if (soundIntensity > 50) {
            // Avance la vidéo en fonction de l'intensité du son
            video.currentTime += 0.01;
          }

          requestAnimationFrame(updateVideoTime);
        }

        updateVideoTime();
      })
      .catch(function(error) {
        console.error('Erreur lors de l\'accès au microphone:', error);
      });
  }
}

// Attache un gestionnaire d'événement pour démarrer l'AudioContext au clic
document.addEventListener('click', startAudioContext);


// Path: mimou.js