# Multi-H - Documentação de Gitflow

## Visão Geral do Gitflow

Este projeto utiliza o modelo de Gitflow para gerenciar o fluxo de desenvolvimento. O Gitflow é uma estratégia de branching que define uma estrutura clara para o desenvolvimento, lançamento e manutenção do código.

## Estrutura de Branches

### Branches Principais

- **`main`**: Contém código de produção estável. Cada commit nesta branch representa uma versão de produção.
- **`develop`**: Branch de integração para novos recursos. Contém todo o código aprovado para o próximo release.

### Branches de Suporte

- **`feature/*`**: Para desenvolvimento de novas funcionalidades (ex: `feature/login-page`).
- **`release/*`**: Para preparação de um novo release de produção (ex: `release/1.0.0`).
- **`hotfix/*`**: Para correções rápidas em produção (ex: `hotfix/fix-login-bug`).
- **`bugfix/*`**: Para correções de bugs que serão incorporadas na próxima versão.

## Fluxo de Trabalho

1. **Desenvolvimento de Features**:
   - Crie uma branch a partir de `develop`: `git checkout -b feature/nome-da-feature develop`
   - Desenvolva a feature
   - Finalize com merge para `develop`: `git checkout develop && git merge --no-ff feature/nome-da-feature`

2. **Preparação para Release**:
   - Crie uma branch a partir de `develop`: `git checkout -b release/1.0.0 develop`
   - Faça ajustes finais e correções menores
   - Finalize com merge para `main` e `develop`

3. **Hotfixes**:
   - Crie uma branch a partir de `main`: `git checkout -b hotfix/problema main`
   - Corrija o problema
   - Faça merge para `main` e `develop`

## Convenções de Commits

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Alterações na documentação
- **style**: Formatação, ponto e vírgula, etc; sem alteração de código
- **refactor**: Refatoração de código
- **test**: Adição/modificação de testes
- **chore**: Atualização de tarefas, configurações, etc.

Exemplo: `feat: implementação do sistema de autenticação`

## Instruções para Implementação

Para iniciar o uso deste gitflow no projeto:

```bash
# Clone o repositório
git clone https://github.com/gomestecch/multi-h.git
cd multi-h

# Crie a branch develop
git checkout -b develop
git push -u origin develop

# Para iniciar uma nova feature
git checkout develop
git checkout -b feature/nome-da-feature
# Trabalhe na feature...
git push -u origin feature/nome-da-feature

# Quando terminar a feature
git checkout develop
git merge --no-ff feature/nome-da-feature
git push origin develop
git branch -d feature/nome-da-feature
``` 