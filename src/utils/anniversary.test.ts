import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTimeTogether, canRedeemCoupon } from './anniversary';

test('calculateTimeTogether calculates exact 90 days', () => {
  const start = 1000000000;
  // 90 days in ms = 90 * 24 * 60 * 60 * 1000 = 7,776,000,000 ms
  const ninetyDaysMs = 90 * 24 * 3600 * 1000;
  const current = start + ninetyDaysMs;

  const result = calculateTimeTogether(start, current);
  assert.equal(result.days, 90);
  assert.equal(result.hours, 0);
  assert.equal(result.minutes, 0);
  assert.equal(result.seconds, 0);
  assert.equal(result.totalDays, 90);
});

test('calculateTimeTogether handles partial days, hours and seconds', () => {
  const start = 1000000000;
  // 92 days, 4 hours, 30 minutes, 15 seconds
  const offset = ((92 * 24 + 4) * 60 + 30) * 60 * 1000 + 15000;
  const current = start + offset;

  const result = calculateTimeTogether(start, current);
  assert.equal(result.days, 92);
  assert.equal(result.hours, 4);
  assert.equal(result.minutes, 30);
  assert.equal(result.seconds, 15);
});

test('canRedeemCoupon prevents duplicate redemption', () => {
  const redeemed = ['coupon-1', 'coupon-3'];
  assert.equal(canRedeemCoupon('coupon-1', redeemed), false);
  assert.equal(canRedeemCoupon('coupon-2', redeemed), true);
  assert.equal(canRedeemCoupon('', redeemed), false);
});
