#!/bin/bash

# Script para automatizar operações do Gitflow

# Função para verificar se o último comando executou com sucesso
function check_error {
  if [ $? -ne 0 ]; then
    echo "Erro: $1"
    exit 1
  fi
}

function print_help {
  echo "Uso: ./gitflow.sh <comando> [argumentos]"
  echo ""
  echo "Comandos:"
  echo "  start-feature <nome>    Inicia uma nova feature"
  echo "  finish-feature <nome>   Finaliza uma feature e faz merge para develop"
  echo "  start-release <versão>  Inicia um novo release"
  echo "  finish-release <versão> Finaliza um release e faz merge para main e develop"
  echo "  start-hotfix <versão>   Inicia um hotfix"
  echo "  finish-hotfix <versão>  Finaliza um hotfix e faz merge para main e develop"
  echo "  init                    Inicializa o fluxo de gitflow no repositório"
  echo "  cleanup                 Remove branches locais já mergeadas"
}

function init_gitflow {
  # Verifica se já existe a branch develop
  git show-ref --verify --quiet refs/heads/develop
  if [ $? -eq 0 ]; then
    echo "A branch develop já existe"
  else
    git checkout -b develop
    check_error "Falha ao criar branch develop"
    git push -u origin develop
    check_error "Falha ao enviar branch develop para o repositório remoto"
    echo "Gitflow inicializado. Branch 'develop' criada."
  fi
}

function start_feature {
  if [ -z "$1" ]; then
    echo "Erro: Nome da feature não especificado"
    exit 1
  fi
  
  # Verifica se já existe a branch feature
  git show-ref --verify --quiet refs/heads/feature/$1
  if [ $? -eq 0 ]; then
    echo "A branch feature/$1 já existe"
    exit 1
  fi
  
  # Verifica branch atual
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  if [ "$CURRENT_BRANCH" != "develop" ]; then
    echo "Mudando da branch $CURRENT_BRANCH para develop..."
    git checkout develop
    check_error "Falha ao mudar para branch develop"
  fi
  
  git pull origin develop
  check_error "Falha ao atualizar a branch develop"
  git checkout -b "feature/$1"
  check_error "Falha ao criar a branch feature/$1"
  git push -u origin "feature/$1"
  check_error "Falha ao enviar a branch feature/$1 para o repositório remoto"
  echo "Feature '$1' iniciada."
}

function finish_feature {
  if [ -z "$1" ]; then
    echo "Erro: Nome da feature não especificado"
    exit 1
  fi
  
  # Verifica se a branch feature existe
  git show-ref --verify --quiet refs/heads/feature/$1
  if [ $? -ne 0 ]; then
    echo "A branch feature/$1 não existe"
    exit 1
  fi
  
  git checkout "feature/$1"
  check_error "Falha ao mudar para a branch feature/$1"
  git pull origin "feature/$1"
  check_error "Falha ao atualizar a branch feature/$1"
  git checkout develop
  check_error "Falha ao mudar para a branch develop"
  git pull origin develop
  check_error "Falha ao atualizar a branch develop"
  
  echo "Realizando merge da feature/$1 para develop..."
  git merge --no-ff "feature/$1" -m "Merge feature/$1 into develop"
  
  # Verifica se houve conflito
  if [ $? -ne 0 ]; then
    echo "Conflito detectado durante o merge. Resolva os conflitos e conclua o merge manualmente."
    echo "Após resolver os conflitos, execute:"
    echo "git add <arquivos resolvidos>"
    echo "git commit -m \"Merge feature/$1 into develop\""
    echo "git push origin develop"
    exit 1
  fi
  
  git push origin develop
  check_error "Falha ao enviar as alterações para o repositório remoto"
  
  echo "Deseja remover a branch feature/$1 local e remota? (s/n)"
  read resposta
  if [ "$resposta" = "s" ]; then
    echo "Removendo branch local..."
    git branch -d "feature/$1"
    echo "Removendo branch remota..."
    git push origin --delete "feature/$1"
  fi
  
  echo "Feature '$1' finalizada e mergeada para develop."
}

