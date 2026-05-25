# 🧠 Esquema mental — GIT

```
GIT (SCV distribuido)
│
├── 1. CONCEPTOS BASE
│   ├── SCV centralizado (SVN/CVS) → 1 repo canónico en servidor
│   ├── SCV distribuido (Git/Mercurial) → cada cliente tiene repo completo
│   ├── Creado por Linus Torvalds (2005, kernel Linux), escrito en C
│   └── Características: rápido, offline, hashes SHA-1 inmutables, snapshots (no diffs)
│
├── 2. CONFIGURACIÓN
│   ├── Niveles: system → global → local   (local sobrescribe global sobrescribe system)
│   ├── git config --global user.name / user.email   (sin esto NO hay commits)
│   ├── git config --global core.editor / init.defaultBranch main
│   └── Alias: git config --global alias.lol "log --graph --decorate --oneline"
│
├── 3. LAS 3 ÁREAS  +  ESTADOS
│   ├── Working area ──git add──▶ Staging area (index) ──git commit──▶ Repository
│   ├── Vuelta: git restore / git reset / git checkout
│   └── Estados: Untracked → Tracked (Modified / Staged / Committed)
│
├── 4. COMANDOS BÁSICOS (flujo)
│   ├── git init            inicializa repo (.git)
│   ├── git add <file|.>    a staging
│   ├── git status [-s]     estado de los ficheros
│   ├── git commit -m "..." snapshot al repo
│   ├── git log [--oneline --graph --decorate --all]
│   └── git show            cambios de un commit
│
├── 5. REFERENCIAS
│   ├── Absolutas: SHA-1 (o sub-cadena 5+ chars)
│   ├── Simbólicas: HEAD (rama actual), nombre de rama, tags
│   └── Relativas: HEAD~1 (padre), HEAD~n, HEAD^ (padre), HEAD^^ (abuelo)
│
├── 6. PREPARAR UN BUEN COMMIT
│   ├── git rm --cached <file>     saca de staging, conserva en disco
│   ├── git mv old new             renombra en 1 paso
│   ├── git diff [HEAD|c1 c2]      diferencias (por defecto: WD vs index)
│   ├── git blame <file>           autor de cada línea
│   ├── .gitignore                 patrones a ignorar (node_modules, dist)
│   └── Mensaje: imperativo, ≤50 chars, sin punto · semantic: feat/fix/docs/style/refactor/test/chore
│
├── 7. REESCRIBIR LA HISTORIA  (⚠️ no tocar commits ya compartidos)
│   ├── git checkout <ref>     mueve HEAD → "detached HEAD" si no es rama
│   ├── git reset <commit>
│   │     ├── --soft   solo mueve puntero (deja staging+WD)
│   │     ├── --mixed  (default) refleja en WD
│   │     └── --hard   refleja en WD + staging (¡destructivo!)
│   ├── git revert / git amend / git stash
│   └── git reflog            historial de punteros → recupera commits "perdidos"
│
├── 8. TRABAJAR EN PARALELO (ramas)
│   ├── git branch [-d] / git checkout -b <rama> / git switch
│   ├── git merge
│   │     ├── fast-forward → no crea commit, mueve puntero
│   │     └── recursive    → crea commit de merge (2 padres)
│   ├── git rebase           reescribe historia (linealiza)
│   └── Conflictos: <<<<<<< actual === entrante >>>>>>>  → resolver + add + commit
│
└── 9. REPOSITORIOS REMOTOS
    ├── bare (sin working area) = repos de hosting (GitHub/GitLab/Bitbucket)
    ├── git remote add origin <url>
    ├── git clone <url>      descarga + crea origin + rama local + HEAD
    ├── git push [-u origin main]   sube
    ├── git pull (= fetch + merge)  descarga e integra
    ├── git fetch            solo descarga (no integra)
    └── Pull Request → revisión + merge + cierre
```

## ⭐ Mínimos para el examen
- Distribuido vs centralizado · Torvalds 2005 · SHA-1 inmutable
- 3 áreas + flujo add/commit + estados
- `reset` soft/mixed/hard · detached HEAD · reflog
- merge ff vs recursive · rebase · conflictos
- remote/clone/push/pull/fetch · bare · ley de oro
