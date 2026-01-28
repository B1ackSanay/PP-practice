const pageComponents = {
    news: 'assets/html/_news.html',
    info: 'assets/html/_info.html',
    center: 'assets/html/_center.html',
    contacts: 'assets/html/_contacts.html',
};

const pageTitles = {
    news: 'Новости',
    info: 'Информация о деятельности',
    center: 'Центр добровольчества "Абилимпикс"',
    contacts: 'Контакты',
    newsDetail: 'Новости',
};

async function loadPage(pageId, newsId = null) {
    if (pageId === 'newsDetail' && newsId) {
        loadNewsDetail(newsId);
        return;
    }

    const pagePath = pageComponents[pageId];
    if (!pagePath) return;

    const pageElement = document.getElementById('page');
    const titleElement = document.getElementById('title');

    if (pageElement) pageElement.textContent = pageTitles[pageId] || '';
    if (titleElement) titleElement.textContent = '';

    try {
        const response = await fetch(pagePath);
        if (!response.ok) {
            throw new Error(`Ошибка загрузки ${pagePath}`);
        }

        const html = await response.text();
        const container = document.getElementById('replace-content');
        container.innerHTML = html;

        updateNavigation(pageId);

        if (pageId === 'news') {
            refreshPagination();
        }

        if (pageId === 'info' && typeof initVolunteerTexts === 'function') {
            initVolunteerTexts();
        }

    } catch (err) {
        console.error(err);
    }
}

function updateNavigation(activePage) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === activePage);
    });
}

function loadNewsDetail(newsId) {
    if (!Array.isArray(newsData)) return;

    const news = newsData.find(n => n.id === Number(newsId));
    if (!news) {
        loadPage('news');
        return;
    }

    document.getElementById('page').textContent = 'Новости >';
    document.getElementById('title').textContent = news.title;

    fetch('assets/html/news-page.html')
        .then(r => {
            if (!r.ok) throw new Error('Ошибка шаблона новости');
            return r.text();
        })
        .then(html => {
            document.getElementById('replace-content').innerHTML = html;

            document.querySelector('.news-detail-title').textContent = news.title;
            document.querySelector('.news-detail-information').textContent = news.information || '';
            document.querySelector('.news-detail-date').textContent = news.date;

            const photosGrid = document.querySelector('.news-photos-grid');
            photosGrid.innerHTML = '';

            if (Array.isArray(news.photos)) {
                news.photos.forEach(photo => {
                    const div = document.createElement('div');
                    div.className = 'news-photo-item';
                    div.innerHTML = `<img src="${photo.img}" loading="lazy">`;
                    photosGrid.appendChild(div);
                });
            }
        })
        .catch(() => loadPage('news'));
}

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', e => {
        const link = e.target.closest('.news-item');
        if (!link) return;

        e.preventDefault();
        const id = link.getAttribute('href')?.split('/')[1];
        if (id) loadPage('newsDetail', id);
    });

    document.querySelectorAll('.nav-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            loadPage(btn.dataset.page);
        });
    });

    loadPage('news');
});
