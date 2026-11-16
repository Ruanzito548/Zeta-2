# Script PowerShell para criar repositório no GitHub e fazer push automático
# Requer: GitHub CLI (gh) instalado e autenticado
# https://cli.github.com

Write-Host "================================"
Write-Host "Zeta 2 - Create GitHub Repository"
Write-Host "================================"
Write-Host ""

# Verificar se gh está instalado
try {
    $ghVersion = & gh --version 2>&1
    Write-Host "✓ GitHub CLI encontrado" -ForegroundColor Green
} catch {
    Write-Host "GitHub CLI não está instalado." -ForegroundColor Yellow
    Write-Host "Instale em: https://cli.github.com"
    exit 1
}

# Verificar se está autenticado
try {
    & gh auth status 2>&1 | Out-Null
    Write-Host "✓ Autenticado no GitHub" -ForegroundColor Green
} catch {
    Write-Host "Você não está autenticado no GitHub." -ForegroundColor Yellow
    Write-Host "Execute: gh auth login"
    exit 1
}

Write-Host ""

# Obter nome do repositório
$repoName = Read-Host "Nome do repositório (padrão: zeta2)"
if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "zeta2"
}

# Obter visibilidade
Write-Host ""
Write-Host "Visibilidade do repositório:"
Write-Host "1) Public"
Write-Host "2) Private"
$visibility = Read-Host "Escolha (1 ou 2, padrão: 1)"

if ($visibility -eq "2") {
    $visibilityFlag = "--private"
    $visibilityText = "Privado"
} else {
    $visibilityFlag = "--public"
    $visibilityText = "Público"
}

Write-Host ""
Write-Host "Criando repositório..." -ForegroundColor Cyan
Write-Host "Nome: $repoName"
Write-Host "Visibilidade: $visibilityText"
Write-Host ""

# Criar repositório no GitHub
$output = & gh repo create "$repoName" `
    $visibilityFlag `
    --description "Economic Intelligence Platform for WoW Forever" `
    --source=. `
    --remote=origin `
    --push 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Repositório criado e código feito push com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "URL do repositório:"
    $url = & gh repo view "$repoName" --json url -q .url
    Write-Host $url -ForegroundColor Blue
    Write-Host ""
    Write-Host "Próximos passos:"
    Write-Host "1. Acesse o repositório no GitHub"
    Write-Host "2. Configure proteção de branch (se privado)"
    Write-Host "3. Adicione colaboradores conforme necessário"
} else {
    Write-Host "Erro ao criar repositório:" -ForegroundColor Yellow
    Write-Host $output
    exit 1
}
