document.getElementById('fetch-dog').addEventListener('click', () => {
    const imageContainer = document.getElementById('dog-image-container');
    const imageElement = document.getElementById('dog-image');
  
    // API 호출
    fetch('https://dog.ceo/api/breeds/image/random')
      .then(response => response.json())
      .then(data => {
        imageElement.src = data.message; // API에서 받은 이미지 URL을 설정
        imageContainer.style.display = 'block'; // 이미지를 표시
      })
      .catch(error => {
        console.error('Error fetching dog image:', error);
      });
  });
  