const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'index.src.html');
const destPath = path.join(__dirname, 'index.html');
const pagesDir = path.join(__dirname, 'pages');

try {
  if (!fs.existsSync(srcPath)) {
    throw new Error(`Arquivo fonte '${srcPath}' não encontrado.`);
  }

  let templateShell = fs.readFileSync(srcPath, 'utf8');
  
  if (!fs.existsSync(pagesDir)) {
    throw new Error(`Diretório de páginas '${pagesDir}' não encontrado.`);
  }

  const files = fs.readdirSync(pagesDir);
  let templatesHtml = '\n';
  
  files.forEach(file => {
    if (file.endsWith('.html')) {
      const pageId = path.basename(file, '.html');
      const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
      
      // Indentando o conteúdo para manter o HTML final limpo
      const indentedContent = content
        .split('\n')
        .map(line => line ? '    ' + line : line)
        .join('\n');

      templatesHtml += `  <template id="page-${pageId}">\n${indentedContent}\n  </template>\n`;
    }
  });
  
  if (!templateShell.includes('<!-- TEMPLATES_PLACEHOLDER -->')) {
    throw new Error("Placeholder '<!-- TEMPLATES_PLACEHOLDER -->' não encontrado no index.src.html.");
  }

  const output = templateShell.replace('<!-- TEMPLATES_PLACEHOLDER -->', templatesHtml.trimEnd());
  fs.writeFileSync(destPath, output, 'utf8');
  console.log('Build finalizado com sucesso! index.html foi atualizado.');
} catch (error) {
  console.error('Erro no Build:', error.message);
  process.exit(1);
}
