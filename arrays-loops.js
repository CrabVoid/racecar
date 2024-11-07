for (let i = 11; i <= 20; i++) {
    console.log(i);
}

for (let i = 20; i >= 11; i--) {
    console.log(i);
}

let friends = ["jānis", "rinalds", "māris", "antra", "Trump"];

console.log(friends[0]);
console.log(friends[2]);

let friendsCount = friends.length;

for (let i = 0; i < friendsCount; i++) {
    console.log(`${i + 1}. ${friends[i]}`);
}