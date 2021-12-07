// global value to save the last given input
var lastInput = "";

// output functions are configurable.  This one just appends some text
// to a pre element.
var editor;
function outf(text) {
    var mypre = document.getElementById("output"); 
    mypre.innerHTML = mypre.innerHTML + text; 
} 

function inputf(prompt) {
    // the function returns a promise to give a result back later...
    return new Promise(function(resolve,reject){
        
        // append new temporary input element inside the output div with the last input value
        $("#output").append("<label>" + (prompt || "") + "</label><input id='input' value='"+lastInput+"' placeholder='" + ("value:") + "' />");
        // focus + select the new input
        $("#input").focus().select();
        
        // listen to ENTER event on the new input
        $("#input").on("keyup",function(e){
            if (e.keyCode == 13) {
                // remove keyup handler from #output
                $("#input").off("keyup");
                // resolve the promise with the value of the input field
                lastInput = $("#input").val();
                resolve($("#input").val());
                
                // add the input value to the output div
                $("#output").append($("#input").val() + "<br />");
                // remove the temporary input element
                $("#input").remove();
            }
        });
    });
}

function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}
// Here's everything you need to run a python program in skulpt
// grab the code from your textarea
// get a reference to your pre element for output
// configure the output function
// call Sk.importMainWithBody()
function runit() {

   var prog = document.getElementById("yourcode").value; 
   var mypre = document.getElementById("output"); 
   mypre.innerHTML = ''; 
   Sk.pre = "output";
   Sk.configure({
       /*inputfun: function (prompt) {
         return window.prompt(prompt);
       },*/
       inputfun: inputf,
       inputfunTakesPrompt: true,
       output:outf,
       read:builtinRead,
       __future__: Sk.python3
   }); 
   (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas';
   Sk.TurtleGraphics.width = 600; Sk.TurtleGraphics.height = 600;
   
   var myPromise = Sk.misceval.asyncToPromise(function() {
       return Sk.importMainWithBody("<stdin>", false, prog, true);
   });
   myPromise.then(function(mod) {
       //console.log('success');
   },
       function(err) {
       console.log(err.toString());
   });
}

window.onload = runit;


//Onclick home btn
function openWindow(url) {
    window.open(url, '_blank').focus();
}
