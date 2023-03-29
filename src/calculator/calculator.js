window.onload = function(){
    document.getElementById("calculator").focus()
}
// console.log(document.activeElement)
// displayValue = "";
hasEvaluated = false;
inputKeys = new Set(["1","2","3","4","5","6","7","8","9","0","+","-","*","/",".","(",")","%","Backspace"])
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

// Handle keydown events in calculator. Ignore keydown if focus is on the display box (to prevent repeated handling).
document.getElementById("calculator").addEventListener("keydown", function(event){
    if(document.activeElement.id!="display")
        keydownEventHandler(event);
});

// Evaluate expression if "Enter" is hit in the input box.
document.getElementById("display").addEventListener("keydown", function(event){
    if(event.key=="Enter"){
        evaluateExpression();
    }
})

// Keydown handler
function keydownEventHandler(event){
    if(event.repeat)
        return;
    key = event.key;
    if(inputKeys.has(key)){
        changeDisplay(key)
    }
    else if(key==evaluateKey){
        evaluateExpression()
    }
}

function changeDisplay(name){
    display = document.getElementById("display");
    if(display.value=="0" && name=="0")
        return;
    
    if(name==backspaceKey){
        if(display.value==errorMsg)
            display.value = ""
        else
            display.value = display.value.slice(0, -1);
        if(display.value=="")
            display.value = "0";
        return;
    }

    if(hasEvaluated || display.value=="0"){
        if(!isNaN(name)){
            display.value = "";
        }
        if(hasEvaluated)
            hasEvaluated = false;
    }
    display.value += name;
}

function evaluateExpression(){
    hasEvaluated = true;
    display = document.getElementById("display");
    expression = display.value;
    try{
        result = eval(expression).toString();
        display.value = result;
        if(isNaN(expression))
            store(expression, result);
    } 
    catch (error){
        display.value = "ERROR";
        console.log(error)
    }
}

function clearDisplay(){
    document.getElementById("display").value = 0;
}

async function store(expr, result){
    currentStore = await browser.storage.local.get({'calculator_storage':[]});
    currentStore = currentStore['calculator_storage'];
    console.log(typeof currentStore);
    // console.log(currentStore['calculator_storage']);
    currentStore.push([expr, result]);
    console.log(currentStore)
    browser.storage.local.set({
        'calculator_storage': currentStore
    });
}

// function parseExpression(expr){
//     parsedExpr = "";
//     for(i=0;i<expr.length;i++){
//         if(!isNaN(expr[i]))
//             parsedExpr += expr[i];
//         else if()
//     }
// }