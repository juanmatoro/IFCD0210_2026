# Examen Git — 30 preguntas tipo test

> Marca una sola opción por pregunta. La opción correcta va marcada con ✓.

---

**1.** ¿Qué tipo de sistema de control de versiones es Git?
- a) Centralizado
- b) Distribuido ✓
- c) Cliente-servidor sin copia local
- d) Solo en la nube

**2.** ¿Quién creó Git y en qué año?
- a) Linus Torvalds, 2005 ✓
- b) Richard Stallman, 1991
- c) Linus Torvalds, 2010
- d) Scott Chacon, 2014

**3.** ¿Qué comando inicializa un repositorio local de Git?
- a) `git start`
- b) `git create`
- c) `git init` ✓
- d) `git new`

**4.** ¿Cuáles son las tres áreas del modelo mental de un repositorio Git?
- a) Local, remoto y nube
- b) Working area, staging area y repository ✓
- c) Head, branch y tag
- d) Commit, push y pull

**5.** ¿Qué comando mueve los ficheros de la working area a la staging area?
- a) `git commit`
- b) `git push`
- c) `git add` ✓
- d) `git stage-now`

**6.** ¿Qué comando guarda los cambios preparados en el repositorio?
- a) `git save`
- b) `git commit` ✓
- c) `git add`
- d) `git store`

**7.** ¿Qué estado tiene un fichero nuevo que Git aún no sigue?
- a) Modified
- b) Staged
- c) Committed
- d) Untracked ✓

**8.** ¿Qué comando muestra el estado de los archivos en working y staging area?
- a) `git log`
- b) `git status` ✓
- c) `git show`
- d) `git diff`

**9.** Si no se define `user.name` y `user.email`, Git...
- a) Usa valores anónimos
- b) No permite hacer commits ✓
- c) Pregunta cada vez
- d) Funciona igual

**10.** ¿En qué orden de prioridad se aplican los niveles de configuración?
- a) system > global > local
- b) global > system > local
- c) local > global > system ✓
- d) Todos tienen igual prioridad

**11.** ¿Qué referencia representa el padre del commit actual?
- a) `HEAD+1`
- b) `HEAD~1` ✓
- c) `HEAD>1`
- d) `HEAD..1`

**12.** ¿Qué identifica de forma única a un commit?
- a) Su mensaje
- b) Su fecha
- c) Un hash SHA-1 ✓
- d) El nombre del autor

**13.** Según las buenas prácticas, un buen mensaje de commit debe...
- a) Terminar siempre con punto
- b) Comenzar con un verbo en imperativo y no exceder ~50 caracteres ✓
- c) Tener más de 200 caracteres
- d) Ir todo en mayúsculas

**14.** En semantic commits, ¿qué prefijo se usa para una corrección de bug?
- a) `feat:`
- b) `docs:`
- c) `fix:` ✓
- d) `chore:`

**15.** ¿Qué comando muestra el historial de commits?
- a) `git log` ✓
- b) `git history`
- c) `git status`
- d) `git list`

**16.** ¿Qué hace `git rm --cached <file>`?
- a) Borra el fichero del disco y del repo
- b) Lo elimina de la staging area conservándolo en el directorio de trabajo ✓
- c) Crea un commit automático
- d) Ignora el fichero para siempre

**17.** ¿Qué comando cambia el nombre de un fichero en un solo paso?
- a) `git rename`
- b) `git move`
- c) `git mv` ✓
- d) `git rn`

**18.** Por defecto, `git diff` (sin argumentos) compara...
- a) Dos ramas
- b) El directorio de trabajo con el index (staging area) ✓
- c) Dos commits cualesquiera
- d) El remoto con el local

**19.** ¿Qué comando muestra el autor de la última modificación de cada línea de un fichero?
- a) `git log`
- b) `git show`
- c) `git blame` ✓
- d) `git author`

**20.** En `git reset`, ¿qué opción refleja el contenido del commit tanto en working como en staging area?
- a) `--soft`
- b) `--mixed`
- c) `--hard` ✓
- d) `--keep`

**21.** ¿Cuál es la opción por defecto de `git reset`?
- a) `--soft`
- b) `--mixed` ✓
- c) `--hard`
- d) Ninguna

**22.** Al hacer `git checkout HEAD~1` entramos en estado...
- a) Merge en progreso
- b) Detached HEAD ✓
- c) Rebase interactivo
- d) Bare

**23.** ¿Qué comando registra los cambios en los punteros de referencia (incluso commits "perdidos")?
- a) `git log`
- b) `git reflog` ✓
- c) `git status`
- d) `git fsck`

**24.** ¿Qué comando crea una rama y cambia a ella a la vez?
- a) `git branch -b nombre`
- b) `git checkout -b nombre` ✓
- c) `git switch nombre`
- d) `git new-branch nombre`

**25.** Un merge **fast-forward** ocurre cuando...
- a) Las dos ramas tienen commits divergentes
- b) La rama destino no tiene commits que no estén en la rama a fusionar ✓
- c) Siempre se crea un commit de merge
- d) Hay conflictos

**26.** Un merge **recursive** se caracteriza por...
- a) No crear ningún commit
- b) Crear un commit de merge con dos padres ✓
- c) Eliminar la rama fusionada
- d) Reescribir la historia

**27.** ¿Qué representan los marcadores `<<<<<<<`, `=======`, `>>>>>>>`?
- a) Un commit firmado
- b) Un conflicto de fusión a resolver ✓
- c) Un tag anotado
- d) Un stash guardado

**28.** ¿Qué es un repositorio **bare**?
- a) Un repo sin historial
- b) Un repo sin working area, solo metadatos ✓
- c) Un repo solo de lectura
- d) Un repo sin ramas

**29.** ¿Qué comando obtiene una copia local de un repositorio remoto?
- a) `git pull`
- b) `git fetch`
- c) `git clone` ✓
- d) `git copy`

**30.** ¿Qué dice la "ley de oro" de Git?
- a) Hacer commit cada hora
- b) No modificar commits que ya han sido compartidos ✓
- c) Nunca usar ramas
- d) Siempre hacer force push

---

## Respuestas correctas

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|----|
| b | a | c | b | c | b | d | b | b | c |

| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|----|----|----|----|----|----|----|----|----|----|
| b | c | b | c | a | b | c | b | c | c |

| 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
|----|----|----|----|----|----|----|----|----|----|
| b | b | b | b | b | b | b | b | c | b |
