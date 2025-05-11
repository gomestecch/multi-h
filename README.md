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

## Ferramentas de Automação

Para facilitar o uso do gitflow, este projeto inclui:

1. **Script de automação**: `scripts/gitflow.sh` - Automatiza operações comuns do gitflow
2. **Validação de branches**: GitHub Actions que verifica se as branches seguem a convenção
3. **Validação de commits**: Husky + Commitlint para garantir mensagens de commit no padrão

## Resolução de Conflitos

Conflitos podem ocorrer durante operações de merge. Quando isso acontecer:

1. Git marcará os arquivos conflitantes com marcadores `<<<<<<<`, `=======` e `>>>>>>>`
2. Edite esses arquivos para resolver os conflitos manualmente
3. Após resolver, adicione os arquivos com `git add <arquivos>`
4. Complete o merge com `git commit -m "Merge branch X into Y"`
5. Envie as alterações com `git push`

O script `gitflow.sh` detecta conflitos e fornece orientações sobre como resolvê-los.

## Gerenciamento de Features Dependentes

Quando uma feature depende de outra que ainda não foi mergeada para `develop`:

### Abordagem 1: Branch Baseada
1. Crie a branch da primeira feature: `feature/recurso-base`
2. Após completar o recurso base, crie a segunda feature a partir dela: 
   ```
   git checkout feature/recurso-base
   git checkout -b feature/recurso-dependente
   ```
3. Complete o recurso dependente
4. Finalize primeiro a `feature/recurso-base` com merge para `develop`
5. Rebase da `feature/recurso-dependente` com `develop` para obter as últimas alterações:
   ```
   git checkout feature/recurso-dependente
   git rebase develop
   ```
6. Finalize a `feature/recurso-dependente` com merge para `develop`

### Abordagem 2: Pull Requests
1. Crie as features separadamente a partir de `develop`
2. Primeiro faça o merge (via PR) da feature base para `develop`
3. Atualize a feature dependente com as alterações de `develop`:
   ```
   git checkout feature/recurso-dependente
   git pull origin develop
   git push origin feature/recurso-dependente
   ```
4. Resolva quaisquer conflitos e continue o desenvolvimento
5. Faça o merge da feature dependente quando estiver pronta

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

## Usando o Script de Automação

O script `scripts/gitflow.sh` simplifica operações comuns:

```bash
# Visualizar ajuda
./scripts/gitflow.sh

# Inicializar gitflow (criar branch develop)
./scripts/gitflow.sh init

# Iniciar uma feature
./scripts/gitflow.sh start-feature nome-da-feature

# Finalizar uma feature
./scripts/gitflow.sh finish-feature nome-da-feature

# Iniciar um release
./scripts/gitflow.sh start-release 1.0.0

# Finalizar um release
./scripts/gitflow.sh finish-release 1.0.0

# Iniciar um hotfix
./scripts/gitflow.sh start-hotfix 1.0.1

# Finalizar um hotfix
./scripts/gitflow.sh finish-hotfix 1.0.1

# Limpar branches já mergeadas
./scripts/gitflow.sh cleanup
``` 