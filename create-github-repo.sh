#!/bin/bash

# Script para criar repositório no GitHub e fazer push automático
# Requer: GitHub CLI (gh) instalado e autenticado
# https://cli.github.com

echo "================================"
echo "Zeta 2 - Create GitHub Repository"
echo "================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se gh está instalado
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}GitHub CLI não está instalado.${NC}"
    echo "Instale em: https://cli.github.com"
    exit 1
fi

# Verificar se está autenticado no GitHub
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}Você não está autenticado no GitHub.${NC}"
    echo "Execute: gh auth login"
    exit 1
fi

# Obter nome do repositório do usuário
read -p "Nome do repositório (padrão: zeta2): " REPO_NAME
REPO_NAME=${REPO_NAME:-zeta2}

# Obter visibilidade
echo "Visibilidade do repositório:"
echo "1) Public"
echo "2) Private"
read -p "Escolha (1 ou 2, padrão: 1): " VISIBILITY
VISIBILITY=${VISIBILITY:-1}

if [ "$VISIBILITY" = "2" ]; then
    VISIBILITY_FLAG="--private"
    VISIBILITY_TEXT="Privado"
else
    VISIBILITY_FLAG="--public"
    VISIBILITY_TEXT="Público"
fi

echo ""
echo -e "${BLUE}Criando repositório...${NC}"
echo "Nome: $REPO_NAME"
echo "Visibilidade: $VISIBILITY_TEXT"
echo ""

# Criar repositório no GitHub
gh repo create "$REPO_NAME" \
    $VISIBILITY_FLAG \
    --description "Economic Intelligence Platform for WoW Forever" \
    --source=. \
    --remote=origin \
    --push

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Repositório criado e código feito push com sucesso!${NC}"
    echo ""
    echo "URL do repositório:"
    gh repo view "$REPO_NAME" --json url -q .url
    echo ""
    echo "Próximos passos:"
    echo "1. Acesse o repositório no GitHub"
    echo "2. Configure proteção de branch (se privado)"
    echo "3. Adicione colaboradores conforme necessário"
else
    echo -e "${YELLOW}Erro ao criar repositório. Verifique os logs acima.${NC}"
    exit 1
fi