function start_release {
  if [ -z "$1" ]; then
    echo "Erro: Versão não especificada"
    exit 1
  fi
  
  # Verifica se já existe a branch release
  git show-ref --verify --quiet refs/heads/release/$1
  if [ $? -eq 0 ]; then
    echo "A branch release/$1 já existe"
    exit 1
  fi
  
  # Verifica branch atual
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  if [ "$CURRENT_BRANCH" != "develop" ]; then
    echo "Mudando da branch $CURRENT_BRANCH para develop..."
    git checkout develop
    check_error "Falha ao mudar para branch develop"
  fi
  
  git pull origin develop
  check_error "Falha ao atualizar a branch develop"
  git checkout -b "release/$1"
  check_error "Falha ao criar a branch release/$1"
  git push -u origin "release/$1"
  check_error "Falha ao enviar a branch release/$1 para o repositório remoto"
  echo "Release '$1' iniciada."
}

function finish_release {
  if [ -z "$1" ]; then
    echo "Erro: Versão não especificada"
    exit 1
  fi
  
  # Verifica se a branch release existe
  git show-ref --verify --quiet refs/heads/release/$1
  if [ $? -ne 0 ]; then
    echo "A branch release/$1 não existe"
    exit 1
  fi
  
  git checkout "release/$1"
  check_error "Falha ao mudar para a branch release/$1"
  git pull origin "release/$1"
  check_error "Falha ao atualizar a branch release/$1"
  
  # Merge para main
  git checkout main
  check_error "Falha ao mudar para a branch main"
  git pull origin main
  check_error "Falha ao atualizar a branch main"
  
  echo "Realizando merge da release/$1 para main..."
  git merge --no-ff "release/$1" -m "Merge release/$1 into main"
  
  # Verifica se houve conflito
  if [ $? -ne 0 ]; then
    echo "Conflito detectado durante o merge para main. Resolva os conflitos e conclua o merge manualmente."
    exit 1
  fi
  
  git tag -a "v$1" -m "Versão $1"
  check_error "Falha ao criar tag v$1"
  git push origin main --tags
  check_error "Falha ao enviar as alterações para o repositório remoto"
  
  # Merge para develop
  git checkout develop
  check_error "Falha ao mudar para a branch develop"
  git pull origin develop
  check_error "Falha ao atualizar a branch develop"
  
  echo "Realizando merge da release/$1 para develop..."
  git merge --no-ff "release/$1" -m "Merge release/$1 into develop"
  
  # Verifica se houve conflito
  if [ $? -ne 0 ]; then
    echo "Conflito detectado durante o merge para develop. Resolva os conflitos e conclua o merge manualmente."
    exit 1
  fi
  
  git push origin develop
  check_error "Falha ao enviar as alterações para o repositório remoto"
  
  echo "Deseja remover a branch release/$1 local e remota? (s/n)"
  read resposta
  if [ "$resposta" = "s" ]; then
    echo "Removendo branch local..."
    git branch -d "release/$1"
    echo "Removendo branch remota..."
    git push origin --delete "release/$1"
  fi
  
  echo "Release '$1' finalizada e mergeada para main e develop."
}

function start_hotfix {
  if [ -z "$1" ]; then
    echo "Erro: Versão não especificada"
    exit 1
  fi
  
  # Verifica se já existe a branch hotfix
  git show-ref --verify --quiet refs/heads/hotfix/$1
  if [ $? -eq 0 ]; then
    echo "A branch hotfix/$1 já existe"
    exit 1
  fi
  
  # Verifica branch atual
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "Mudando da branch $CURRENT_BRANCH para main..."
    git checkout main
    check_error "Falha ao mudar para branch main"
  fi
  
  git pull origin main
  check_error "Falha ao atualizar a branch main"
  git checkout -b "hotfix/$1"
  check_error "Falha ao criar a branch hotfix/$1"
  git push -u origin "hotfix/$1"
  check_error "Falha ao enviar a branch hotfix/$1 para o repositório remoto"
  echo "Hotfix '$1' iniciado."
}

