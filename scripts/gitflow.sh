#!/bin/bash

# Script para automatizar operações do Gitflow

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
}

function init_gitflow {
  git checkout -b develop
  git push -u origin develop
  echo "Gitflow inicializado. Branch 'develop' criada."
}

function start_feature {
  if [ -z "$1" ]; then
    echo "Erro: Nome da feature não especificado"
    exit 1
  fi
  
  git checkout develop
  git pull origin develop
  git checkout -b "feature/$1"
  git push -u origin "feature/$1"
  echo "Feature '$1' iniciada."
}

function finish_feature {
  if [ -z "$1" ]; then
    echo "Erro: Nome da feature não especificado"
    exit 1
  fi
  
  git checkout "feature/$1"
  git pull origin "feature/$1"
  git checkout develop
  git pull origin develop
  git merge --no-ff "feature/$1" -m "Merge feature/$1 into develop"
  git push origin develop
  echo "Feature '$1' finalizada e mergeada para develop."
}

function start_release {
  if [ -z "$1" ]; then
    echo "Erro: Versão não especificada"
    exit 1
  fi
  
  git checkout develop
  git pull origin develop
  git checkout -b "release/$1"
  git push -u origin "release/$1"
  echo "Release '$1' iniciada."
}

function finish_release {
  if [ -z "$1" ]; then
    echo "Erro: Versão não especificada"
    exit 1
  fi
  
  git checkout "release/$1"
  git pull origin "release/$1"
  
  # Merge para main
  git checkout main
  git pull origin main
  git merge --no-ff "release/$1" -m "Merge release/$1 into main"
  git tag -a "v$1" -m "Versão $1"
  git push origin main --tags
  
  # Merge para develop
  git checkout develop
  git pull origin develop
  git merge --no-ff "release/$1" -m "Merge release/$1 into develop"
  git push origin develop
  
  echo "Release '$1' finalizada e mergeada para main e develop."
}

function start_hotfix {
  if [ -z "$1" ]; then
    echo "Erro: Versão não especificada"
    exit 1
  fi
  
  git checkout main
  git pull origin main
  git checkout -b "hotfix/$1"
  git push -u origin "hotfix/$1"
  echo "Hotfix '$1' iniciado."
}

function finish_hotfix {
  if [ -z "$1" ]; then
    echo "Erro: Versão não especificada"
    exit 1
  fi
  
  git checkout "hotfix/$1"
  git pull origin "hotfix/$1"
  
  # Merge para main
  git checkout main
  git pull origin main
  git merge --no-ff "hotfix/$1" -m "Merge hotfix/$1 into main"
  git tag -a "v$1" -m "Versão $1"
  git push origin main --tags
  
  # Merge para develop
  git checkout develop
  git pull origin develop
  git merge --no-ff "hotfix/$1" -m "Merge hotfix/$1 into develop"
  git push origin develop
  
  echo "Hotfix '$1' finalizado e mergeado para main e develop."
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
  *)
    print_help
    ;;
esac 