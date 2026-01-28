function initVolunteerTexts() {
    const TEXT = {
        infoTitle1: infoData[0].title,
        infoTitle2: infoData[1].title,
        infoTitle3: infoData[2].title,
        infoTitle4: infoData[3].title,

        infoTitle1work1: infoData[0].works[0].text,
        infoTitle1work2: infoData[0].works[1].text,
        infoTitle1work3: infoData[0].works[2].text,
        infoTitle1work4: infoData[0].works[3].text,

        infoTitle2work1: infoData[1].works[0].text,
        infoTitle2work2: infoData[1].works[1].text,
        infoTitle2work3: infoData[1].works[2].text,
        infoTitle2work4: infoData[1].works[3].text,
        infoTitle2work5: infoData[1].works[4].text,


        infoTitle3work1: infoData[2].works[0].text,
        infoTitle3work2: infoData[2].works[1].text,
        infoTitle3work3: infoData[2].works[2].text,

        infoTitle4work1: infoData[3].works[0].text,
    };

    function setTexts() {
        for (const [id, text] of Object.entries(TEXT)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = text;
            }
        }
    }
    setTexts();
    function loadInfoDetail(directionId) {
    // Находим данные направления
    const directionIndex = parseInt(directionId) - 1;
    const direction = infoData[directionIndex];
    
    if (!direction) {
        console.error("Направление не найдено");
        return;
    }
    
    // Меняем заголовок в header
    const pageElement = document.getElementById('page');
    if (pageElement) {
        pageElement.textContent = 'Информация о деятельности';
    }
    
    const titleElement = document.getElementById('title');
    if (titleElement) {
        titleElement.textContent = direction.title;
    }
    
    // Загружаем HTML шаблон
    fetch('assets/html/info-detail.html')
        .then(response => response.text())
        .then(html => {
            // Вставляем HTML в replace-content
            document.getElementById('replace-content').innerHTML = html;
            
            // Заполняем данными
            initDirectionDetail(directionId);
            
            // Добавляем обработчик для кнопки "Назад"
            const backButton = document.getElementById('backButton');
            if (backButton) {
                backButton.addEventListener('click', function() {
                    loadPage('info');
                });
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки шаблона:', error);
            loadPage('info');
        });
}

// Функция инициализации детальной информации
function initDirectionDetail(directionId) {
    const directionIndex = parseInt(directionId) - 1;
    const direction = infoData[directionIndex];
    
    if (!direction) return;
    
    // Заполняем заголовок и описание
    const titleElement = document.getElementById('directionTitle');
    const descriptionElement = document.getElementById('directionDescription');
    const imageElement = document.getElementById('directionImage');
    
    if (titleElement) titleElement.textContent = direction.title || 'Название направления';
    if (descriptionElement) descriptionElement.textContent = direction.description || 'Описание направления';
    if (imageElement && direction.image) {
        imageElement.src = direction.image;
        imageElement.alt = direction.title || 'Изображение направления';
    }
    
    // Создаем блоки с работами
    const worksContainer = document.getElementById('worksContainer');
    if (worksContainer && direction.works) {
        worksContainer.innerHTML = '';
        
        direction.works.forEach((work, index) => {
            const workItem = document.createElement('div');
            workItem.className = 'work-item';
            workItem.innerHTML = `
                <div class="work-item-header">
                    <span class="work-item-title">${work.text || `Работа ${index + 1}`}</span>
                    <div class="work-item-toggle"></div>
                </div>
                <div class="work-item-content">
                    <div class="work-item-text">${work.description || 'Подробное описание работы'}</div>
                </div>
            `;
            
            // Добавляем обработчик клика для разворачивания
            workItem.querySelector('.work-item-header').addEventListener('click', function() {
                workItem.classList.toggle('active');
            });
            
            worksContainer.appendChild(workItem);
        });
    }
}

// Добавляем data-id атрибуты в карточки
function addDataIdsToCards() {
    const cards = document.querySelectorAll('.info-page-content-cards__card');
    cards.forEach((card, index) => {
        card.setAttribute('data-id', (index + 1).toString());
    });
}

// Экспортируем функции
window.initVolunteerTexts = initVolunteerTexts;
window.loadInfoDetail = loadInfoDetail;
window.initDirectionDetail = initDirectionDetail;
window.addDataIdsToCards = addDataIdsToCards;
window.infoData = infoData;
}
