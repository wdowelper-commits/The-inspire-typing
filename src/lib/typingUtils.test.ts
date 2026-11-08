import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateWPM, calculateCPM, calculateAccuracy, getPerformanceTier, formatTime } from './typingUtils';
import { getPhysicalKeyForChar, getUrduPhoneticChar } from './urduKeyboardMap';

test('WPM calculations calculate standard formula accurately', () => {
  // 50 characters in 60 seconds = 10 words / 1 min = 10 WPM
  assert.equal(calculateWPM(50, 60), 10);
  // 250 characters in 60 seconds = 50 words / 1 min = 50 WPM
  assert.equal(calculateWPM(250, 60), 50);
  // 125 characters in 30 seconds = 25 words in 0.5 min = 50 WPM
  assert.equal(calculateWPM(125, 30), 50);
  // 0 elapsed time returns 0
  assert.equal(calculateWPM(100, 0), 0);
  // 0 correct characters returns 0
  assert.equal(calculateWPM(0, 60), 0);
});

test('CPM calculations calculate accurately', () => {
  assert.equal(calculateCPM(300, 60), 300);
  assert.equal(calculateCPM(150, 30), 300);
  assert.equal(calculateCPM(0, 60), 0);
});

test('Accuracy calculation percentage handles bounds correctly', () => {
  assert.equal(calculateAccuracy(100, 100), 100);
  assert.equal(calculateAccuracy(95, 100), 95);
  assert.equal(calculateAccuracy(0, 0), 100);
  assert.equal(calculateAccuracy(50, 100), 50);
});

test('Time formatting produces mm:ss format', () => {
  assert.equal(formatTime(0), '0:00');
  assert.equal(formatTime(65), '1:05');
  assert.equal(formatTime(120), '2:00');
  assert.equal(formatTime(599), '9:59');
});

test('Performance tiers return expected tier titles', () => {
  assert.equal(getPerformanceTier(15).title, 'Beginner');
  assert.equal(getPerformanceTier(35).title, 'Improving');
  assert.equal(getPerformanceTier(55).title, 'Good');
  assert.equal(getPerformanceTier(75).title, 'Fast');
  assert.equal(getPerformanceTier(90).title, 'Pro');
});

test('Urdu keyboard physical key lookup resolves correctly', () => {
  // Space
  assert.deepEqual(getPhysicalKeyForChar(' ', 'urdu-phonetic'), { key: 'space', shift: false });
  // 'ا' on Phonetic layout maps to 'a'
  assert.deepEqual(getPhysicalKeyForChar('ا', 'urdu-phonetic'), { key: 'a', shift: false });
  // 'ب' on Phonetic layout maps to 'b'
  assert.deepEqual(getPhysicalKeyForChar('ب', 'urdu-phonetic'), { key: 'b', shift: false });
  // 'ٹ' on Phonetic layout maps to Shift+T
  assert.deepEqual(getPhysicalKeyForChar('ٹ', 'urdu-phonetic'), { key: 't', shift: true });
  // English character lookup
  assert.deepEqual(getPhysicalKeyForChar('A', 'english'), { key: 'a', shift: true });
  assert.deepEqual(getPhysicalKeyForChar('k', 'english'), { key: 'k', shift: false });
});

test('Urdu Phonetic character lookup helper', () => {
  assert.equal(getUrduPhoneticChar('a', false), 'ا');
  assert.equal(getUrduPhoneticChar('a', true), 'آ');
  assert.equal(getUrduPhoneticChar('b', false), 'ب');
  assert.equal(getUrduPhoneticChar('t', true), 'ٹ');
});

test('Keyboard finger assignments cover all specified keys', async () => {
  const { KEY_FINGER_MAP } = await import('../components/typing/Keyboard');
  // Left Pinky: ` 1 Q A Z (and Shift, Tab, Caps)
  assert.equal(KEY_FINGER_MAP['`'], 'left-pinky');
  assert.equal(KEY_FINGER_MAP['1'], 'left-pinky');
  assert.equal(KEY_FINGER_MAP['q'], 'left-pinky');
  assert.equal(KEY_FINGER_MAP['a'], 'left-pinky');
  assert.equal(KEY_FINGER_MAP['z'], 'left-pinky');

  // Left Ring: 2 W S X
  assert.equal(KEY_FINGER_MAP['2'], 'left-ring');
  assert.equal(KEY_FINGER_MAP['w'], 'left-ring');
  assert.equal(KEY_FINGER_MAP['s'], 'left-ring');
  assert.equal(KEY_FINGER_MAP['x'], 'left-ring');

  // Left Middle: 3 E D C
  assert.equal(KEY_FINGER_MAP['3'], 'left-middle');
  assert.equal(KEY_FINGER_MAP['e'], 'left-middle');
  assert.equal(KEY_FINGER_MAP['d'], 'left-middle');
  assert.equal(KEY_FINGER_MAP['c'], 'left-middle');

  // Left Index: 4 5 R T F G V B
  ['4', '5', 'r', 't', 'f', 'g', 'v', 'b'].forEach((k) => {
    assert.equal(KEY_FINGER_MAP[k], 'left-index');
  });

  // Right Index: 6 7 Y U H J N M
  ['6', '7', 'y', 'u', 'h', 'j', 'n', 'm'].forEach((k) => {
    assert.equal(KEY_FINGER_MAP[k], 'right-index');
  });

  // Right Middle: 8 I K ,
  ['8', 'i', 'k', ','].forEach((k) => {
    assert.equal(KEY_FINGER_MAP[k], 'right-middle');
  });

  // Right Ring: 9 O L .
  ['9', 'o', 'l', '.'].forEach((k) => {
    assert.equal(KEY_FINGER_MAP[k], 'right-ring');
  });

  // Right Pinky: 0 - = P ; / ' [ ] \ (and Enter, Backspace)
  ['0', '-', '=', 'p', ';', '/', "'", '[', ']', '\\', 'bksp', 'enter'].forEach((k) => {
    assert.equal(KEY_FINGER_MAP[k], 'right-pinky');
  });

  // Thumbs: space
  assert.equal(KEY_FINGER_MAP['space'], 'thumbs');
});

