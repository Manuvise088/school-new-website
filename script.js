document.addEventListener('DOMContentLoaded', () => {
    const sezioni_selector = document.getElementsByClassName("sezioni-container")[0];
    const scrollToTopButton = document.getElementById("scrollToTop");

if (sezioni_selector) {
    const handleResize = () => {
        if (window.innerWidth >= 1024) {
            // Mostra solo su desktop
            sezioni_selector.style.display = "flex"; // o "block" a seconda del tuo layout
            
            // Aggiungi comportamento scroll se necessario
            window.addEventListener('scroll', handleScroll);
            handleScroll(); // Inizializza lo stato
        } else {
            // Nascondi completamente su mobile
            sezioni_selector.style.display = "none";
            window.removeEventListener('scroll', handleScroll);
        }
    };

    const handleScroll = () => {
        if (window.scrollY > 50) {
            sezioni_selector.style.width = "94%";
            sezioni_selector.style.backgroundColor = "white";
            sezioni_selector.style.backdropFilter = "none";
        } else {
            sezioni_selector.style.width = "95%";
            sezioni_selector.style.backgroundColor = "#f8f8f87a";
            sezioni_selector.style.backdropFilter = "blur(10px)";
        }
    };

    // Gestisci il resize della finestra
    window.addEventListener('resize', handleResize);
    
    // Inizializza allo stato corretto
    handleResize();
}

    if (scrollToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopButton.style.display = "block";
            } else {
                scrollToTopButton.style.display = "none";
                scrollToTopButton.classList.remove('scrollToTop_scrolling');
            }
        });
    }

    async function fetchWpNews() {
        const newsGrid = document.getElementById('news-grid');
        
        try {
            const wpApiUrl = 'https://www.silvioceccato.edu.it/wp-json/wp/v2/posts?per_page=6&_embed';
            
            const response = await fetch(wpApiUrl);
            
            if (!response.ok) {
                throw new Error('Errore nel caricamento delle notizie');
            }
            
            const posts = await response.json();
            
            newsGrid.innerHTML = '';
            
            posts.forEach(post => {
                const newsCard = document.createElement('div');
                newsCard.className = 'news-card';
                
                const title = post.title.rendered;
                const excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 150) + '...';
                const date = new Date(post.date).toLocaleDateString('it-IT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
                const link = post.link;
                
                let imageUrl = '';
                if (post._embedded && post._embedded['wp:featuredmedia']) {
                    imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
                }
                
                newsCard.innerHTML = `
                    ${imageUrl ? `<div class="news-image" style="background-image: url('${imageUrl}')"></div>` : ''}
                    <div class="news-content">
                        <div class="news-date">
                            <span class="material-icons-outlined">calendar_today</span>
                            ${date}
                        </div>
                        <h3 class="news-title">${title}</h3>
                        <p class="news-excerpt">${excerpt}</p>
                        <a href="${link}" class="news-link" target="_blank">
                            Leggi tutto
                            <span class="material-icons-outlined">arrow_forward</span>
                        </a>
                    </div>
                `;
                
                newsGrid.appendChild(newsCard);
            });
            
        } catch (error) {
            console.error('Errore nel caricamento delle notizie:', error);
            newsGrid.innerHTML = `
                <div class="news-error" style="grid-column: 1 / -1; text-align: center; padding: 3vh;">
                    <span class="material-icons-outlined" style="font-size: 4vh; color: #0b85b5;">error</span>
                    <p>Non è stato possibile caricare le ultime notizie.</p>
                    <a href="https://www.silvioceccato.edu.it" target="_blank" style="color: #12ADEF;">
                        Visita il sito della scuola
                    </a>
                </div>
            `;
        }
    }
    
    fetchWpNews();

    // Mobile menu functionality
    const menuButton = document.getElementById('menu-button');
    const closeMenu = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuButton && mobileMenu && closeMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.style.left = '0';
        });
        
        closeMenu.addEventListener('click', () => {
            mobileMenu.style.left = '-100vw';
        });
    }
})