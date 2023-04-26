window.onload = function(){
    document.body.focus();
    clearDisplay();
}

display = document.getElementById("display");
hasEvaluated = false;
inputKeys = new Set(["1","2","3","4","5","6","7","8","9","0","+","-","*","/",".","(",")","%"])
numericKeys = new Set(["1","2","3","4","5","6","7","8","9","0"])
evaluateKey = "Enter"
backspaceKey = "Backspace"
errorMsg = "ERROR"
buttons = document.getElementsByTagName("button")

// Disable button trigger on pressing "Enter".
Array.from(buttons).forEach(element => {
    element.addEventListener("keydown", function(event){
        if(event.key=="Enter"){
            event.preventDefault();
        }
    });
});

display.onkeypress = function(e){
    // console.log(e.target.selectionStart)
    console.log(e.key)
    if(!inputKeys.has(e.key)){
        return false;
    }
}

// display.onkeyup = function(e){
//     console.log(e.target.selectionStart)
// }

// display.onclick = function(e){
//     console.log(e.target.selectionStart)
// }

historyOn = false;
historyDropdown = document.getElementById("history-block");
document.addEventListener("click", function(event){
    if(event.target.id=='history-button'){
        return;
    }
    if(!historyDropdown.contains(event.target) || event.target.className == "history-dd-button"){
        historyOn = false;
        $('#history-block').hide()
    }

})
$('#history-button').click(function(event) {
    historyOn = !historyOn;
    if(historyOn)
        displayHistory();
    $('#history-button').toggleClass('show-history');
    $('#history-block').slideToggle();
});

// Handle keydown events in calculator. Ignore keydown if focus is on the display box (to prevent repeated handling).

document.addEventListener("keydown", function(event){
    historyOn = false;
    $('#history-block').hide();
    if(document.activeElement.id!="display")
        keydownEventHandler(event);
});

// Evaluate expression if "Enter" is hit in the input box.
document.getElementById("display").addEventListener("keyup", function(event){
    // console.log('event1');
    if(event.key==backspaceKey && display.innerHTML == '<br>'){
        // console.log('its empty')
        display.innerHTML = '';

    }
    console.log(display.innerHTML);
})
document.getElementById("display").addEventListener("keydown", function(event){
    // console.log('event2');
    if(event.key=="Enter"){
        evaluateExpression();
    }
})

// Keydown handler
function keydownEventHandler(event){
    if(event.repeat)
        return;
    key = event.key;
    if(key == backspaceKey)
        backSpace()
    else if(key == evaluateKey){
        evaluateExpression()
    }
    else if(inputKeys.has(key)){
        changeDisplay(key)
    }
}

function backSpace(){
    if(display.innerHTML == errorMsg)
        clearDisplay()
    else{
        display.innerHTML = display.innerHTML.slice(0, -1);
        if(display.innerHTML == "")
            clearDisplay()
    }
}

function changeDisplay(value, resetDisplay=false){    
    if(display.innerHTML == errorMsg){
        display.innerHTML = value;
        return;
    }
        
    if(display.innerHTML == errorMsg || ((display.innerHTML == "0" || hasEvaluated) && numericKeys.has(value)) || resetDisplay){
        display.innerHTML = "";
    }

    if(hasEvaluated)
        hasEvaluated = false;

    display.innerHTML += value;
}

function evaluateExpression(){
    hasEvaluated = true;
    expression = display.innerHTML;
    console.log(expression, expression.length)
    if(expression.length == 0)
        return clearDisplay();
    try{
        result = math.evaluate(expression).toString();
        display.innerHTML = result;
        if(isNaN(expression))
            store(expression, result);
    } 
    catch (error){
        display.innerHTML = errorMsg;
        console.log(error)
    }
}

function clearDisplay(){
    display.innerHTML = 0;
}

async function store(expr, result){
    currentStore = await browser.storage.local.get({'calculator_storage':[]});
    currentStore = currentStore['calculator_storage'];
    // console.log(typeof currentStore);
    currentStore.push([expr, result]);
    // console.log(currentStore)
    browser.storage.local.set({
        'calculator_storage': currentStore
    });
}

async function clearHistory(){
    await browser.storage.local.clear();
    return displayHistory();
}
async function displayHistory(){
    historyContent = document.getElementById("history-content");
    clearHistoryButton = document.getElementById("clear-history");
    currentStore = await browser.storage.local.get({'calculator_storage':[]});
    currentStore = currentStore['calculator_storage'];
    if(currentStore.length == 0){
        clearHistoryButton.style.display = 'none';
        historyContent.innerHTML = "No calculations in storage";
        // console.log(clearHistoryButton.style.display)
        return;
    }
    clearHistoryButton.style.display = 'block';
    displayHtml = "";
    tableBodyString = "";
    currentStore.forEach(entry => {
        lhs = entry[0];
        rhs = entry[1];
        lhsCellString = `<button name="${lhs}" onclick="clearDisplay(); changeDisplay(this.name, true)" class="history-dd-button">${lhs}</button>`
        rhsCellString = `<button name="${rhs}" onclick="clearDisplay(); changeDisplay(this.name, true)" class="history-dd-button">${rhs}</button>`
        rowString = `${lhsCellString} = ${rhsCellString}<br>`
        tableBodyString = rowString + tableBodyString;
    });
    historyTable = `${tableBodyString}`
    
    historyContent.innerHTML = historyTable
}

// function parseExpression(expr){
//     parsedExpr = "";
//     for(i=0;i<expr.length;i++){
//         if(!isNaN(expr[i]))
//             parsedExpr += expr[i];
//         else if()
//     }
// }