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

const config = {
    wordCount:100,
    punctuation:false,
    number:false,
    time: true,
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
    const prevLetter = _.AllLetter[_.LetterIndex - 1 ]

    // Control + BackSpace
    if(e.ctrlKey && e.key == "Backspace"){ 
            let FirstWordElement= prevLetter.parentNode.children[0]
            let word = _.LetterIndex   -  _.FindeIndexInNodeList(_.AllLetter,FirstWordElement)
            key.Clear(word)
    }
    // BackSpace
    else if(e.key == "Backspace"){
        key.Clear()
    }
    // Letters
    else if (e.ctrlKey == false && e.key.length == 1){
        if (currentLetter.innerText == "" && keyPressed == " ") {key.Correct(currentLetter)} // Space 
        else if (currentLetter.innerText == keyPressed) {key.Correct(currentLetter)} // Correct Letter
        else if (currentLetter.innerText != keyPressed) {key.Wrong(currentLetter)} // Wrong Letter
    }

})



// ====================================================================================================================
// +++++++++++++++++++++++++++++++++++++++++++ Functions to generate typing words +++++++++++++++++++++++++++++++++++++
// ====================================================================================================================

const text = {
    manipulation:{
        punctuation:(e,regularity=3)=>{
            let arr = e
            for(i=0;i<arr.length;i++){
                let punc = ['.', ',', ';', ':', '?', '!', '-', '—', '(', ')', '[', ']', '{', '}', '"', "'", '...', '–']
                if(Math.ceil(Math.random() * regularity) == regularity){
                    let randomPunctuation = punc[Math.floor(Math.random() * punc.length)];
                    arr[i] = arr[i] +  randomPunctuation
                }
            }
            return arr;
        },

        number:(e,regularity=15)=>{
            let arr = e;
            for(i=0;i<arr.length;i++){
                if(Math.ceil(Math.random()*regularity) == regularity){
                    arr[i] = Math.ceil(Math.random() * 10000)
                }
            }

            return arr
        },
    },
    get: (e=config)=>{
        _.$("#text")[0].innerText = ""
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

        if (e.punctuation == true) mwords = text.manipulation.punctuation(mwords)
        if (e.number == true) mwords = text.manipulation.number(mwords)

        let response = ""
        for (i=0;i<e.wordCount;i++) response = response + " " + mwords[Math.floor(Math.random() * mwords.length)] 
        let textresponse = response.trim() // Triming extra space if there is before sending
        return textresponse
    },


    set:()=>{
        let words = text.get().split(' ');
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
            _.LetterIndex = 0;
            letter.innerText = " "
            
            word.appendChild(letter);

            container.appendChild(word);
        })

        _.AllLetter = _.$("letter");
        key.Cursor()
    },

    toggle:(e,y)=>{
        let element = y.srcElement
        if(config[e] == true) {
            config[e] = false
            element.setAttribute("class","off")
        }
        else {
            config[e] = true
            element.setAttribute("class","on")
        }
        text.set();
    }

}

_.$("#punctuation")[0].addEventListener("click",(e)=>text.toggle("punctuation",e))
_.$("#number")[0].addEventListener("click",(e)=> text.toggle("number",e))

window.addEventListener("load",text.set)


// ====================================================================================================================
// ++++++++++++++++++++++++++++++++++++++++++ MODES FUNCTIONS (TIME OR WORD)+++++++++++++++++++++++++++++++++++++++++++
// ====================================================================================================================


