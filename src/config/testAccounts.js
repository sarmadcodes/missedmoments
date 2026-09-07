/**
 * TESTING UTILITY -- NOT FOR THE APP STORE / PLAY STORE RELEASE.
 *
 * Lets a tester flip between two real, already-matched demo accounts from
 * the Profile screen, to see both sides of a like/match/chat without
 * manually logging out and back in every time.
 *
 * Remove this file and its usage in ProfileScreen.jsx before submitting a
 * production build -- a real user should never see a "switch account"
 * control, and these are real (if throwaway) credentials sitting in the
 * bundle.
 */
export const TEST_ACCOUNTS = [
  { label: 'Test User', email: 'phonetest02@example.com', password: 'TestPass123' },
  { label: 'Ayesha Khan', email: 'ayesha.demo@example.com', password: 'DemoPass123' },
];

export const otherTestAccount = currentEmail =>
  TEST_ACCOUNTS.find(a => a.email !== currentEmail) ?? TEST_ACCOUNTS[0];
