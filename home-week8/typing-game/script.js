let words = [];
let wordIndex = 0;
let startTime = Date.now();
let highScore = localStorage.getItem('highScore') || Infinity;

const quotes = [
  "철창 속 철학자는 철저하게 철사를 채워 철판을 철썩 붙였다.",
  "청량리 철도청 창살 사이로 찬바람이 차갑게 지나간다.",
  "칠판에 칠한 칠을 칠하고 다시 칠하니, 칠이 더 진해졌다.",
  "쌍철창을 채운 경찰청 직원이 철사줄을 철저하게 철거했다.",
  "창밖 철새는 청창에 부딪혀 창살을 철썩 철거하려고 날았다."
];

const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const startButton = document.getElementById('start');
const modal = document.getElementById('result-modal');
const modalMessage = document.getElementById('modal-message');
const highScoreMessage = document.getElementById('high-score-message');
const closeBtn = document.querySelector('.close-btn');

// 게임 시작 함수
startButton.addEventListener('click', () => {
  const quoteIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[quoteIndex];
  words = quote.split(' ');
  wordIndex = 0;

  // 단어를 span 요소로 변환하고 첫 번째 단어에 하이라이트 추가
  const spanWords = words.map(word => `<span>${word} </span>`);
  quoteElement.innerHTML = spanWords.join('');
  quoteElement.childNodes[0].className = 'highlight';

  // 메시지 및 입력 초기화
  messageElement.innerText = '';
  typedValueElement.value = '';
  typedValueElement.disabled = false;
  startButton.disabled = true;
  typedValueElement.classList.remove('active');
  typedValueElement.focus();

  // 게임 시작 시간 기록
  startTime = new Date().getTime();
});

// 입력 필드에서 입력이 발생할 때 처리
typedValueElement.addEventListener('input', () => {
  typedValueElement.classList.add('active'); // 입력 시 CSS 효과 추가
  const currentWord = words[wordIndex];
  const typedValue = typedValueElement.value;

  // 모든 단어를 올바르게 입력했을 때
  if (typedValue === currentWord && wordIndex === words.length - 1) {
    const elapsedTime = new Date().getTime() - startTime;
    const elapsedTimeInSeconds = (elapsedTime / 1000).toFixed(2);
    const message = `${elapsedTimeInSeconds} 초 컷`;
    messageElement.innerText = message;

    // 최고 기록 갱신
    if (elapsedTime < highScore) {
      highScore = elapsedTime;
      localStorage.setItem('highScore', highScore);
      highScoreMessage.innerText = `축하합니다! 새로운 최고 기록: ${elapsedTimeInSeconds} 초`;
    } else {
      highScoreMessage.innerText = `최고 기록: ${(highScore / 1000).toFixed(2)} 초`;
    }

    // 모달 창에 결과 표시
    modalMessage.innerText = message;
    modal.style.display = 'block';

    // 게임 종료 후 입력 비활성화
    endGame();
  } 
  // 현재 단어가 정확하게 입력되었고, 공백으로 끝날 때 다음 단어로 이동
  else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
    typedValueElement.value = '';
    wordIndex++;
    
    // 모든 단어의 강조 표시 제거
    for (const wordElement of quoteElement.childNodes) {
      wordElement.className = '';
    }
    
    // 다음 단어에 강조 표시 추가
    if (wordIndex < quoteElement.childNodes.length) {
      quoteElement.childNodes[wordIndex].className = 'highlight';
    }
  } 

  else if (currentWord.startsWith(typedValue)) {
    typedValueElement.className = '';
  } else {
    typedValueElement.className = 'error';
  }
});

// 게임 종료 함수
function endGame() {
  typedValueElement.disabled = true;
  startButton.disabled = false;
  startButton.innerText = '다시 시작';
}

// 모달 창 닫기
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// 모달 창을 클릭하면 닫히게 하기
window.addEventListener('click', (event) => {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});
