// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', () => {
    // Button references
    const aboutBtn = document.getElementById('about-btn');
    const contactBtn = document.getElementById('contact-btn');
    const selectGamesBtn = document.getElementById('select-games-btn');
  
    // Section references
    const aboutSection = document.getElementById('about-section');
    const contactSection = document.getElementById('contact-section');
    const selectGamesHeading = document.getElementById('select-games-heading');
    const gameButtons = document.getElementById('game-buttons');
  
    // Function to hide all sections
    function hideAllSections() {
      aboutSection.style.display = 'none';
      contactSection.style.display = 'none';
      selectGamesHeading.style.display = 'none';
      gameButtons.style.display = 'none';
    }
  
    // Event listeners for buttons
    aboutBtn.addEventListener('click', () => {
      hideAllSections();
      aboutSection.style.display = 'block';
    });
  
    contactBtn.addEventListener('click', () => {
      hideAllSections();
      contactSection.style.display = 'block';
    });
  
    selectGamesBtn.addEventListener('click', () => {
      hideAllSections();
      selectGamesHeading.style.display = 'block';
      gameButtons.style.display = 'flex';
    });
  });
  