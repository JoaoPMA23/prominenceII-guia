// Configurações do Roteador SPA por Rolagem
const VALID_PAGES = ['inicio', 'qol', 'sobrevivencia', 'combate', 'talentos', 'classes', 'equipamentos', 'masmorras', 'chefe', 'endremastered', 'adastra', 'hastur', 'wikis'];
const DEFAULT_PAGE = 'inicio';

// Seletores do DOM
const contentArea = document.getElementById('content-area');
const navLinks = document.querySelectorAll('nav a');
const sentinel = document.getElementById('scroll-sentinel');

const renderedPages = new Set();
let isScrollingToSection = false;

// Intersection Observers
let sectionObserver;
let progressObserver;
let spyObserver;
let sentinelObserver;

// Inicializa os observadores
function initObservers() {
  // Observador de visibilidade (fade-in) das seções
  sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08 });

  // Observador das barras de progressão
  progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animate');
      }
    });
  }, { threshold: 0.2 });

  // Observador para Scroll Spy (atualizar navbar conforme rola)
  const activeSections = new Set();
  spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeSections.add(entry.target.id);
      } else {
        activeSections.delete(entry.target.id);
      }
    });

    if (!isScrollingToSection) {
      let activePage = null;
      if (activeSections.size > 0) {
        // Encontra qual das seções visíveis vem primeiro na ordem do guia
        for (const pageId of VALID_PAGES) {
          if (activeSections.has(pageId)) {
            activePage = pageId;
            break;
          }
        }
      } else if (window.scrollY < 200) {
        activePage = 'inicio';
      }

      if (activePage) {
        updateActiveNavLink(activePage);
        history.replaceState(null, null, `#${activePage}`);
      }
    }
  }, { rootMargin: '-20% 0px -60% 0px' }); // Foca na faixa superior/média da tela
}

// Atualiza o link ativo na barra de navegação com efeito de foco deslizante (fading dos vizinhos e ocultação do resto)
function updateActiveNavLink(pageId) {
  const activeIndex = VALID_PAGES.indexOf(pageId);
  if (activeIndex === -1) return;

  const minLinkIndex = Math.max(0, activeIndex - 2);
  const maxLinkIndex = Math.min(VALID_PAGES.length - 1, activeIndex + 2);
  const children = Array.from(document.querySelector('nav').children);

  // Primeiro passo: Configura a visibilidade e opacidade dos links
  children.forEach(child => {
    const isLink = child.tagName === 'A';
    
    if (isLink) {
      const linkHref = child.getAttribute('href').replace('#', '');
      const linkIndex = VALID_PAGES.indexOf(linkHref);
      const distance = Math.abs(linkIndex - activeIndex);
      
      if (linkIndex >= minLinkIndex && linkIndex <= maxLinkIndex) {
        child.style.display = 'inline-block';
        if (distance === 0) {
          child.classList.add('active');
          child.style.opacity = '1';
        } else {
          child.classList.remove('active');
          if (distance === 1) {
            child.style.opacity = '0.55';
          } else if (distance === 2) {
            child.style.opacity = '0.25';
          }
        }
      } else {
        child.style.display = 'none';
        child.classList.remove('active');
      }
    }
  });

  // Segundo passo: Configura os pontos separadores (dots)
  children.forEach(child => {
    if (child.classList.contains('nav-dot')) {
      const prevLink = child.previousElementSibling;
      const nextLink = child.nextElementSibling;
      
      // Só mostra o ponto se os links de ambos os lados estiverem visíveis
      if (prevLink && nextLink && 
          prevLink.style.display !== 'none' && 
          nextLink.style.display !== 'none') {
        child.style.display = 'inline-block';
        
        const prevHref = prevLink.getAttribute('href').replace('#', '');
        const nextHref = nextLink.getAttribute('href').replace('#', '');
        const prevIdx = VALID_PAGES.indexOf(prevHref);
        const nextIdx = VALID_PAGES.indexOf(nextHref);
        
        // Esmaece o ponto baseado na proximidade do link ativo
        if (prevIdx === activeIndex || nextIdx === activeIndex) {
          child.style.opacity = '0.4';
        } else {
          child.style.opacity = '0.15';
        }
      } else {
        child.style.display = 'none';
      }
    }
  });
}

