# MSM AI Pack — Guide pour activer l’Aide (Help) sur les blocs

## Principe
Pour qu’un bloc affiche une aide riche (clic droit → Aide), ajoute :
1) un commentaire JSDoc `/** ... */`
2) `//% blockId=...` (ID stable)
3) `//% help=msm/<page>#<ancre>`

## Exemple (Greeter: lire visage)
```ts
/**
 * Lit la WonderCam et détecte si un visage est présent.
 * Retourne true si visage détecté, sinon false.
 *
 * Utilisation : dans toujours → lire visage → décider → agir → pause 20 ms
 */
//% blockId=msm_greeter_read_face
//% group="Vision"
//% weight=90
//% block="Greeter: lire visage"
//% help=msm/lesson1-greeter#greeter-readface
export function readFace(): boolean { ... }
```
