import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSmsInput, MAX_SMS_LENGTH, getLabelExplanation } from './validation';
import { filterExperimentResults, EXPERIMENT_RESULTS, MAIN_MODEL_CONFUSION_MATRIX } from './mlData';

test('validateSmsInput rejects empty or whitespace strings', () => {
  assert.equal(validateSmsInput('').isValid, false);
  assert.equal(validateSmsInput('   \n\t  ').isValid, false);
});

test('validateSmsInput rejects text exceeding maximum length', () => {
  const longText = 'a'.repeat(MAX_SMS_LENGTH + 1);
  const result = validateSmsInput(longText);
  assert.equal(result.isValid, false);
  assert.match(result.errorMessage || '', /vượt quá giới hạn/);
});

test('validateSmsInput accepts valid SMS text', () => {
  const result = validateSmsInput('Are we still meeting at the library this afternoon?');
  assert.equal(result.isValid, true);
  assert.equal(result.errorMessage, null);
});

test('getLabelExplanation correctly identifies Ham and Spam', () => {
  const ham = getLabelExplanation(0);
  assert.equal(ham.badgeColor, 'emerald');
  assert.match(ham.title, /Ham/);

  const spam = getLabelExplanation(1);
  assert.equal(spam.badgeColor, 'rose');
  assert.match(spam.title, /Spam/);
});

test('filterExperimentResults filters by algorithm and representation', () => {
  const allResults = filterExperimentResults(EXPERIMENT_RESULTS, 'ALL', 'ALL');
  assert.equal(allResults.length, 9);

  const nbResults = filterExperimentResults(EXPERIMENT_RESULTS, 'Naive Bayes', 'ALL');
  assert.equal(nbResults.length, 3);

  const bowNb = filterExperimentResults(EXPERIMENT_RESULTS, 'Naive Bayes', 'BoW');
  assert.equal(bowNb.length, 1);
  assert.equal(bowNb[0].f1Spam, 93.93);
  assert.equal(bowNb[0].isMainModel, true);
});

test('confusion matrix data sums to 1032 test samples', () => {
  const cm = MAIN_MODEL_CONFUSION_MATRIX;
  assert.equal(cm.tn + cm.fp + cm.fn + cm.tp, 1032);
  assert.equal(cm.tn + cm.fp, 904); // Total true Ham
  assert.equal(cm.fn + cm.tp, 128); // Total true Spam
});
