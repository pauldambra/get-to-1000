    var diffToNearest = function(n, i) {
        return (Math.ceil(i / n) * n) - i;
    };

    var setupRow = function(id, start, correctDiff, onCorrect) {
        return function() {
            var row = document.getElementById(id);
            row.style.display = "";

            if (row.querySelectorAll(".start").length > 0) {
                row.querySelectorAll(".start")[0].innerHTML = start;
            }

            var theInput = row.querySelectorAll("input")[0];
            theInput.focus();
            theInput.addEventListener('input', function(e) {
                var answer = parseInt(this.value, 10);
                var answerCorrect = answer === correctDiff;
                row.querySelectorAll(".tick")[0].style.display = answerCorrect ? "" : "none";
                row.querySelectorAll(".cross")[0].style.display = answerCorrect ? "none" : "";

                if (answerCorrect) {
                    setTimeout(onCorrect, 500)
                }
            });
        };
    };

    var start;
    var tensDiff;
    var nearestHundredStart;
    var hundredsDiff;
    var nearestThousandStart;
    var thousandDiff;
    var setupNearestThousand;
    var setupNearestHundred;
    var setupNearestTen;

    var hideAll = function(selector) {
        var nodes = document.querySelectorAll(selector);
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].style.display = "none";
        }
    }

    var unsetAll = function() {
        var nodes = document.querySelectorAll("input");
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].value = "";
        }
    }

    var ensureStartNumberDoesNotConfusinglyHaveZeroAsTheUnit = function(i) {
        var asString = '' + i;
        var onesInteger = asString[asString.length - 1];
        return onesInteger === '0' ? ++i : i;
    }

    var nextImage;
    var preloadNextCatUrl = function() {

        var catGifUrl = "https://thecatapi.com/api/images/get?format=src&type=gif";
        catGifUrl += "&cacheBuster=" + new Date().getTime();

        var i = new Image();
        i.style.height = '100%';
        i.style.width = '100%';
        i.style.objectFit = 'contain';
        i.onload = function() {
          console.log(catGifUrl, 'preloaded!')
          nextImage = i;

        }
                i.src = catGifUrl;
    }

    var addCatImage = function() {
        var theGif = document.getElementById("cat-gif");
        theGif.innerHTML = '';
        theGif.appendChild(nextImage);
    }

    var setupPage = function() {
        preloadNextCatUrl();

        start = (Math.floor(Math.random() * 1000) + 1);
        start = ensureStartNumberDoesNotConfusinglyHaveZeroAsTheUnit(start);

        tensDiff = diffToNearest(10, start);
        nearestHundredStart = start + tensDiff;
        hundredsDiff = diffToNearest(100, nearestHundredStart);
        nearestThousandStart = nearestHundredStart + hundredsDiff;
        thousandDiff = diffToNearest(1000, nearestThousandStart);

        hideAll(".row");
        hideAll(".mark-holder span");
        unsetAll();

        var initialRow = document.getElementById("initial-number");
        initialRow.style.display = "";
        initialRow.innerHTML = 'Your starting number is ' + start;

        setupNearestThousand = setupRow("nearest-thousand", nearestThousandStart, thousandDiff, showDoneButton);
        setupNearestHundred = setupRow("nearest-hundred", nearestHundredStart, hundredsDiff, setupNearestThousand);
        setupNearestTen = setupRow("nearest-ten", start, tensDiff, setupNearestHundred);

        setupNearestTen();
    };

    document.getElementById("done").addEventListener("click", function() {
        setupPage();
    });

    var showDoneButton = function() {
        hideAll(".row");
        var buttonHolder = document.getElementById("done");
        buttonHolder.querySelectorAll(".result")[0].innerHTML = start + " + " + tensDiff + " + " + hundredsDiff + " + " + thousandDiff + " = 1000"
        buttonHolder.querySelectorAll("button")[0].innerHTML = "Awesome work! Again?";
        addCatImage();
        document.getElementById("done").style.display = "";
    };

    setupPage();