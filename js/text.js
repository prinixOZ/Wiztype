const $ = e=>document.querySelectorAll(e)
let AllLetter
const index = {
    letter:0,
    word:0,
}

let getText = async ()=>{
    const response = await fetch("https://api.quotable.io/quotes/random?minLength=400");
    const text = await response.json()
    return text[0].content.trim()
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
    Clear:(e)=>{
        index.letter = index.letter - 1
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



getText().then(e=>{
    setText(e);
    key.Cursor()
})

window.addEventListener("resize",key.Cursor)
