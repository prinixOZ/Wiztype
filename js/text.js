// Utility functions
const _ = {
    $:e=> document.querySelectorAll(e),
    AllLetter:null,
    LetterIndex:0,
    FindeIndexInNodeList:(nodeList, element)=>{
        for (let i = 0; i < nodeList.length; i++) {
            if (nodeList[i] === element) {
                return i;
            }
        }
        return -1; // Element not found
    }
}


// ====================================================================================================================
// +++++++++++++++++++++++++++++++++++++++++++++++++ Typing Functions +++++++++++++++++++++++++++++++++++++++++++++++++
// ====================================================================================================================


const key = {
    Correct:(e)=>{
        e.setAttribute("class",`sucess ${e.className}`)
        _.LetterIndex = _.LetterIndex + 1
        key.Cursor()
    },
    Wrong: (e)=>{
        e.setAttribute("class",`error ${e.className}`);
        _.LetterIndex = _.LetterIndex + 1
        key.Cursor()
    },
    Clear:(loop=1)=>{
        for(i=0;i<loop;i++){
            if(_.LetterIndex >= 1){
                _.LetterIndex = _.LetterIndex - 1
            }

            const prevLetter = _.AllLetter[_.LetterIndex]
            if(prevLetter.className.includes("space")){ 
                prevLetter.removeAttribute("class")
                prevLetter.setAttribute("class","space"); 
            }
            else{ prevLetter.removeAttribute("class") }
            key.Cursor()
        }
    },
    Cursor:()=>{
        if(!_.$("#cursor")[0]){
            let caret  = document.createElement("div")
            caret.setAttribute("id","cursor")
            _.$("body")[0].appendChild(caret)
        }
        let el = _.AllLetter[_.LetterIndex]
        let top  = el.getBoundingClientRect().top
        let left = el.getBoundingClientRect().left
        const cursor = _.$('#cursor')[0]
        cursor.style.top = top+"px"
        cursor.style.left = left+"px"
    }
}


window.addEventListener("resize",key.Cursor) // Cursor Position Change with change in window size

// Event Handler while typing
window.addEventListener("keydown",e =>{      

    const keyPressed = e.key
    const currentLetter = _.AllLetter[_.LetterIndex]

    // Control + BackSpace
    if(e.ctrlKey && e.key == "Backspace"){
        let FirstWordElement= currentLetter.parentNode.children[0]
        let word = _.LetterIndex   -  _.FindeIndexInNodeList(_.AllLetter,FirstWordElement)
        key.Clear(word)
    }
    // BackSpace
    else if(e.key == "Backspace"){
        key.Clear()
    }
    // Letters
    else if (e.key.length == 1){
        if (currentLetter.innerText == "" && keyPressed == " ") {key.Correct(currentLetter)} // Space 
        else if (currentLetter.innerText == keyPressed) {key.Correct(currentLetter)} // Correct Letter
        else if (currentLetter.innerText != keyPressed) {key.Wrong(currentLetter)} // Wrong Letter
    }

})



// ====================================================================================================================
// +++++++++++++++++++++++++++++++++++++++++++ Functions to generate typing words +++++++++++++++++++++++++++++++++++++
// ====================================================================================================================

const text = {
    get: (e=100)=>{
        let mwords = [
            "the","be","of","and","a","to","in","he","have","it",
            "that","for","they","I","with","as","not","on","she","at",
            "by","this","we","you","do","but","from","or","which","one",
            "would","all","will","there","say","who","make","when","can","more",
            "if","no","man","out","other","so","what","time","up","go",
            "about","than","into","could","state","only","new","year","some","take",
            "come","these","know","see","use","get","like","then","first","any",
            "work","now","may","such","give","over","think","most","even","find",
            "day","also","after","way","many","must","look","before","great","back",
            "through","long","where","much","should","well","people","down","own","just",
            "because","good","each","those","feel","seem","how","high","too","place",
            "little","world","very","still","nation","hand","old","life","tell","write",
            "become","here","show","house","both","between","need","mean","call","develop",
            "under","last","right","move","thing","general","school","never","same","another",
            "begin","while","number","part","turn","real","leave","might","want","point",
            "form","off","child","few","small","since","against","ask","late","home",
            "interest","large","person","end","open","public","follow","during","present","without",
            "again","hold","govern","around","possible","head","consider","word","program","problem",
            "however","lead","system","set","order","eye","plan","run","keep","face",
            "fact","group","play","stand","increase","early","course","change","help","line"
        ];

        // Choosing random words from the array and adding it to variable response to create a sentence
        // by default of 100 words
        let response = ""
        for (i=0;i<e;i++) response = response + " " + mwords[Math.floor(Math.random() * mwords.length)] 
        return response.trim() // Triming extra space if there is before sending
    },


    set:(text)=>{
        let words = text.split(' ');
        const container  = _.$("#text")[0]
        words.forEach(e=>{
            const word = document.createElement("span");
            for(i of e){
                const letter = document.createElement("letter");
                letter.innerText = i;
                word.appendChild(letter);
            }

            // Sets Space between words
            // To be clear spaces are not actual spaces but padding between letters
            const letter = document.createElement("letter");
            letter.setAttribute("class","space")
            letter.innerText = " "
            word.appendChild(letter);

            container.appendChild(word);
        })

        _.AllLetter = _.$("letter");
        key.Cursor()
    },

}

text.set(text.get())
