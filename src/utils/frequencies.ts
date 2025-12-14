// Key Mappings: 2-Layer Layout
// Layer 1 (Lower): Row Z (Naturals) + Row A (Sharps) -> C3 to E4
// Layer 2 (Upper): Row Q (Naturals) + Row 1 (Sharps) -> C4 to E5+

export const NOTES = [
    // --- Lower Octave (Row Z + Row A) ---
    { note: 'C3', freq: 130.81, key: 'z', type: 'white' },
    { note: 'C#3', freq: 138.59, key: 'a', type: 'black' },
    { note: 'D3', freq: 146.83, key: 'x', type: 'white' },
    { note: 'D#3', freq: 155.56, key: 's', type: 'black' },
    { note: 'E3', freq: 164.81, key: 'c', type: 'white' },
    { note: 'F3', freq: 174.61, key: 'v', type: 'white' },
    { note: 'F#3', freq: 185.00, key: 'f', type: 'black' }, // d skipped (E#)
    { note: 'G3', freq: 196.00, key: 'b', type: 'white' },
    { note: 'G#3', freq: 207.65, key: 'g', type: 'black' },
    { note: 'A3', freq: 220.00, key: 'n', type: 'white' },
    { note: 'A#3', freq: 233.08, key: 'h', type: 'black' },
    { note: 'B3', freq: 246.94, key: 'm', type: 'white' },
    // C4 on lower row (comma)
    { note: 'C4-L', freq: 261.63, key: ',', type: 'white' },

    // --- Upper Octave (Row Q + Row 1) ---
    // Overlapping C4 for convenience
    { note: 'C4', freq: 261.63, key: 'q', type: 'white' },
    { note: 'C#4', freq: 277.18, key: '1', type: 'black' },
    { note: 'D4', freq: 293.66, key: 'w', type: 'white' },
    { note: 'D#4', freq: 311.13, key: '2', type: 'black' },
    { note: 'E4', freq: 329.63, key: 'e', type: 'white' },
    { note: 'F4', freq: 349.23, key: 'r', type: 'white' },
    { note: 'F#4', freq: 369.99, key: '4', type: 'black' }, // 3 skipped
    { note: 'G4', freq: 392.00, key: 't', type: 'white' },
    { note: 'G#4', freq: 415.30, key: '5', type: 'black' },
    { note: 'A4', freq: 440.00, key: 'y', type: 'white' },
    { note: 'A#4', freq: 466.16, key: '6', type: 'black' },
    { note: 'B4', freq: 493.88, key: 'u', type: 'white' },

    // --- High Octave (Continuing Row Q + Row 1) ---
    { note: 'C5', freq: 523.25, key: 'i', type: 'white' },
    { note: 'C#5', freq: 554.37, key: '8', type: 'black' }, // 7 skipped
    { note: 'D5', freq: 587.33, key: 'o', type: 'white' },
    { note: 'D#5', freq: 622.25, key: '9', type: 'black' },
    { note: 'E5', freq: 659.25, key: 'p', type: 'white' },
    { note: 'F5', freq: 698.46, key: '[', type: 'white' },
    { note: 'F#5', freq: 739.99, key: '-', type: 'black' }, // 0 skipped? 0 is usually after 9. P is below 0. [ is below -.
    { note: 'G5', freq: 783.99, key: ']', type: 'white' },
    { note: 'G#5', freq: 830.61, key: '=', type: 'black' },
    { note: 'A5', freq: 880.00, key: '\\', type: 'white' },
];
