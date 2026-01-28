const pageComponents = {
    news: 'assets/html/_news.html',
    info: 'assets/html/_info.html',
    center: 'assets/html/_center.html',
    contacts: 'assets/html/_contacts.html',
    newsDetail: '',
};

async function loadPage(pageId, newsId = null) {
    if (pageId === 'newsDetail' && newsId) {
        loadNewsDetail(newsId);
        return;
    }

    if (!pageComponents[pageId]) return;

    const pageTitles = {
        'news': 'Новости',
        'info': 'Информация о деятельности',
        'center': 'Центр добровольчества "Абилимпикс"',
        'contacts': 'Контакты',
        'newsDetail': 'Новости',
    };

    const pageElement = document.getElementById('page');
    if (pageElement) {
        pageElement.textContent = pageTitles[pageId];
    }

    const newsTitleElement = document.getElementById('title');
    if (newsTitleElement) {
        newsTitleElement.textContent = '';
    }

    // fetch использование  SPA
    try {
        const response = await fetch(pageComponents[pageId]);
        const html = await response.text();
        document.getElementById('replace-content').innerHTML = html;
    } catch (error) {
        console.error('Ошибка загрузки страницы:', error);
        return;
    }

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === pageId) {
            btn.classList.add('active');
        }
    });

    if (pageId === 'news') {
        setTimeout(() => {
            refreshPagination();
        }, 50);
    } else if (pageId === 'info') {
        setTimeout(initVolunteerTexts, 50);
    } else {
        isInitialized = false;
    }
}

function loadNewsDetail(newsId) {
    const id = parseInt(newsId);
    const news = newsData.find(item => item.id === id);

    if (!news) {
        loadPage('news');
        return;
    }

    // page в header
    const pageElement = document.getElementById('page');
    if (pageElement) {
        pageElement.textContent = `Новости\u00A0\u00A0>`;
    }
    // title в header
    const newsTitleElement = document.getElementById('title');
    if (newsTitleElement) {
        newsTitleElement.textContent = `${news.title}`;
    }

    // Загрузка шаблона
    fetch('assets/html/news-page.html')
        .then(response => response.text())
        .then(html => {

            document.getElementById('replace-content').innerHTML = html;

            // Данные
            const titleElement = document.querySelector('.news-detail-title');
            const infoElement = document.querySelector('.news-detail-information');
            const photosGrid = document.querySelector('.news-photos-grid');
            const dateElement = document.querySelector('.news-detail-date');

            if (titleElement) titleElement.textContent = news.title;
            if (infoElement) infoElement.textContent = news.information || '';
            if (dateElement) dateElement.textContent = news.date;

            // Фотографии
            if (photosGrid && news.photos && news.photos.length > 0) {
                photosGrid.innerHTML = '';
                news.photos.forEach(photo => {
                    if (photo.img) {
                        const photoItem = document.createElement('div');
                        photoItem.className = 'news-photo-item';
                        photoItem.innerHTML = `
                                <img src="${photo.img}" alt="Фото новости ${photo.id || ''}" loading="lazy">
                            `;
                        photosGrid.appendChild(photoItem);
                    }
                });
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки шаблона:', error);
            loadPage('news');
        });
}

document.addEventListener('DOMContentLoaded', function () {
    // Клики по новостям
    document.addEventListener('click', function (e) {
        const newsItem = e.target.closest('.news-item');
        if (newsItem && newsItem.href) {
            e.preventDefault();
            const href = newsItem.getAttribute('href');
            if (href && href.startsWith('news/')) {
                const newsId = href.split('/')[1];
                loadPage('newsDetail', newsId);
            }
            scrollToTop()
        }
    });

    // Кнопки навигации
    document.querySelectorAll('.nav-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            loadPage(this.dataset.page);
        });
    });

    loadPage('news');
});