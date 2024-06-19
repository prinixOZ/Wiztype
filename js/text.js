const $ = e=>document.querySelectorAll(e)
let AllLetter
const index = {
    letter:0,
    word:0,
}


const getText = (e=100)=>{
    let mwords = ["the","be","of","and","a","to","in","he","have","it","that","for","they","I","with","as","not","on","she","at","by","this","we","you","do","but","from","or","which","one","would","all","will","there","say","who","make","when","can","more","if","no","man","out","other","so","what","time","up","go","about","than","into","could","state","only","new","year","some","take","come","these","know","see","use","get","like","then","first","any","work","now","may","such","give","over","think","most","even","find","day","also","after","way","many","must","look","before","great","back","through","long","where","much","should","well","people","down","own","just","because","good","each","those","feel","seem","how","high","too","place","little","world","very","still","nation","hand","old","life","tell","write","become","here","show","house","both","between","need","mean","call","develop","under","last","right","move","thing","general","school","never","same","another","begin","while","number","part","turn","real","leave","might","want","point","form","off","child","few","small","since","against","ask","late","home","interest","large","person","end","open","public","follow","during","present","without","again","hold","govern","around","possible","head","consider","word","program","problem","however","lead","system","set","order","eye","plan","run","keep","face","fact","group","play","stand","increase","early","course","change","help","line"];
    let response = ""

    for (i=0;i<e;i++) response = response + " " + mwords[Math.floor(Math.random() * mwords.length)] 
    console.log(response)
    return response.trim()
}

let space = (e)=>{
    const letter = document.createElement("letter");
    letter.setAttribute("class","space")
    letter.innerText = " "
    e.appendChild(letter);
}


let setText = (text)=>{
    let words = text.split(' ');
    const container  = $("#text")[0]
    words.forEach(e=>{
        const word = document.createElement("span");
        for(i of e){
            const letter = document.createElement("letter");
            letter.innerText = i;
            word.appendChild(letter);
        }
        space(word)
        container.appendChild(word);
    })

    AllLetter = $("letter");
    key.Cursor()
}


const key = {
    Correct:(e)=>{
        e.setAttribute("class",`sucess ${e.className}`)
        index.letter = index.letter + 1
        key.Cursor()
    },
    Wrong: (e)=>{
        e.setAttribute("class",`error ${e.className}`);
        index.letter = index.letter + 1
        key.Cursor()
    },
    Clear:()=>{
        if(index.letter >= 1){
            index.letter = index.letter - 1
        }

        const prevLetter = AllLetter[index.letter]
        if(prevLetter.className.includes("space")){ 
            prevLetter.removeAttribute("class")
            prevLetter.setAttribute("class",`space`); 
        }
        else{ prevLetter.removeAttribute("class") }
        key.Cursor()
    },
    Cursor:()=>{
        let el = AllLetter[index.letter]
        let top  = el.getBoundingClientRect().top
        let left = el.getBoundingClientRect().left
        const cursor = $('#cursor')[0]
        cursor.style.top = top+"px"
        cursor.style.left = left+"px"
    }
}

window.addEventListener("keydown",e =>{
    const keyPressed = e.key
    const currentLetter = AllLetter[index.letter]
    if(e.key == "Backspace"){
        key.Clear(currentLetter)
    }
    else if (e.key.length == 1){
        if (currentLetter.innerText == "" && keyPressed == " ") {key.Correct(currentLetter)}
        else if (currentLetter.innerText == keyPressed) {key.Correct(currentLetter)}
        else if (currentLetter.innerText != keyPressed) {key.Wrong(currentLetter)}
    }
})



setText(getText());

window.addEventListener("resize",key.Cursor)
