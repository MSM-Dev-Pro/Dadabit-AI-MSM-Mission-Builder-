# Genaral — Blocs communs

## Objectif
La rubrique **Genaral** contient toutes les briques communes :
- initialisation robot/caméra
- vision WonderCam (visage, nombre, landmark, classification, couleur)
- mouvements (avancer, reculer, pivoter…)
- suivi de ligne
- servos 270°
- arrêt et sécurité

## Conseils
- Appeler `Genaral: initialiser robot + caméra` au début d’un projet si une leçon ne le fait pas déjà.
- Pour des projets stables : ajouter `pause 20 ms` dans la boucle `toujours`.

## Sécurité
Pour arrêter le robot :
- `Genaral: arrêt global pack`
- `Genaral: stop sécurité complet`
