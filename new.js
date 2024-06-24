let config = {
    time:{
        val:30
    }
}


let time ={
    interval:null,
    timeout:null,
    init:(e)=>{
        if(e) config.time.val = e;  // if any arguments are passed than config.time.val = e
            
        if(config.mode == "time" && config.time.start == false){
            time.edit(config.time.val) // Sets the default value here
            _.$("#time")[0].setAttribute('class','on')

            mode.options(config.time.option) // creates options

            let Optioncontainer = _.$("#options-settings span"); 
            Optioncontainer.forEach(f=>{
                if(parseInt(f.innerText) == e) f.setAttribute('class','on')
                else f.setAttribute('class','off')
                f.addEventListener('click',i=>{
                    let number = parseInt(i.srcElement.innerText)
                    config.time.val = number;
                    config.time.start = false;
                    key.Restart();
                    mode.time()
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
        time.interval = setInterval(()=>{
            number = number - 1;
            time.edit(number)
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

}
