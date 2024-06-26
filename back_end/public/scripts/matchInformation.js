/**
 * 
 * @description Opens a card that displays the information of the match
 * @returns: [Postcondition] Opens a card that displays the information of the match
 */


function closeDiv() {
    console.log('closeDiv')
    matchCard = document.getElementById('matchInformationCard')
    matchCard.style.display = 'none'
  }
  
  var observer = new MutationObserver(function(mutations) {
    var closeButton = document.getElementById('closeBtn');
    if (closeButton) {
      closeButton.addEventListener('click', closeDiv);
      console.log('matchInformation.js loaded');
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });