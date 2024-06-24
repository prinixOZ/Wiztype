// Utility functions
let interval 
let timeout
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
    },
    NumberFormat:(e)=> {
        if(e<10) return `0${e}`
        else return e
    }
}

const config = {
    wordCount:70,
    punctuation:false,
    number:false,
    mode:"time",
    time:{
        start:false,
        option:[10,15,30,60,120],
        val: 30,
    },
    word:{
        start:false,
        option:[10,25,50,100],
        val: 50,
    }
}

// ====================================================================================================================
// +++++++++++++++++++++++++++++++++++++++++++++++++ Typing Functions +++++++++++++++++++++++++++++++++++++++++++++++++
// ====================================================================================================================


const key = {
    Restart:()=>{
        key.Clear(_.LetterIndex)
        text.set()

        clearInterval(interval)
        clearTimeout(timeout)
    },
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
    const LetterText = currentLetter.innerText;
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
        if(config.time.start == false && config.mode == "time"){
            config.time.start = true;
            mode.time.start()
        }

        if (LetterText == "" && keyPressed == " ") {key.Correct(currentLetter)} // Space 
        else if (LetterText != ""  && LetterText == keyPressed) {key.Correct(currentLetter)} // Correct Letter
        else if (LetterText != ""  && LetterText != keyPressed) {key.Wrong(currentLetter)} // Wrong Letter
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
                let punc = ['.', ',', ';', ':', '?', '!', '-', '(', ')', '[', ']', '{', '}', '"', "'", '...', '–']
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
        mode[config.mode].init()
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

const mode = {
    complete:()=>{
        let Allwords = _.$('#text span');
        let wordsCompleted = _.FindeIndexInNodeList(Allwords, _.AllLetter[_.LetterIndex].parentElement)
        let wpm = Math.round((wordsCompleted / config.time.val) * 60);

        _.$('#incomplete')[0].setAttribute("id","complete")
        _.$('#wpm')[0].innerText = _.NumberFormat(wpm) +" WPM"
    },

    time:{
        interval:null,
        timeout:null,
        init:(e)=>{
            if(e) config.time.val = e;  // if any arguments are passed than config.time.val = e

            if(config.mode == "time" && config.time.start == false){

                mode.time.edit(config.time.val) // Sets the default value here
                _.$("#time")[0].setAttribute('class','on')
                mode.options(config.time.option) // creates options
                let Optioncontainer = _.$("#options-settings span"); 
                Optioncontainer.forEach(f=>{

                    // SETTING ON AND OFF OPTION
                    if(parseInt(f.innerText) == e) f.setAttribute('class','on')
                    else f.setAttribute('class','off')

                    // Adding behaviour to do on click
                    f.addEventListener('click',i=>{
                        let number = parseInt(i.srcElement.innerText)
                        config.time.val = number;
                        config.time.start = false;
                        key.Restart();
                        mode.time.init()
                    })

                })
            }
            if(config.mode == "time" && config.time.start == true){
                config.mode = "time";
                config.time.val = e;
                let number = config.time.val;

            }
        },
        start: ()=>{
            let number = config.time.val
            time.interval = setInterval(()=>{
                number = number - 1;
                mode.time.edit(number)
            },1000)

            time.timeout = setTimeout(()=>{
                clearInterval(time.interval);
                mode.complete()
            },config.time.val * 1000)
        },

        stop:()=>{
            clearInterval(time.interval); // Clears time interval
            clearTimeout(time.timeout);  // Clear timeout
        },

        edit:(time)=> _.$("#timer")[0].innerText = _.NumberFormat(time),

    },

    options:(arr,def)=>{
        _.$('#mode span').forEach(e=>e.setAttribute('class','off')) // clearing previous selected mode
        _.$(`#${config.mode}`)[0].setAttribute('class','on'); // setting write mode to on

        let Optioncontainer = _.$('#options-settings')[0];  // optioncontainer is where all option in an arr goes.
        Optioncontainer.innerHTML = "" // removeing all existing options

        arr.forEach(e=>{
            const el = document.createElement('span');
            el.innerText = e; 

            if(e == def) el.setAttribute('class','on')  // if option val is default it will turn on
            else el.setAttribute('class','off') // else no

            Optioncontainer.appendChild(el) // putting options created in option container.

            el.addEventListener('click',e=> {
                config[config.mode].val = parseInt(e.target.innerText)
            })

        })

    },
}




_.$("#time")[0].addEventListener("click",mode.time.init);
_.$("#word")[0].addEventListener("click",mode.word);