function finish_hotfix {
  if [ -z "$1" ]; then
    echo "Erro: Versão não especificada"
    exit 1
  fi
  
  # Verifica se a branch hotfix existe
  git show-ref --verify --quiet refs/heads/hotfix/$1
  if [ $? -ne 0 ]; then
    echo "A branch hotfix/$1 não existe"
    exit 1
  fi
  
  git checkout "hotfix/$1"
  check_error "Falha ao mudar para a branch hotfix/$1"
  git pull origin "hotfix/$1"
  check_error "Falha ao atualizar a branch hotfix/$1"
  
  # Merge para main
  git checkout main
  check_error "Falha ao mudar para a branch main"
  git pull origin main
  check_error "Falha ao atualizar a branch main"
  
  echo "Realizando merge do hotfix/$1 para main..."
  git merge --no-ff "hotfix/$1" -m "Merge hotfix/$1 into main"
  
  # Verifica se houve conflito
  if [ $? -ne 0 ]; then
    echo "Conflito detectado durante o merge para main. Resolva os conflitos e conclua o merge manualmente."
    exit 1
  fi
  
  git tag -a "v$1" -m "Versão $1"
  check_error "Falha ao criar tag v$1"
  git push origin main --tags
  check_error "Falha ao enviar as alterações para o repositório remoto"
  
  # Merge para develop
  git checkout develop
  check_error "Falha ao mudar para a branch develop"
  git pull origin develop
  check_error "Falha ao atualizar a branch develop"
  
  echo "Realizando merge do hotfix/$1 para develop..."
  git merge --no-ff "hotfix/$1" -m "Merge hotfix/$1 into develop"
  
  # Verifica se houve conflito
  if [ $? -ne 0 ]; then
    echo "Conflito detectado durante o merge para develop. Resolva os conflitos e conclua o merge manualmente."
    exit 1
  fi
  
  git push origin develop
  check_error "Falha ao enviar as alterações para o repositório remoto"
  
  echo "Deseja remover a branch hotfix/$1 local e remota? (s/n)"
  read resposta
  if [ "$resposta" = "s" ]; then
    echo "Removendo branch local..."
    git branch -d "hotfix/$1"
    echo "Removendo branch remota..."
    git push origin --delete "hotfix/$1"
  fi
  
  echo "Hotfix '$1' finalizado e mergeado para main e develop."
}

function cleanup_branches {
  echo "Removendo branches locais já mergeadas com develop..."
  git branch --merged develop | grep -v "^\*" | grep -v "main" | grep -v "develop" | xargs -r git branch -d
  
  echo "Deseja remover também as branches remotas já mergeadas? (s/n)"
  read resposta
  if [ "$resposta" = "s" ]; then
    echo "Buscando branches remotas..."
    git fetch origin --prune
    
    # Lista branches remotas mergeadas com develop
    REMOTE_BRANCHES=$(git branch -r --merged origin/develop | grep -v "main" | grep -v "develop" | sed 's/origin\///')
    
    if [ -n "$REMOTE_BRANCHES" ]; then
      echo "As seguintes branches remotas serão removidas:"
      echo "$REMOTE_BRANCHES"
      echo "Confirmar? (s/n)"
      read confirma
      if [ "$confirma" = "s" ]; then
        for branch in $REMOTE_BRANCHES; do
          git push origin --delete "$branch"
        done
      fi
    else
      echo "Não há branches remotas para remover."
    fi
  fi
}

# Lógica principal
if [ $# -eq 0 ]; then
  print_help
  exit 0
fi

case "$1" in
  init)
    init_gitflow
    ;;
  start-feature)
    start_feature "$2"
    ;;
  finish-feature)
    finish_feature "$2"
    ;;
  start-release)
    start_release "$2"
    ;;
  finish-release)
    finish_release "$2"
    ;;
  start-hotfix)
    start_hotfix "$2"
    ;;
  finish-hotfix)
    finish_hotfix "$2"
    ;;
  cleanup)
    cleanup_branches
    ;;
  *)
    print_help
    ;;
esac 