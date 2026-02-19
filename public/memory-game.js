// QazaqStep - Memory Cards Mini-Game
// Uses vocabularyCards from the current lesson to create a card-matching game

class MemoryGame {
    constructor(vocabularyCards) {
        this.vocabularyCards = vocabularyCards;
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.totalPairs = 0;
        this.moves = 0;
        this.timer = null;
        this.seconds = 0;
        this.isLocked = false;
        this.gameStarted = false;
        this.gameCompleted = false;

        this.gridEl = document.getElementById('memoryGameGrid');
        this.timerEl = document.getElementById('memoryTimer');
        this.movesEl = document.getElementById('memoryMoves');
        this.scoreEl = document.getElementById('memoryScore');
        this.gameContainer = document.getElementById('memoryGameContainer');
        this.resultsOverlay = document.getElementById('memoryResults');
    }

    // Parse vocabulary cards from "word - translation" format
    parseVocabulary() {
        const pairs = [];
        for (const card of this.vocabularyCards) {
            const parts = card.split(' - ');
            if (parts.length >= 2) {
                pairs.push({
                    word: parts[0].trim(),
                    translation: parts[1].trim()
                });
            }
        }
        return pairs;
    }

    // Create card pairs and shuffle
    generateCards() {
        const pairs = this.parseVocabulary();
        // Limit to 6 pairs max for a good grid layout
        const selectedPairs = pairs.slice(0, 6);
        this.totalPairs = selectedPairs.length;

        this.cards = [];
        selectedPairs.forEach((pair, index) => {
            // Card for the Kazakh word
            this.cards.push({
                id: `word-${index}`,
                pairId: index,
                text: pair.word,
                type: 'word',
                isFlipped: false,
                isMatched: false
            });
            // Card for the translation
            this.cards.push({
                id: `trans-${index}`,
                pairId: index,
                text: pair.translation,
                type: 'translation',
                isFlipped: false,
                isMatched: false
            });
        });

        // Fisher-Yates shuffle
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    // Start the game
    start() {
        if (this.vocabularyCards.length === 0) {
            this.showNoVocabularyMessage();
            return;
        }

        this.reset();
        this.generateCards();
        this.renderGrid();
        this.gameContainer.style.display = 'block';
        this.resultsOverlay.style.display = 'none';
        this.gameStarted = true;
        this.startTimer();
    }

    // Reset all game state
    reset() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.seconds = 0;
        this.isLocked = false;
        this.gameStarted = false;
        this.gameCompleted = false;
        this.stopTimer();
        this.updateDisplay();
    }

