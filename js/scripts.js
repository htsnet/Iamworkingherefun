const linhas = 6;
const colunas = 6;
const intervalInput = document.getElementById("interval");
const startButton = document.getElementById("start_btn");
const stopButton = document.getElementById("stop_btn");
const coordenadasText = document.getElementById("coordenadas");

let processo = false;

document.getElementById("prosseguir_btn").onclick = function () {
    document.getElementById("titulo").scrollIntoView();
};

stopButton.addEventListener("click", () => {
    //alert("parando");
    releaseWakeLock();
    clearInterval(timer);
    processo = false;
    document.getElementById("selecao").style.display = "block";
    document.getElementById("start_btn").style.display = "block";
    document.getElementById("stop_btn").style.display = "none";
});

startButton.addEventListener("click", () => {
    //alert("iniciando");
    requestWakeLock();
    processo = true;
    document.getElementById("selecao").style.display = "none";
    document.getElementById("start_btn").style.display = "none";
    document.getElementById("stop_btn").style.display = "block";
    timer = setInterval(function () {
        const rndIntC = randomIntFromInterval(1, colunas);
        const rndIntL = randomIntFromInterval(1, linhas);
        //waiting(800);
        document.getElementById(rndIntL + "" + rndIntC).scrollIntoView();
        //document.getElementById(rndIntL + "" + rndIntC).focus();
        document.getElementById(rndIntL + "" + rndIntC).style.cursor = "pointer";
        cleanFields();
        document.getElementById(rndIntL + "" + rndIntC).value = makeid(10);
        //waiting(800);
        simulatedClick(document.getElementById("prosseguir_btn"));
        //waiting(800);
    }, intervalInput.value * 1000);
    //}
});

async function waiting(time) {
    await new Promise(resolve => setTimeout(resolve, time));
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

function cleanFields() {
    for (let lin = 1; lin <= linhas; lin++) {
        for (let col = 1; col <= colunas; col++) {
            //console.log(lin + "" + col);
            document.getElementById(lin + "" + col).value = "";
        }
    };
}

function simulatedClick(target, options) {

    var event = target.ownerDocument.createEvent('MouseEvents'),
        options = options || {},
        opts = { // These are the default values, set up for un-modified left clicks
            type: 'click',
            canBubble: true,
            cancelable: true,
            view: target.ownerDocument.defaultView,
            detail: 1,
            screenX: 0, //The coordinates within the entire page
            screenY: 0,
            clientX: 0, //The coordinates within the viewport
            clientY: 0,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false, //I *think* 'meta' is 'Cmd/Apple' on Mac, and 'Windows key' on Win. Not sure, though!
            button: 0, //0 = left, 1 = middle, 2 = right
            relatedTarget: null,
        };

    //Merge the options with the defaults
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            opts[key] = options[key];
        }
    }

    //Pass in the options
    event.initMouseEvent(
        opts.type,
        opts.canBubble,
        opts.cancelable,
        opts.view,
        opts.detail,
        opts.screenX,
        opts.screenY,
        opts.clientX,
        opts.clientY,
        opts.ctrlKey,
        opts.altKey,
        opts.shiftKey,
        opts.metaKey,
        opts.button,
        opts.relatedTarget
    );

    //Fire the event
    target.dispatchEvent(event);
}


//https://developer.chrome.com/blog/new-in-chrome-79/#wake-lock
// The wake lock sentinel.
let wakeLock = null;

// Function that attempts to request a wake lock.
const requestWakeLock = async () => {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => {
            console.log('Wake Lock was released');
        });
        console.log('Wake Lock is active');
    } catch (err) {
        console.error(`${err.name}, ${err.message}`);
    }
};

// Function that attempts to release the wake lock.
const releaseWakeLock = async () => {
    if (!wakeLock) {
        return;
    }
    try {
        await wakeLock.release();
        wakeLock = null;
    } catch (err) {
        console.error(`${err.name}, ${err.message}`);
    }
};

const handleVisibilityChange = async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        await requestWakeLock();
    }
};

document.addEventListener('visibilitychange', handleVisibilityChange);