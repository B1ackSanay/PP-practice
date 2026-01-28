// Кол-во новостей на странице
const ITEMS_PER_PAGE = 6;

// Состояние
let currentPage = 1;
let totalPages = 1;

// DOM
let newsPagesContainer;
let pageNumbersContainer;
let prevBtn;
let nextBtn;
let firstBtn;
let lastBtn;
let pageInfo;

// === PUBLIC ===
function refreshPagination() {
    if (!Array.isArray(newsData)) return;
    initNewsPagination();
}

// === INIT ===
function initElements() {
    newsPagesContainer = document.getElementById('news-pages-container');
    pageNumbersContainer = document.getElementById('page-numbers');
    prevBtn = document.getElementById('prev-btn');
    nextBtn = document.getElementById('next-btn');
    firstBtn = document.getElementById('first-btn');
    lastBtn = document.getElementById('last-btn');
    pageInfo = document.getElementById('page-info');
}

function initNewsPagination() {
    initElements();

    if (!newsPagesContainer || !pageNumbersContainer) return;

    newsPagesContainer.innerHTML = '';
    pageNumbersContainer.innerHTML = '';

    totalPages = Math.ceil(newsData.length / ITEMS_PER_PAGE);
    currentPage = 1;

    createNewsPages();
    showPage(1);
    updatePageNavigation();
    updatePageInfo();
    updateEdgeButtons();
    addEventListeners();
}

// === CREATE PAGES ===
function createNewsPages() {
    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
        const pageElement = document.createElement('div');
        pageElement.className = 'news-page';
        pageElement.id = `page-${pageIndex + 1}`;

        const newsList = document.createElement('div');
        newsList.className = 'news-list';

        const start = pageIndex * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;

        newsData.slice(start, end).forEach((news, index) => {
            const newsItem = document.createElement('a');
            newsItem.className = 'news-item';
            newsItem.href = news.href;

            const isEven = index % 2 === 0;

            newsItem.innerHTML = `
                <div class="news-content-wrapper ${isEven ? 'image-right' : 'image-left'}">
                    ${
                        news.image && news.image !== 'assets/images/'
                            ? `<div class="news-image-container">
                                    <img src="${news.image}" alt="${news.title}" loading="lazy">
                               </div>`
                            : `<div class="news-image-container placeholder"></div>`
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

// === SHOW PAGE ===
function showPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > totalPages) return;

    document.querySelectorAll('.news-page').forEach(p => {
        p.classList.remove('active');
    });

    document.getElementById(`page-${pageNumber}`)?.classList.add('active');

    currentPage = pageNumber;
    updatePageNavigation();
    updatePageInfo();
    updateEdgeButtons();
}

// === NAVIGATION ===
function updatePageNavigation() {
    pageNumbersContainer.innerHTML = '';

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
        endPage = Math.min(5, totalPages);
    }

    if (currentPage >= totalPages - 2) {
        startPage = Math.max(totalPages - 4, 1);
    }

    if (startPage > 1) {
        addPageButton(1);
        if (startPage > 2) addEllipsis();
    }

    for (let i = startPage; i <= endPage; i++) {
        addPageButton(i);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) addEllipsis();
        addPageButton(totalPages);
    }

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

// === HELPERS ===
function addPageButton(pageNumber) {
    const btn = document.createElement('button');
    btn.className = `page-btn ${pageNumber === currentPage ? 'active' : ''}`;
    btn.textContent = pageNumber;
    btn.onclick = () => {
        showPage(pageNumber);
        scrollToTop();
    };
    pageNumbersContainer.appendChild(btn);
}

function addEllipsis() {
    const span = document.createElement('span');
    span.textContent = '...';
    span.className = 'ellipsis';
    pageNumbersContainer.appendChild(span);
}

function updatePageInfo() {
    if (pageInfo) {
        pageInfo.textContent = `Страница ${currentPage} из ${totalPages}`;
    }
}

function updateEdgeButtons() {
    firstBtn.disabled = currentPage === 1;
    lastBtn.disabled = currentPage === totalPages;
}

// === EVENTS ===
function addEventListeners() {
    prevBtn.onclick = () => currentPage > 1 && showPage(currentPage - 1);
    nextBtn.onclick = () => currentPage < totalPages && showPage(currentPage + 1);
    firstBtn.onclick = () => showPage(1);
    lastBtn.onclick = () => showPage(totalPages);
}

// === SCROLL ===
function scrollToTop() {
    document.getElementById('header')?.scrollIntoView({ behavior: 'smooth' });
}