    // Render the card grid
    renderGrid() {
        if (!this.gridEl) return;

        this.gridEl.innerHTML = this.cards.map((card, index) => `
            <div class="memory-card" data-index="${index}" id="memory-card-${index}">
                <div class="memory-card-inner">
                    <div class="memory-card-front">
                        <span class="memory-card-icon">❓</span>
                    </div>
                    <div class="memory-card-back">
                        <span class="memory-card-text">${card.text}</span>
                        <span class="memory-card-type">${card.type === 'word' ? '🇰🇿' : '🌐'}</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Attach click handlers
        this.gridEl.querySelectorAll('.memory-card').forEach(cardEl => {
            cardEl.addEventListener('click', () => {
                const index = parseInt(cardEl.dataset.index);
                this.flipCard(index);
            });
        });
    }

    // Handle card flip
    flipCard(index) {
        const card = this.cards[index];

        // Ignore if locked, already flipped, or already matched
        if (this.isLocked || card.isFlipped || card.isMatched) return;

        // Flip the card
        card.isFlipped = true;
        this.flippedCards.push(index);
        this.updateCardUI(index);

        // Check for match when two cards are flipped
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateDisplay();
            this.checkMatch();
        }
    }

    // Update a single card's visual state
    updateCardUI(index) {
        const card = this.cards[index];
        const cardEl = document.getElementById(`memory-card-${index}`);
        if (!cardEl) return;

        if (card.isFlipped || card.isMatched) {
            cardEl.classList.add('flipped');
        } else {
            cardEl.classList.remove('flipped');
        }

        if (card.isMatched) {
            cardEl.classList.add('matched');
        }
    }

    // Check if two flipped cards match
    checkMatch() {
        this.isLocked = true;
        const [idx1, idx2] = this.flippedCards;
        const card1 = this.cards[idx1];
        const card2 = this.cards[idx2];

        if (card1.pairId === card2.pairId && card1.type !== card2.type) {
            // Match found!
            card1.isMatched = true;
            card2.isMatched = true;
            this.matchedPairs++;

            setTimeout(() => {
                this.updateCardUI(idx1);
                this.updateCardUI(idx2);
                this.flippedCards = [];
                this.isLocked = false;
                this.updateDisplay();

                // Check if game is complete
                if (this.matchedPairs === this.totalPairs) {
                    this.completeGame();
                }
            }, 300);
        } else {
            // No match — flip back after delay
            setTimeout(() => {
                card1.isFlipped = false;
                card2.isFlipped = false;
                this.updateCardUI(idx1);
                this.updateCardUI(idx2);
                this.flippedCards = [];
                this.isLocked = false;
            }, 800);
        }
    }

    // Timer
    startTimer() {
        this.stopTimer();
        this.timer = setInterval(() => {
            this.seconds++;
            this.updateDisplay();
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    formatTime(totalSeconds) {
        const min = Math.floor(totalSeconds / 60);
        const sec = totalSeconds % 60;
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }

    // Update stats display
    updateDisplay() {
        if (this.timerEl) {
            this.timerEl.textContent = this.formatTime(this.seconds);
        }
        if (this.movesEl) {
            this.movesEl.textContent = this.moves;
        }
        if (this.scoreEl) {
            this.scoreEl.textContent = `${this.matchedPairs}/${this.totalPairs}`;
        }
    }

    // Calculate points earned
    calculatePoints() {
        // Base points per pair matched
        const basePoints = this.totalPairs * 10;
        // Time bonus: faster = more points (diminishes after 60 seconds)
        const timeBonus = Math.max(0, 60 - this.seconds) * 2;
        // Efficiency bonus: fewer moves = more points
        const perfectMoves = this.totalPairs; // minimum possible moves is totalPairs
        const efficiency = Math.max(0, (perfectMoves * 3 - this.moves)) * 3;
        return Math.max(10, basePoints + timeBonus + efficiency);
    }

    // Game complete
    completeGame() {
        this.stopTimer();
        this.gameCompleted = true;

        const points = this.calculatePoints();

        // Show results
        if (this.resultsOverlay) {
            const lang = localStorage.getItem('language') || 'en';
            const tCongrats = (typeof getText === 'function') ? getText('memory_game_congrats') : 'Congratulations! 🎉';
            const tTime = (typeof getText === 'function') ? getText('memory_game_time') : 'Time';
            const tMoves = (typeof getText === 'function') ? getText('memory_game_total_moves') : 'Moves';
            const tPoints = (typeof getText === 'function') ? getText('memory_game_points_earned') : 'Points Earned';
            const tPlayAgain = (typeof getText === 'function') ? getText('memory_game_play_again') : 'Play Again';

            this.resultsOverlay.innerHTML = `
                <div class="memory-results-card">
                    <div class="memory-results-icon">🏆</div>
                    <h3 class="memory-results-title">${tCongrats}</h3>
                    <div class="memory-results-stats">
                        <div class="memory-result-stat">
                            <span class="memory-result-label">⏱ ${tTime}</span>
                            <span class="memory-result-value">${this.formatTime(this.seconds)}</span>
                        </div>
                        <div class="memory-result-stat">
                            <span class="memory-result-label">🔄 ${tMoves}</span>
                            <span class="memory-result-value">${this.moves}</span>
                        </div>
                        <div class="memory-result-stat highlight">
                            <span class="memory-result-label">⭐ ${tPoints}</span>
                            <span class="memory-result-value">+${points}</span>
                        </div>
                    </div>
                    <button class="btn-primary memory-play-again-btn" id="memoryPlayAgainBtn">${tPlayAgain}</button>
                </div>
            `;
            this.resultsOverlay.style.display = 'flex';

            // Play again button
            document.getElementById('memoryPlayAgainBtn').addEventListener('click', () => {
                this.start();
            });
        }

        // Award points using existing lesson.js function
        if (typeof updatePoints === 'function') {
            updatePoints(points);
        }
    }

    // Show message when no vocabulary cards are available
    showNoVocabularyMessage() {
        if (this.gameContainer) {
            const msg = (typeof getText === 'function') ? getText('memory_game_no_vocab') : 'No vocabulary cards available for this game.';
            this.gameContainer.style.display = 'block';
            this.gameContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #999;">
                    <p style="font-size: 1.2rem;">📭 ${msg}</p>
                </div>
            `;
        }
    }
}

// Global instance
let memoryGameInstance = null;

function startMemoryGame() {
    if (!currentLesson) return;

    const vocabCards = currentLesson.vocabularyCards || [];
    memoryGameInstance = new MemoryGame(vocabCards);
    memoryGameInstance.start();

    // Scroll to game section
    const section = document.getElementById('memoryGameSection');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
