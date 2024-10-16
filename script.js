function playGame(playerChoice) {
  const choices = ['rock', 'paper', 'scissors'];  // Array of possible choices
  const computerChoice = choices[Math.floor(Math.random() * 3)];  // Random choice for the computer
  let result = '';

  // Determine the result
  if (playerChoice === computerChoice) {
    result = `It's a tie! You both chose ${playerChoice}.`;
  } else if (
    (playerChoice === 'rock' && computerChoice === 'scissors') ||
    (playerChoice === 'scissors' && computerChoice === 'paper') ||
    (playerChoice === 'paper' && computerChoice === 'rock')
  ) {
    result = `You win! ${playerChoice} beats ${computerChoice}.`;
  } else {
    result = `You lose! ${computerChoice} beats ${playerChoice}.`;
  }

  // Display the result in the HTML
  document.getElementById('result').innerText = result;
}
