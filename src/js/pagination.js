// Кол-во новостей на странице
const ITEMS_PER_PAGE = 6;

// Глобальные переменные для состояния
let currentPage = 1;
let totalPages = 1;
let isInitialized = false; // Флаг инициализации

let newsPagesContainer;
let pageNumbersContainer;
let prevBtn;
let nextBtn;
let firstBtn;
let lastBtn;
let pageInfo;

// Обновление пагинации при возвращении на страницу
function refreshPagination() {
    initNewsPagination();
}

// Инициализация элементов DOM
function initElements() {
    newsPagesContainer = document.getElementById('news-pages-container');
    pageNumbersContainer = document.getElementById('page-numbers');
    prevBtn = document.getElementById('prev-btn');
    nextBtn = document.getElementById('next-btn');
    firstBtn = document.getElementById('first-btn');
    lastBtn = document.getElementById('last-btn');
    pageInfo = document.getElementById('page-info');
}

// Инициализация пагинации при загрузке страницы с новостями
function initNewsPagination() {
    // Элементы в DOM
    initElements();

    // Сброс контейнеров
    newsPagesContainer.innerHTML = '';
    pageNumbersContainer.innerHTML = '';

    totalPages = Math.ceil(newsData.length / ITEMS_PER_PAGE);
    currentPage = 1; // Сброс на первую страницу

    createNewsPages();
    updatePageNavigation();
    showPage(1);
    addEventListeners();

    isInitialized = true;
}

// Создание страниц с новостями
function createNewsPages() {
    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
        const pageElement = document.createElement('div');
        pageElement.className = 'news-page';
        pageElement.id = `page-${pageIndex + 1}`;

        const newsList = document.createElement('div');
        newsList.className = 'news-list';

        // Определение новостей для текущей страницы
        const startIndex = pageIndex * ITEMS_PER_PAGE;
        const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, newsData.length);
        const pageNews = newsData.slice(startIndex, endIndex);

        // Добавление новостей на страницу
        pageNews.forEach((news, index) => {
            const newsItem = document.createElement('a');
            newsItem.className = 'news-item';
            newsItem.href = news.href;

            // Оппределение четности для выбора стороны фотографии новости
            const isEven = index % 2 === 0;

            newsItem.innerHTML = `
                <div class="news-content-wrapper ${isEven ? 'image-right' : 'image-left'}">
                    ${news.image && news.image !== 'assets/images/' ?
                    `<div class="news-image-container">
                            <img src="${news.image}" alt="${news.title}" loading="lazy">
                        </div>`:
                    '<div class="news-image-container placeholder"></div>'
                }
                    <div class="news-text-content">
                        <h3>${news.title}</h3>
                        ${news.category ? `<span class="news-category">${news.category}</span>` : ''}
                        <p>${news.description}</p>
                        <span class="news-date">${news.date}</span>
                    </div>
                </div>
            `;
            newsList.appendChild(newsItem);
        });

        pageElement.appendChild(newsList);
        newsPagesContainer.appendChild(pageElement);
    }
}

// Показать определенную страницу
function showPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > totalPages) {
        console.error(`Некорректный номер страницы: ${pageNumber}`);
        return;
    }

    // Скрытие всех страниц
    const allPages = document.querySelectorAll('.news-page');
    allPages.forEach(page => {
        page.classList.remove('active');
    });

    // Показ только выбранной страницы
    const activePage = document.getElementById(`page-${pageNumber}`);
    if (activePage) {
        activePage.classList.add('active');
    }

    currentPage = pageNumber;
    updatePageNavigation();
    updatePageInfo();
    updateEdgeButtons();
}

// Обновление навигации
function updatePageNavigation() {
    if (!pageNumbersContainer) return;

    pageNumbersContainer.innerHTML = '';

    // Диапазон отображаемых страниц
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // Коррекция диапозонов 
    if (currentPage <= 3) {
        endPage = Math.min(5, totalPages);
    }

    if (currentPage >= totalPages - 2) {
        startPage = Math.max(totalPages - 4, 1);
    }

    // Кнопка для первой страницы
    if (startPage > 1) {
        addPageButton(1);
        if (startPage > 2) {
            addEllipsis();
        }
    }
    // Кнопки для страниц в диапазоне
    for (let i = startPage; i <= endPage; i++) {
        addPageButton(i);
    }
    // Кнопка для последней страницы
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            addEllipsis();
        }
        addPageButton(totalPages);
    }

    // Состояние кнопок "Назад" и "Вперед"
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
}

// Обновление состояния кнопок в начало/конец
function updateEdgeButtons() {
    if (firstBtn) firstBtn.disabled = currentPage === 1;
    if (lastBtn) lastBtn.disabled = currentPage === totalPages;
}

// Добавление страницы
function addPageButton(pageNumber) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `page-btn ${pageNumber === currentPage ? 'active' : ''}`;
    pageBtn.textContent = pageNumber;
    pageBtn.addEventListener('click', function () {
        showPage(pageNumber);
        scrollToTop();
    });
    pageNumbersContainer.appendChild(pageBtn);
}

// Добавление троеточия
function addEllipsis() {
    const ellipsis = document.createElement('span');
    ellipsis.textContent = '...';
    ellipsis.style.padding = '8px 5px';
    pageNumbersContainer.appendChild(ellipsis);
}

// Информация о странице
function updatePageInfo() {
    if (pageInfo) {
        pageInfo.textContent = `Страница ${currentPage} из ${totalPages}`;
    }
}

//Перенос к хедеру
function scrollToTop() {
    document.getElementById("header").scrollIntoView({
        behavior: 'smooth'
    });
}
//Перенос к навигации (для удобства)
function scrollToNav() {
    document.getElementById("first-btn").scrollIntoView({
        behavior: 'smooth',
        block: 'center',
    });
}


// Добавление обработчиков событий
function addEventListeners() {
    // Поведение кнопки "Назад"
    if (prevBtn) {
        prevBtn.onclick = function () {
            if (currentPage > 1) {
                showPage(currentPage - 1);
            }
            scrollToNav()
        };
    }

    // Поведение кнопки "Вперед"
    if (nextBtn) {
        nextBtn.onclick = function () {
            if (currentPage < totalPages) {
                showPage(currentPage + 1);
            }
            scrollToNav()
        };
    }

    // Поведение кнопки "В начало"
    if (firstBtn) {
        firstBtn.onclick = function () {
            if (currentPage > 1) {
                showPage(1);
            }
            scrollToNav()
        };
    }

    // Поведение кнопки "В конец"
    if (lastBtn) {
        lastBtn.onclick = function () {
            if (currentPage < totalPages) {
                showPage(totalPages);
            }
            scrollToNav()
        };
    }
}

// Функция для изменения количества новостей на странице
function setItemsPerPage(count) {
    if (count > 0) {
        ITEMS_PER_PAGE = count;
        isInitialized = false; // Сбрасывает флаг инициализации
        initNewsPagination(); // Переинициализируем
    }
}
