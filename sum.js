function sum(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total;
}
console.log(sum(1)); // 1
console.log(sum(2)); // 3
console.log(sum(10)); // 55
console.log(sum(100)); // 5050