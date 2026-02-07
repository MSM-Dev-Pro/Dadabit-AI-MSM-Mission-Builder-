# Lesson 1 — Greeter (Visage)

## Recette rapide (programme minimal)
- Au démarrage : **Greeter: initialiser**
- Toujours : **Greeter: lire visage → Greeter: décider → Greeter: agir → pause 20 ms**
- Option : **Greeter: régler mouvement (vitesse, durée)**

## Blocs
### Greeter: initialiser {#greeter-init}
Prépare le robot et met la WonderCam en mode **détection de visage**.

### Greeter: régler mouvement {#greeter-setmove}
Ajuste la vitesse et la durée du mouvement de salutation.

### Greeter: lire visage {#greeter-readface}
Met à jour la détection visage. Retourne true/false.

### Greeter: visage détecté ? {#greeter-facedetected}
Renvoie la dernière valeur lue par **lire visage**.

### Greeter: décider {#greeter-decide}
Choisit l’état (attente / saluer).

### Greeter: état {#greeter-state}
Renvoie l’état courant.

### Greeter: agir {#greeter-act}
Exécute l’action correspondant à l’état.
