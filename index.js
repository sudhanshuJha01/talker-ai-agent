import readline from 'node:readline/promises'

const r1 = readline.createInterface({
    input:process.stdin,
    output:process.stdout
})

const main = async ()=>{

    while(true){
        const prompt =await r1.question("You : ")
        if(prompt ==='/bye') break;
        console.log("your question " , prompt);
    }

    r1.close();
    
}

main();