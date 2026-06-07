# Guia Iniciante — Prominence II: Hasturian Era

Um guia interativo, elegante e otimizado para jogadores iniciantes do modpack de RPG **Prominence II: Hasturian Era** para Minecraft. O site foi projetado com uma experiência premium inspirada em interfaces modernas de RPG e fantasia escura.

---

## 🚀 Funcionalidades Principais

* **Arquitetura SPA (Single Page Application) com Rolagem Infinita:** As seções do guia são carregadas de forma modular e dinâmica conforme o usuário rola a página, mantendo o consumo de recursos extremamente baixo.
* **Cabeçalho com Foco Deslizante Inteligente (Sliding Focus):** Uma barra de navegação responsiva e limpa que esmaece e oculta abas distantes da seção visível, exibindo apenas o capítulo atual e seus vizinhos imediatos.
* **Efeitos Visuais Premium:**
  * Aba ativa em destaque com brilho dourado (`text-shadow`) e texto claro.
  * Transições fluidas de opacidade e cor nas trocas de abas.
  * Tema escuro com gradientes radiais, céu estrelado sutil e textura de ruído orgânico.
* **100% Offline e Livre de Restrições de CORS:** Desenvolvido com um sistema de compilação baseado em templates locais. Você pode rodar o site localmente dando um duplo clique em `index.html` (execução via protocolo `file://`), sem a necessidade de servidores HTTP locais ou erros de requisição de rede (`NetworkError`).

---

## 🛠️ Tecnologias Utilizadas

* **Estrutura:** HTML5 Semântico com `<template>` tags para carregamento assíncrono local.
* **Estilização:** CSS3 puro (Vanilla) com variáveis personalizadas, gradientes modernos e animações de entrada.
* **Lógica:** Vanilla JavaScript, utilizando a API `IntersectionObserver` para rolagem infinita lazy-loading e atualização silenciosa da barra de navegação (Scroll Spy) via `history.replaceState`.
* **Build System:** Script em Node.js (`build.js`) para empacotar fragmentos HTML modulares.

---

## 📁 Estrutura do Projeto

```text
├── assets/
│   ├── css/
│   │   └── style.css      # Estilização global do site, efeitos e responsividade
│   └── js/
│       └── main.js        # Lógica do Roteador, Scroll Spy e Lazy-Loading
├── pages/                 # Fragmentos de HTML para cada capítulo do guia
│   ├── inicio.html
│   ├── qol.html
│   ├── sobrevivencia.html
│   ├── combate.html
│   ├── talentos.html
│   ├── classes.html
│   ├── equipamentos.html
│   ├── masmorras.html
│   ├── chefe.html
│   ├── endremastered.html
│   ├── adastra.html
│   ├── hastur.html
│   └── wikis.html
├── build.js               # Compila os fragmentos do pages/ para o index.html final
├── index.src.html         # Shell/Template principal usado para o build
├── index.html             # Arquivo final de produção compilado
└── README.md              # Documentação do projeto
```

---

## 💻 Como Executar e Compilar

### 1. Rodar Localmente (Uso Geral)
Não é necessário instalar nenhuma dependência ou configurar servidores. Basta clonar o repositório e abrir o arquivo `index.html` em qualquer navegador de sua escolha:
```bash
# Basta abrir o arquivo index.html no navegador!
```

### 2. Modificar Conteúdo e Compilar (Desenvolvedores)
Para fazer alterações nos textos dos capítulos ou layout:
1. Altere o arquivo de fragmento correspondente dentro da pasta `pages/` (ex: `pages/inicio.html`) ou a casca base em `index.src.html`.
2. Certifique-se de que possui o **Node.js** instalado na máquina.
3. No terminal, execute o script de build para compilar as páginas de volta ao arquivo final de produção:
   ```bash
   node build.js
   ```
4. O arquivo `index.html` será atualizado automaticamente com as novas modificações.

---

## ✒️ Detalhes de Conteúdo
O guia atualmente cobre os seguintes módulos em ordem de progressão recomendada de RPG:
1. **Primeiros Passos (Início):** Configurações iniciais e Quest Book.
2. **Interface (QoL):** Utilidades como REI, Xaero's Minimap, Nature's & Explorer's Compass.
3. **Sobrevivência:** Mecânicas básicas e primeiros dias.
4. **Combate:** Hitbox e movimentação com o Better Combat e Simply Swords (armas normais e lendárias).
5. **Talentos:** Árvore de talentos e especializações.
6. **Classes:** Escolha de classes base e bônus.
7. **Equipamentos:** Reforjas e o sistema avançado de encantamento do Zenith (Apotheosis) até o Nível 100.
8. **Masmorras:** Progressão interna na dimensão do Mine Cells.
9. **Chefes do Cap. 1:** Nether Gauntlet, Blackstone Golem, The Obsidilith e The Eye.
10. **End Remastered:** Como coletar os 12 olhos únicos para ativar o portal do End.
11. **Ad Astra:** Foguetes, trajes e exploração espacial na Lua, Marte, Vênus e Glacio.
12. **Era Hasturiana:** Eldritch End, armadura Etyrite contra corrupção e ritual para invocar o The Faceless.
13. **Wikis & Links:** Atalhos úteis externos e referências oficiais.
