//window.onload = function ()  
setTimeout(function () {
    var $typeContent = $("[class='φee']");
    $typeContent.append('<span id="typer"></span>');
    $typeContent.attr("style", "height:2.83rem; display:block;");
    var options = {
        strings: ["The depth of thinking", "determines your altitude."],
        typeSpeed: 40,
        contentType: 'html',
        loop: true,
        showCursor: false,
        backSpeed: 25,
        smartBackspace: true,
        backDelay: 1000
    };
    var typed = new Typed("#typer", options);
}, 1300);

