export function wait(time = 1): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      return resolve();
    }, time);
  });
}