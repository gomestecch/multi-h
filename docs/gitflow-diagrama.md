# Diagrama de Gitflow

O diagrama abaixo ilustra o fluxo de trabalho Gitflow implementado neste projeto:

```mermaid
%%{init: { 'logLevel': 'debug', 'theme': 'base', 'gitGraph': {'showBranches': true, 'showCommitLabel':true,'mainBranchName': 'main'}} }%%
gitGraph
  commit id: "Inicial"
  branch develop
  checkout develop
  commit id: "Desenvolvimento Inicial"
  
  branch feature/login
  checkout feature/login
  commit id: "Login: Início"
  commit id: "Login: Validação"
  commit id: "Login: Finalização"
  checkout develop
  merge feature/login
  
  branch feature/cadastro
  checkout feature/cadastro
  commit id: "Cadastro: Início"
  commit id: "Cadastro: Formulário"
  commit id: "Cadastro: Finalização"
  checkout develop
  merge feature/cadastro
  
  branch release/1.0.0
  checkout release/1.0.0
  commit id: "Preparação Release 1.0.0"
  commit id: "Ajustes finais 1.0.0"
  checkout main
  merge release/1.0.0 tag: "v1.0.0"
  checkout develop
  merge release/1.0.0
  
  checkout main
  branch hotfix/1.0.1
  checkout hotfix/1.0.1
  commit id: "Correção urgente"
  checkout main
  merge hotfix/1.0.1 tag: "v1.0.1"
  checkout develop
  merge hotfix/1.0.1
  
  checkout develop
  branch feature/nova-feature
  checkout feature/nova-feature
  commit id: "Nova feature: Desenvolvimento"
  checkout develop
  merge feature/nova-feature
```

## Explicação do Fluxo

1. Desenvolvimento começa na branch `develop`
2. Features são criadas a partir da `develop` (ex: `feature/login`, `feature/cadastro`)
3. Quando features são concluídas, são mergeadas de volta para `develop`
4. Quando `develop` tem features suficientes para um release, cria-se uma branch `release/x.y.z`
5. A branch de release é finalizada com merge para `main` (com tag) e para `develop`
6. Se um bug crítico for encontrado em produção, cria-se um `hotfix/x.y.z` a partir da `main`
7. O hotfix é mergeado para `main` (com tag) e para `develop` 