// Adiciona uma página específica ao final do conteúdo
function appendPage(pageId) {
  if (renderedPages.has(pageId)) return false;
  
  const template = document.getElementById(`page-${pageId}`);
  if (!template) return false;
  
  // Cria um elemento temporário para converter a string em nós DOM
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = template.innerHTML.trim();
  
  // Move os nós para o content area
  while (tempDiv.firstChild) {
    const child = tempDiv.firstChild;
    contentArea.appendChild(child);
    
    // Se for uma seção, passa a observar para animações e scroll spy
    if (child.classList && child.classList.contains('section')) {
      sectionObserver.observe(child);
      spyObserver.observe(child);
      
      // Observa barras de progressão internas
      const fills = child.querySelectorAll('.prog-fill');
      fills.forEach(f => progressObserver.observe(f));
    }
  }
  
  renderedPages.add(pageId);
  return true;
}

// Carrega a próxima página pendente na lista
function loadNextPage() {
  const nextPageIndex = renderedPages.size;
  if (nextPageIndex < VALID_PAGES.length) {
    const nextPageId = VALID_PAGES[nextPageIndex];
    appendPage(nextPageId);
    return true;
  }
  return false;
}

// Inicializa o sentinel observer para rolagem infinita
function initSentinel() {
  sentinelObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isScrollingToSection) {
      loadNextPage();
    }
  }, { rootMargin: '200px' }); // Carrega um pouco antes de bater no final da tela
  
  sentinelObserver.observe(sentinel);
}

// Configura navegação do clique nos links do navbar
function setupNavClicks() {
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetHash = link.getAttribute('href');
      const pageId = targetHash.replace('#', '');
      
      if (!VALID_PAGES.includes(pageId)) return;
      
      // Carrega todas as páginas até a página desejada
      const targetIndex = VALID_PAGES.indexOf(pageId);
      for (let i = 0; i <= targetIndex; i++) {
        appendPage(VALID_PAGES[i]);
      }
      
      // Faz rolagem suave para a seção alvo
      isScrollingToSection = true;
      updateActiveNavLink(pageId);
      history.replaceState(null, null, targetHash);
      
      const targetEl = document.getElementById(pageId);
      if (targetEl) {
        if (pageId === 'inicio') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Desativa a trava após o término da animação de scroll
        setTimeout(() => {
          isScrollingToSection = false;
        }, 800);
      }
    });
  });
}

// Ouvinte para histórico de navegação (botões de voltar/avançar do navegador)
function handleHistory() {
  const hash = window.location.hash.replace('#', '').trim();
  const pageId = VALID_PAGES.includes(hash) ? hash : DEFAULT_PAGE;
  
  // Garante que a página do hash e todas as anteriores estejam carregadas
  const targetIndex = VALID_PAGES.indexOf(pageId);
  for (let i = 0; i <= targetIndex; i++) {
    appendPage(VALID_PAGES[i]);
  }
  
  isScrollingToSection = true;
  updateActiveNavLink(pageId);
  
  const targetEl = document.getElementById(pageId);
  if (targetEl) {
    if (pageId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  setTimeout(() => {
    isScrollingToSection = false;
  }, 800);
}

// Inicializa a aplicação e carrega rota inicial
function init() {
  initObservers();
  setupNavClicks();
  
  // Carrega rota inicial pelo hash
  const initialHash = window.location.hash.replace('#', '').trim();
  const activePage = VALID_PAGES.includes(initialHash) ? initialHash : DEFAULT_PAGE;
  
  // Carrega todas as páginas até o hash inicial de uma vez
  const targetIndex = VALID_PAGES.indexOf(activePage);
  for (let i = 0; i <= targetIndex; i++) {
    appendPage(VALID_PAGES[i]);
  }
  
  // Se for uma seção interna (não a home/inicio), rola instantaneamente para ela
  if (activePage !== 'inicio') {
    setTimeout(() => {
      const targetEl = document.getElementById(activePage);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'auto' });
      }
    }, 100);
  }
  
  // Inicia o observador de rolagem infinita
  initSentinel();
  
  // Atualiza nav ativa na inicialização
  updateActiveNavLink(activePage);
  
  // Escuta rolagem para voltar para o início se estiver no topo
  window.addEventListener('scroll', () => {
    if (window.scrollY < 100 && !isScrollingToSection) {
      updateActiveNavLink('inicio');
      history.replaceState(null, null, '#inicio');
    }
  });
  
  // Escuta botões Voltar/Avançar
  window.addEventListener('hashchange', handleHistory);
}

window.addEventListener('DOMContentLoaded', init);
