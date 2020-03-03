var arg1 = process.argv[2];
var rand = Math.floor(Math.random) * 10;

if (arg1 === rand){
    console.log("you win")
} else {
    console.log("you lost")
}