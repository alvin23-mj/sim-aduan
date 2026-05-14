let audioCtx = null;
let activeIntervals = [];
let activeOscillators = [];
let activeGains = [];
let stopTimeoutId = null;

// Proactive user-interaction handler to unlock/resume AudioContext globally in modern browsers
const unlockAudioContext = () => {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume().then(() => {
                console.log("AudioContext successfully unlocked via user interaction");
            });
        }
        // Clean up listeners once unlocked
        window.removeEventListener('click', unlockAudioContext);
        window.removeEventListener('touchstart', unlockAudioContext);
        window.removeEventListener('keydown', unlockAudioContext);
    } catch (e) {
        console.error("Failed to unlock AudioContext:", e);
    }
};

if (typeof window !== 'undefined') {
    window.addEventListener('click', unlockAudioContext);
    window.addEventListener('touchstart', unlockAudioContext);
    window.addEventListener('keydown', unlockAudioContext);
}


export const playSynthesizedAlarm = (type = 'beep', durationSeconds = 10) => {
    // 1. Stop any currently playing synthesized alarms first
    stopSynthesizedAlarm();

    try {
        // 2. Initialize AudioContext
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const oscs = [];
        const gains = [];
        const intervals = [];

        const stopLocalSound = () => {
            intervals.forEach(clearInterval);
            oscs.forEach(osc => {
                try {
                    osc.stop();
                } catch (e) {}
                try {
                    osc.disconnect();
                } catch (e) {}
            });
            gains.forEach(gain => {
                try {
                    gain.disconnect();
                } catch (e) {}
            });
        };

        if (type === 'siren') {
            // High-low alternating siren (Polisi/Ambulans style)
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(440, audioCtx.currentTime);

            let high = true;
            const cycleInterval = setInterval(() => {
                if (audioCtx) {
                    osc.frequency.exponentialRampToValueAtTime(high ? 800 : 440, audioCtx.currentTime + 0.35);
                    high = !high;
                }
            }, 400);
            intervals.push(cycleInterval);

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);

            osc.start();
            oscs.push(osc);
            gains.push(gainNode);

        } else if (type === 'beep') {
            // Classic desk clock rhythmic double-beeps
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(980, audioCtx.currentTime);

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            let soundOn = true;
            const cycleInterval = setInterval(() => {
                if (audioCtx) {
                    gainNode.gain.setValueAtTime(soundOn ? 0.25 : 0, audioCtx.currentTime + 0.02);
                    soundOn = !soundOn;
                }
            }, 200);
            intervals.push(cycleInterval);

            osc.start();
            oscs.push(osc);
            gains.push(gainNode);

        } else if (type === 'chime') {
            // Melodic rising digital chime notes
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            let noteIdx = 0;

            const playSequence = () => {
                if (!audioCtx) return;
                const oscNode = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();

                oscNode.type = 'triangle';
                oscNode.frequency.setValueAtTime(notes[noteIdx % notes.length], audioCtx.currentTime);

                oscNode.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                gainNode.gain.setValueAtTime(0.18, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

                oscNode.start();
                oscNode.stop(audioCtx.currentTime + 0.5);

                oscs.push(oscNode);
                gains.push(gainNode);
                noteIdx++;
            };

            // Trigger immediately and then repeatedly
            playSequence();
            const cycleInterval = setInterval(playSequence, 160);
            intervals.push(cycleInterval);

        } else {
            // Radar pulse warning sweep (Radar style)
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(1400, audioCtx.currentTime);

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            const triggerPulse = () => {
                if (audioCtx) {
                    osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.45);
                    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
                }
            };

            triggerPulse();
            const cycleInterval = setInterval(triggerPulse, 600);
            intervals.push(cycleInterval);

            osc.start();
            oscs.push(osc);
            gains.push(gainNode);
        }

        // Save active nodes globally so we can stop them externally
        activeIntervals = intervals;
        activeOscillators = oscs;
        activeGains = gains;

        // Auto stop after duration
        stopTimeoutId = setTimeout(() => {
            stopSynthesizedAlarm();
        }, durationSeconds * 1000);

        return stopLocalSound;

    } catch (e) {
        console.error("Browser failed to initialize AudioContext synth:", e);
        return () => {};
    }
};

export const stopSynthesizedAlarm = () => {
    if (stopTimeoutId) {
        clearTimeout(stopTimeoutId);
        stopTimeoutId = null;
    }

    activeIntervals.forEach(clearInterval);
    activeIntervals = [];

    activeOscillators.forEach(osc => {
        try {
            osc.stop();
        } catch (e) {}
        try {
            osc.disconnect();
        } catch (e) {}
    });
    activeOscillators = [];

    activeGains.forEach(gain => {
        try {
            gain.disconnect();
        } catch (e) {}
    });
    activeGains = [];
};
