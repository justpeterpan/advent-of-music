export function timeUntilFirstOfDecember() {
  const now = new Date();
  const firstOfDecember = new Date(now.getFullYear(), 11, 1);
  if (now.getMonth() === 11 && now.getDate() > 1) {
    firstOfDecember.setFullYear(firstOfDecember.getFullYear() + 1);
  }
  return Math.ceil(
    (firstOfDecember.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
}
