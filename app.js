const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

// FETCH
fetch("https://puzzle.mead.io/puzzle?wordCount=1")
  .then(function (response) {
    return response.json()
  })
  .then(function (data) {
    // VARIABLE
    let word = $(".word")
    let word2 = $(".word2")
    let wrongLetters = $(".wrong-letters")
    let guessScore = $(".guesses")
    let tip = $(".tip")
    let restartBtns = $$(".play-again-btn")
    let alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let wrongLettersArr = []
    let randomWord = data.puzzle
    let guesses = Math.floor(randomWord.length * 1.25) // Default: 1.25x
    word.innerHTML = randomWord
    guessScore.innerHTML = "Guesses: " + guesses


    // MAIN

    // Create our hidden word (Makes *'s equal to the length of the answer)
    let i = 0
    while (i < word.innerHTML.length) {
      word2.innerHTML += "_"
      i++
    }

    //KEY DOWN
    document.addEventListener("keydown", function (e) {
      e.key = e.key.toLowerCase()
      // If the key === alphabet: All good
      for (let l of alphabet) {
        if (e.key === l) {
          // Add some padding if there's a letter showing inside the hidden answer
          if (allEqual(word2.innerHTML) === true) {
            console.log("ALL EQUAL")
            word2.style.lineHeight = ".75em"
          } else {
            console.log("NOT ALL EQUAL")
            word2.style.paddingBottom = ".25em"
          }

          // Fade away the tip at top of screen
          tip.style.opacity = 0
          checkIfContains(word.innerHTML, e.key)
        }
      }
    })

    // Checks if string contains this character and returns the index
    function checkIfContains(str, char) {
      str = str.toLowerCase()
      char = char.toLowerCase()
      let indices = []
      if (guesses > 1) {
        for (i = 0; i < str.length; i++) {
          if (str[i].includes(char)) {
            indices.push(i)
          }
          if (
            i === str.length - 1 &&
            str.includes(char) === false &&
            wrongLettersArr.includes(char) === false
          ) {
            guesses--
            guessScore.innerHTML = "Guesses : " + guesses
            wrongLettersArr.push(char)
            // Color the letters red
            wrongLetters.style.color = "#b3b3b3"
            // Display the wrong letters on the page
            wrongLetters.innerHTML = `${wrongLettersArr}`
          } else if (wrongLettersArr.includes(char) === true) {
            $(".already-guessed").style.opacity = 1
            setTimeout(function () {
              $(".already-guessed").style.opacity = 0
            }, 750)
          }
        }
      } else {
        guesses--
        guessScore.innerHTML = "Guesses : " + guesses
        setTimeout(function () {
          lose()
        }, 50)
      }

      // If the key === wrong letter: Alert

      if (indices.length > 0) {
        addMatchToString(word2.innerHTML, char, indices)
        return indices
      }
    }

    for (let btn of restartBtns) {
      btn.addEventListener("click", function () {
        console.log("HI")
        reload()
      })
    }

    // FUNCTIONS

    // Checks if all characters are equal and returns true or false
    function allEqual(str) {
      return str.split("").every((char) => char === str[0])
    }

    // Creates a new string with the characters revealed at the indexes of char
    function addMatchToString(str, char, indexes) {
      str = [...str]
      for (let i = 0; i < str.length; i++) {
        str[indexes[i]] = char
      }
      word2.innerHTML = capitalizeFirstLetter(str.join(""))
      if (word2.innerHTML.toLowerCase() === word.innerHTML.toLowerCase()) {
        setTimeout(function () {
          win()
        }, 50)
      } else {
        return capitalizeFirstLetter(str.join(""))
      }
    }

    // Capitalizes the first letter of argument
    function capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }

    // Removes main screen and displays loss screen
    function lose() {
      $(".main-container").style.display = "none"
      $(".lose-screen").style.display = "flex"
      $(".word-reveal-loss").innerHTML = "The word was: " + word.innerHTML
    }

    // Removes main screen and displays win screen
    function win() {
      $(".main-container").style.display = "none"
      $(".win-screen").style.display = "flex"
      $(".word-reveal-win").innerHTML = "The word was: " + word.innerHTML
    }

    // Reloads the page
    function reload() {
      window.location.reload()
    }
  })
  .catch(function (err) {
    console.log("Someting went wrong!", err)
  })
