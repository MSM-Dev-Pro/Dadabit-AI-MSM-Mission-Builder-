// ======================================================
// MSM - DaDa:bit + WonderCam - AI Lessons Pack (MODE B)
// Chaque leçon expose : init / read / decide / act (+ getters/params)
// L'élève utilise : au démarrage -> init ; toujours -> read -> decide -> act
// ======================================================

/**
 * ======================================================
 * GENARAL (Commun)
 * ======================================================
 */
//% color=#00bcd4 icon="\uf085" block="Genaral"
//% groups=['Init','WonderCam','Mouvements','Ligne','Servo','Outils','Stop']
//% weight=100
namespace Genaral {

    export enum SpeedProfile {
        //% block="lent"
        Slow = 0,
        //% block="moyen"
        Medium = 1,
        //% block="rapide"
        Fast = 2
    }

    let _inited = false
    let _active = ""
    let _stopAll = false

    // Ligne
    export let S1 = false
    export let S2 = false
    export let S3 = false
    export let S4 = false

    // Profils vitesse
    let V_SLOW = 35
    let V_MED = 55
    let V_FAST = 70

    function clamp(v: number, mn: number, mx: number): number {
        if (v < mn) return mn
        if (v > mx) return mx
        return v
    }

    //% group="Init"
    //% block="initialiser robot + caméra"
    export function init(): void {
        if (_inited) return
        dadabit.dadabit_init()
        wondercam.wondercam_init(wondercam.DEV_ADDR.x32)
        dadabit.boardRGBsetBrightness(100)
        _inited = true
    }

    //% group="Init"
    //% block="activer leçon %name"
    export function setActive(name: string): void {
        _active = name
        _stopAll = false
    }

    //% group="Init"
    //% block="leçon active = %name ?"
    export function isActive(name: string): boolean {
        return _active == name
    }

    //% group="Stop"
    //% block="arrêt global pack"
    export function requestStopAll(): void {
        _stopAll = true
        _active = ""
    }

    //% group="Stop"
    //% block="arrêt global demandé ?"
    export function shouldStop(): boolean {
        return _stopAll
    }

    //% group="Init"
    //% block="régler profils vitesses lent %slow moyen %med rapide %fast"
    //% slow.min=10 slow.max=80 slow.defl=35
    //% med.min=10 med.max=90 med.defl=55
    //% fast.min=10 fast.max=100 fast.defl=70
    export function setSpeedProfiles(slow: number, med: number, fast: number): void {
        V_SLOW = clamp(slow, 10, 80)
        V_MED = clamp(med, 10, 90)
        V_FAST = clamp(fast, 10, 100)
    }

    //% group="Init"
    //% block="vitesse profil %p"
    export function speed(p: SpeedProfile): number {
        if (p == SpeedProfile.Slow) return V_SLOW
        if (p == SpeedProfile.Fast) return V_FAST
        return V_MED
    }

    //% group="Outils"
    //% block="bip"
    export function beep(): void {
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
    }

    //% group="Outils"
    //% block="pause %ms ms"
    //% ms.min=0 ms.max=20000 ms.defl=100
    export function wait(ms: number): void {
        basic.pause(ms)
    }

    //% group="Outils"
    //% block="seuil confiance %x (0..1)"
    //% x.min=0 x.max=1 x.defl=0.4
    export function conf(x: number): number {
        return clamp(x, 0, 1)
    }

    //% group="Outils"
    //% block="anti-rebond (si %cond) compteur %counter seuil %th"
    //% th.min=1 th.max=30 th.defl=8
    export function debounce(cond: boolean, counter: number, th: number): number {
        if (cond) {
            counter += 1
            if (counter > th) return 0
            return counter
        }
        return 0
    }

    //% group="WonderCam"
    //% block="changer mode WonderCam %mode"
    export function setMode(mode: wondercam.Functions): void {
        wondercam.ChangeFunc(mode)
        basic.pause(120)
    }

    //% group="WonderCam"
    //% block="caméra: update"
    export function camUpdate(): void {
        wondercam.UpdateResult()
    }

    //% group="WonderCam"
    //% block="face détecté ?"
    export function isFace(): boolean {
        camUpdate()
        return wondercam.IsDetectFace()
    }

    //% group="WonderCam"
    //% block="lire nombre (conf >= %min)"
    //% min.min=0 min.max=1 min.defl=0.4
    export function readNumber(min: number): number {
        min = conf(min)
        camUpdate()
        if (wondercam.MaxConfidenceOfNumber() >= min) return wondercam.NumberWithMaxConfidence()
        return -1
    }

    //% group="WonderCam"
    //% block="lire landmark (conf >= %min)"
    //% min.min=0 min.max=1 min.defl=0.4
    export function readLandmark(min: number): number {
        min = conf(min)
        camUpdate()
        if (wondercam.MaxConfidenceOfLandmark() >= min) return wondercam.LandmarkWithMaxConfidence()
        return -1
    }

    //% group="WonderCam"
    //% block="lire classification ID (conf >= %min)"
    //% min.min=0 min.max=1 min.defl=0.4
    export function readClassId(min: number): number {
        min = conf(min)
        camUpdate()
        if (wondercam.MaxConfidence() >= min) return wondercam.MaxConfidenceID()
        return -1
    }

    //% group="WonderCam"
    //% block="couleur ID %id détectée ?"
    //% id.min=1 id.max=10 id.defl=1
    export function isColor(id: number): boolean {
        camUpdate()
        return wondercam.IsDetectedColorblobs() && wondercam.isDetectedColorId(id)
    }

    //% group="WonderCam"
    //% block="couleur ID %id : X"
    //% id.min=1 id.max=10 id.defl=1
    export function colorX(id: number): number {
        return wondercam.XOfColorId(wondercam.Options.Pos_X, id)
    }

    //% group="WonderCam"
    //% block="couleur ID %id : Y"
    //% id.min=1 id.max=10 id.defl=1
    export function colorY(id: number): number {
        return wondercam.XOfColorId(wondercam.Options.Pos_Y, id)
    }

    //% group="Mouvements"
    //% block="stop châssis"
    export function stopDrive(): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, 0)
    }

    //% group="Mouvements"
    //% block="avancer vitesse %v"
    //% v.min=0 v.max=100 v.defl=55
    export function forward(v: number): void {
        v = clamp(v, 0, 100)
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v)
    }

    //% group="Mouvements"
    //% block="reculer vitesse %v"
    //% v.min=0 v.max=100 v.defl=44
    export function backward(v: number): void {
        v = clamp(v, 0, 100)
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v)
    }

    //% group="Mouvements"
    //% block="pivoter gauche vitesse %v"
    //% v.min=0 v.max=100 v.defl=44
    export function pivotLeft(v: number): void {
        v = clamp(v, 0, 100)
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
    }

    //% group="Mouvements"
    //% block="pivoter droite vitesse %v"
    //% v.min=0 v.max=100 v.defl=44
    export function pivotRight(v: number): void {
        v = clamp(v, 0, 100)
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v)
    }

    //% group="Mouvements"
    //% block="avancer vitesse %v pendant %ms ms"
    //% v.min=0 v.max=100 v.defl=55 ms.min=0 ms.max=20000 ms.defl=500
    export function forwardFor(v: number, ms: number): void {
        forward(v); basic.pause(ms); stopDrive()
    }

    //% group="Mouvements"
    //% block="reculer vitesse %v pendant %ms ms"
    //% v.min=0 v.max=100 v.defl=44 ms.min=0 ms.max=20000 ms.defl=500
    export function backwardFor(v: number, ms: number): void {
        backward(v); basic.pause(ms); stopDrive()
    }

    //% group="Mouvements"
    //% block="pivoter gauche vitesse %v pendant %ms ms"
    //% v.min=0 v.max=100 v.defl=44 ms.min=0 ms.max=20000 ms.defl=800
    export function pivotLeftFor(v: number, ms: number): void {
        pivotLeft(v); basic.pause(ms); stopDrive()
    }

    //% group="Mouvements"
    //% block="pivoter droite vitesse %v pendant %ms ms"
    //% v.min=0 v.max=100 v.defl=44 ms.min=0 ms.max=20000 ms.defl=800
    export function pivotRightFor(v: number, ms: number): void {
        pivotRight(v); basic.pause(ms); stopDrive()
    }

    //% group="Ligne"
    //% block="mettre à jour capteurs ligne"
    export function updateLine(): void {
        S1 = dadabit.line_followers(dadabit.LineFollowerSensors.S1, dadabit.LineColor.Black)
        S2 = dadabit.line_followers(dadabit.LineFollowerSensors.S2, dadabit.LineColor.Black)
        S3 = dadabit.line_followers(dadabit.LineFollowerSensors.S3, dadabit.LineColor.Black)
        S4 = dadabit.line_followers(dadabit.LineFollowerSensors.S4, dadabit.LineColor.Black)
    }

    //% group="Ligne"
    //% block="intersection 1111 ?"
    export function isIntersection1111(): boolean {
        return S1 && S2 && S3 && S4
    }

    //% group="Ligne"
    //% block="suivi ligne vitesse %v"
    //% v.min=0 v.max=100 v.defl=55
    export function lineFollow(v: number): void {
        v = clamp(v, 0, 100)
        updateLine()

        if (S2 && S3) { forward(v); return }

        if (S1 && S2 && (!S3 && !S4)) {
            let k = Math.round(v * 0.8)
            dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, k)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, k)
            dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, k)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, k)
            return
        }

        if (S3 && S4 && (!S1 && !S2)) {
            let k2 = Math.round(v * 0.8)
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, k2)
            dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, k2)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, k2)
            dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, k2)
            return
        }

        if (S2 && (!S1 && !S3 && !S4)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, Math.round(v * 0.8))
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, Math.round(v * 0.6))
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, Math.round(v * 0.8))
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, Math.round(v * 0.6))
            return
        }

        if (S3 && (!S1 && !S2 && !S4)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, Math.round(v * 0.6))
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, Math.round(v * 0.8))
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, Math.round(v * 0.6))
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, Math.round(v * 0.8))
            return
        }

        if (S1 && (!S2 && !S3 && !S4)) { backward(v); return }

        if (S4 && (!S1 && !S2 && !S3)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
            dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
            dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
            return
        }
    }

    //% group="Servo"
    //% block="servo270 port %port angle %ang vitesse %spd"
    //% port.min=1 port.max=6 port.defl=6
    //% ang.min=-180 ang.max=180 ang.defl=0
    //% spd.min=0 spd.max=1000 spd.defl=300
    export function servo270(port: number, ang: number, spd: number): void {
        dadabit.setLego270Servo(port, ang, spd)
    }

    //% group="Stop"
    //% block="stop sécurité complet"
    export function safeStopAll(): void {
        stopDrive()
        servo270(1, 0, 200)
        servo270(2, 0, 200)
        servo270(3, 0, 200)
        servo270(4, 0, 200)
        servo270(5, 0, 200)
        servo270(6, 0, 200)
        dadabit.clearBoardLight()
        basic.clearScreen()
    }
}

/**
 * ======================================================
 * LESSON 1 - AI Greeter (Face)
 * ======================================================
 */
//% color=#ffd54f icon="\uf118" block="Lesson 1 - Greeter"
//% groups=['Init','Vision','Décision','Action','Etat','Paramètres']
//% weight=90
namespace Lesson1_Greeter {
    export enum State {
        //% block="attente"
        Idle = 0,
        //% block="saluer"
        Greet = 1
    }

    let state = State.Idle
    let face = false
    let vMove = 40
    let msMove = 300

    //% group="Init"
    //% block="Greeter: initialiser"
    export function init(): void {
        Genaral.init()
        Genaral.safeStopAll()
        Genaral.setActive("L1")
        Genaral.setMode(wondercam.Functions.FaceDetect)
        state = State.Idle
        face = false
    }

    //% group="Paramètres"
    //% block="Greeter: régler mouvement vitesse %v durée %ms"
    //% v.min=0 v.max=100 v.defl=40
    //% ms.min=0 ms.max=5000 ms.defl=300
    export function setMove(v: number, ms: number): void {
        vMove = v; msMove = ms
    }

    //% group="Vision"
    //% block="Greeter: lire visage"
    export function readFace(): boolean {
        face = Genaral.isFace()
        return face
    }

    //% group="Etat"
    //% block="Greeter: visage détecté ?"
    export function faceDetected(): boolean {
        return face
    }

    //% group="Décision"
    //% block="Greeter: décider"
    export function decide(): void {
        state = face ? State.Greet : State.Idle
    }

    //% group="Etat"
    //% block="Greeter: état"
    export function getState(): State {
        return state
    }

    //% group="Action"
    //% block="Greeter: agir"
    export function act(): void {
        if (Genaral.shouldStop() || !Genaral.isActive("L1")) return

        if (state == State.Greet) {
            basic.showIcon(IconNames.Happy)
            Genaral.beep()
            Genaral.forwardFor(vMove, msMove)
            basic.clearScreen()
        } else {
            Genaral.stopDrive()
            basic.clearScreen()
        }
    }
}

/**
 * ======================================================
 * LESSON 2 - AI Wing (Number -> speed)
 * ======================================================
 */
//% color=#b39ddb icon="\uf0fb" block="Lesson 2 - Wing"
//% groups=['Init','Vision','Décision','Action','Etat','Paramètres']
//% weight=89
namespace Lesson2_Wing {
    export enum State {
        //% block="attente"
        Idle = 0,
        //% block="activer"
        Run = 1
    }

    let state = State.Idle
    let lastNumber = -1
    let minConf = 0.4
    let motorPort = 1
    let speed1 = 30
    let speed2 = 60
    let speed3 = 90
    let outSpeed = 0

    //% group="Init"
    //% block="Wing: initialiser"
    export function init(): void {
        Genaral.init()
        Genaral.safeStopAll()
        Genaral.setActive("L2")
        Genaral.setMode(wondercam.Functions.NumberRecognition)
        state = State.Idle
        lastNumber = -1
        outSpeed = 0
    }

    //% group="Paramètres"
    //% block="Wing: seuil confiance %min"
    //% min.min=0 min.max=1 min.defl=0.4
    export function setConfidence(min: number): void {
        minConf = Genaral.conf(min)
    }

    //% group="Paramètres"
    //% block="Wing: moteur port %p"
    //% p.min=1 p.max=4 p.defl=1
    export function setMotorPort(p: number): void {
        motorPort = p
    }

    //% group="Paramètres"
    //% block="Wing: vitesses 1->%s1 2->%s2 3->%s3"
    //% s1.min=0 s1.max=100 s1.defl=30
    //% s2.min=0 s2.max=100 s2.defl=60
    //% s3.min=0 s3.max=100 s3.defl=90
    export function setSpeeds(s1: number, s2: number, s3: number): void {
        speed1 = s1; speed2 = s2; speed3 = s3
    }

    //% group="Vision"
    //% block="Wing: lire nombre"
    export function readNumber(): number {
        lastNumber = Genaral.readNumber(minConf)
        return lastNumber
    }

    //% group="Etat"
    //% block="Wing: dernier nombre"
    export function getNumber(): number {
        return lastNumber
    }

    //% group="Décision"
    //% block="Wing: décider"
    export function decide(): void {
        if (lastNumber == 1) { outSpeed = speed1; state = State.Run }
        else if (lastNumber == 2) { outSpeed = speed2; state = State.Run }
        else if (lastNumber == 3) { outSpeed = speed3; state = State.Run }
        else { outSpeed = 0; state = State.Idle }
    }

    //% group="Etat"
    //% block="Wing: vitesse sortie"
    export function getOutSpeed(): number {
        return outSpeed
    }

    //% group="Etat"
    //% block="Wing: état"
    export function getState(): State {
        return state
    }

    //% group="Action"
    //% block="Wing: agir"
    export function act(): void {
        if (Genaral.shouldStop() || !Genaral.isActive("L2")) return

        if (state == State.Run) {
            // moteur 360 sur port lego : on réutilise setLego360Servo (ports 1..4)
            dadabit.setLego360Servo(motorPort, dadabit.Oriention.Clockwise, outSpeed)
            basic.showNumber(lastNumber)
        } else {
            dadabit.setLego360Servo(motorPort, dadabit.Oriention.Clockwise, 0)
            basic.clearScreen()
        }
    }
}

/**
 * ======================================================
 * LESSON 3 - AI Fan (Face -> fan ON/OFF + servo angle simple)
 * (sans tracking X : robuste et compatible)
 * ======================================================
 */
//% color=#80cbc4 icon="\uf72e" block="Lesson 3 - Fan"
//% groups=['Init','Vision','Décision','Action','Etat','Paramètres']
//% weight=88
namespace Lesson3_Fan {
    export enum State {
        //% block="off"
        Off = 0,
        //% block="on"
        On = 1
    }

    let state = State.Off
    let face = false
    let fanPort = 2
    let fanSpeed = 70
    let servoPort = 1
    let servoOnAngle = 90
    let servoOffAngle = 90

    //% group="Init"
    //% block="Fan: initialiser"
    export function init(): void {
        Genaral.init()
        Genaral.safeStopAll()
        Genaral.setActive("L3")
        Genaral.setMode(wondercam.Functions.FaceDetect)
        state = State.Off
        face = false
        Genaral.servo270(servoPort, servoOffAngle, 200)
        dadabit.setLego360Servo(fanPort, dadabit.Oriention.Clockwise, 0)
    }

    //% group="Paramètres"
    //% block="Fan: régler port ventilo %p vitesse %v"
    //% p.min=1 p.max=4 p.defl=2
    //% v.min=0 v.max=100 v.defl=70
    export function setFan(p: number, v: number): void {
        fanPort = p
        fanSpeed = v
    }

    //% group="Paramètres"
    //% block="Fan: servo port %sp angle ON %aOn angle OFF %aOff"
    //% sp.min=1 sp.max=6 sp.defl=1
    //% aOn.min=0 aOn.max=180 aOn.defl=90
    //% aOff.min=0 aOff.max=180 aOff.defl=90
    export function setServo(sp: number, aOn: number, aOff: number): void {
        servoPort = sp
        servoOnAngle = aOn
        servoOffAngle = aOff
    }

    //% group="Vision"
    //% block="Fan: lire visage"
    export function readFace(): boolean {
        face = Genaral.isFace()
        return face
    }

    //% group="Décision"
    //% block="Fan: décider"
    export function decide(): void {
        state = face ? State.On : State.Off
    }

    //% group="Etat"
    //% block="Fan: état"
    export function getState(): State {
        return state
    }

    //% group="Action"
    //% block="Fan: agir"
    export function act(): void {
        if (Genaral.shouldStop() || !Genaral.isActive("L3")) return

        if (state == State.On) {
            Genaral.servo270(servoPort, servoOnAngle, 150)
            dadabit.setLego360Servo(fanPort, dadabit.Oriention.Clockwise, fanSpeed)
            basic.showIcon(IconNames.Yes)
        } else {
            Genaral.servo270(servoPort, servoOffAngle, 150)
            dadabit.setLego360Servo(fanPort, dadabit.Oriention.Clockwise, 0)
            basic.showIcon(IconNames.No)
        }
    }
}

/**
 * ======================================================
 * LESSON 4 - AI Color Sorter (ColorID 1/2 -> gate left/right)
 * ======================================================
 */
//% color=#ffb74d icon="\uf074" block="Lesson 4 - Color Sorter"
//% groups=['Init','Vision','Décision','Action','Etat','Paramètres']
//% weight=87
namespace Lesson4_ColorSorter {
    export enum State {
        //% block="attente"
        Idle = 0,
        //% block="trier gauche"
        Left = 1,
        //% block="trier droite"
        Right = 2
    }

    let state = State.Idle
    let detected = 0
    let colorLeft = 1
    let colorRight = 2
    let servoDrop = 1
    let servoGate = 2
    let dropClose = 70
    let dropOpen = 0
    let gateCenter = 90
    let gateLeft = 45
    let gateRight = 135

    //% group="Init"
    //% block="ColorSorter: initialiser"
    export function init(): void {
        Genaral.init()
        Genaral.safeStopAll()
        Genaral.setActive("L4")
        Genaral.setMode(wondercam.Functions.ColorDetect)
        state = State.Idle
        detected = 0
        Genaral.servo270(servoDrop, dropClose, 200)
        Genaral.servo270(servoGate, gateCenter, 200)
    }

    //% group="Paramètres"
    //% block="ColorSorter: couleurs gauche %cL droite %cR"
    //% cL.min=1 cL.max=10 cL.defl=1
    //% cR.min=1 cR.max=10 cR.defl=2
    export function setColors(cL: number, cR: number): void {
        colorLeft = cL; colorRight = cR
    }

    //% group="Paramètres"
    //% block="ColorSorter: servos drop %sDrop gate %sGate"
    //% sDrop.min=1 sDrop.max=6 sDrop.defl=1
    //% sGate.min=1 sGate.max=6 sGate.defl=2
    export function setServos(sDrop: number, sGate: number): void {
        servoDrop = sDrop; servoGate = sGate
    }

    //% group="Vision"
    //% block="ColorSorter: lire couleur"
    export function readColor(): number {
        detected = 0
        if (Genaral.isColor(colorLeft)) detected = colorLeft
        else if (Genaral.isColor(colorRight)) detected = colorRight
        return detected
    }

    //% group="Etat"
    //% block="ColorSorter: couleur détectée"
    export function getDetectedColor(): number {
        return detected
    }

    //% group="Décision"
    //% block="ColorSorter: décider"
    export function decide(): void {
        if (detected == colorLeft) state = State.Left
        else if (detected == colorRight) state = State.Right
        else state = State.Idle
    }

    function dropOnce(): void {
        Genaral.servo270(servoDrop, dropOpen, 250)
        basic.pause(250)
        Genaral.servo270(servoDrop, dropClose, 250)
        basic.pause(600)
    }

    //% group="Action"
    //% block="ColorSorter: agir"
    export function act(): void {
        if (Genaral.shouldStop() || !Genaral.isActive("L4")) return

        if (state == State.Left) {
            Genaral.beep()
            dropOnce()
            Genaral.servo270(servoGate, gateLeft, 300)
            basic.pause(400)
            Genaral.servo270(servoGate, gateCenter, 300)
            state = State.Idle
        } else if (state == State.Right) {
            Genaral.beep()
            dropOnce()
            Genaral.servo270(servoGate, gateRight, 300)
            basic.pause(400)
            Genaral.servo270(servoGate, gateCenter, 300)
            state = State.Idle
        } else {
            // attente
            basic.clearScreen()
        }
    }

    //% group="Etat"
    //% block="ColorSorter: état"
    export function getState(): State {
        return state
    }
}

/**
 * ======================================================
 * LESSON 5 - AI Robot Arm (ColorID 1..4 -> positions)
 * ======================================================
 */
//% color=#81c784 icon="\uf0ad" block="Lesson 5 - Robot Arm"
//% groups=['Init','Vision','Décision','Action','Etat','Paramètres']
//% weight=86
namespace Lesson5_RobotArm {
    export enum State {
        //% block="attente"
        Idle = 0,
        //% block="saisir"
        Grab = 1,
        //% block="déposer"
        Drop = 2,
        //% block="retour"
        Home = 3
    }

    let state = State.Idle
    let detected = 0
    let minConf = 0.4

    // servos (exemple)
    let base = 1
    let arm = 2
    let claw = 3

    // positions base selon couleur (1..4)
    let pos1 = 50
    let pos2 = 100
    let pos3 = -70
    let pos4 = -110

    //% group="Init"
    //% block="RobotArm: initialiser"
    export function init(): void {
        Genaral.init()
        Genaral.safeStopAll()
        Genaral.setActive("L5")
        Genaral.setMode(wondercam.Functions.ColorDetect)
        state = State.Idle
        detected = 0
        homePose()
    }

    //% group="Paramètres"
    //% block="RobotArm: seuil confiance %min"
    //% min.min=0 min.max=1 min.defl=0.4
    export function setConfidence(min: number): void {
        minConf = Genaral.conf(min)
    }

    //% group="Paramètres"
    //% block="RobotArm: servos base %b bras %a pince %c"
    //% b.min=1 b.max=6 b.defl=1
    //% a.min=1 a.max=6 a.defl=2
    //% c.min=1 c.max=6 c.defl=3
    export function setServos(b: number, a: number, c: number): void {
        base = b; arm = a; claw = c
    }

    //% group="Vision"
    //% block="RobotArm: lire couleur (1..4)"
    export function readColor(): number {
        detected = 0
        Genaral.camUpdate()
        if (wondercam.IsDetectedColorblobs()) {
            if (wondercam.isDetectedColorId(1)) detected = 1
            else if (wondercam.isDetectedColorId(2)) detected = 2
            else if (wondercam.isDetectedColorId(3)) detected = 3
            else if (wondercam.isDetectedColorId(4)) detected = 4
        }
        return detected
    }

    //% group="Etat"
    //% block="RobotArm: couleur détectée"
    export function getDetected(): number {
        return detected
    }

    //% group="Décision"
    //% block="RobotArm: décider"
    export function decide(): void {
        if (detected >= 1 && detected <= 4) state = State.Grab
        else state = State.Idle
    }

    function homePose(): void {
        Genaral.servo270(base, -10, 700)
        Genaral.servo270(arm, 70, 700)
        Genaral.servo270(claw, 90, 700)
        basic.pause(700)
    }

    function grab(): void {
        Genaral.servo270(arm, 95, 700); basic.pause(600)
        Genaral.servo270(claw, 115, 700); basic.pause(600)
        Genaral.servo270(arm, 70, 700); basic.pause(600)
    }

    function moveToBin(id: number): void {
        if (id == 1) Genaral.servo270(base, pos1, 900)
        else if (id == 2) Genaral.servo270(base, pos2, 1100)
        else if (id == 3) Genaral.servo270(base, pos3, 900)
        else Genaral.servo270(base, pos4, 1100)
        basic.pause(1100)
    }

    function drop(): void {
        Genaral.servo270(arm, 95, 700); basic.pause(600)
        Genaral.servo270(claw, 90, 700); basic.pause(600)
        Genaral.servo270(arm, 70, 700); basic.pause(600)
    }

    //% group="Action"
    //% block="RobotArm: agir"
    export function act(): void {
        if (Genaral.shouldStop() || !Genaral.isActive("L5")) return

        if (state == State.Grab) {
            Genaral.beep()
            grab()
            state = State.Drop
        } else if (state == State.Drop) {
            moveToBin(detected)
            drop()
            state = State.Home
        } else if (state == State.Home) {
            homePose()
            state = State.Idle
        } else {
            // attente
        }
    }

    //% group="Etat"
    //% block="RobotArm: état"
    export function getState(): State {
        return state
    }
}

/**
 * ======================================================
 * LESSON 6 - AI Catapult (Landmark -> launch / rotate)
 * ======================================================
 */
//% color=#ef5350 icon="\uf06d" block="Lesson 6 - Catapult"
//% groups=['Init','Vision','Décision','Action','Etat','Paramètres']
//% weight=85
namespace Lesson6_Catapult {
    export enum State {
        //% block="attente"
        Idle = 0,
        //% block="lancer"
        Launch = 1,
        //% block="tourner gauche + lancer"
        LeftLaunch = 2,
        //% block="tourner droite + lancer"
        RightLaunch = 3
    }

    let state = State.Idle
    let lastLm = -1
    let minConf = 0.4

    let servoPort = 6
    let launchAngle = 20
    let restAngle = 0

    let vTurn = 55
    let leftMs = 1700
    let rightMs = 1600

    //% group="Init"
    //% block="Catapult: initialiser"
    export function init(): void {
        Genaral.init()
        Genaral.safeStopAll()
        Genaral.setActive("L6")
        Genaral.setMode(wondercam.Functions.LandmarkRecognition)
        state = State.Idle
        lastLm = -1
        Genaral.servo270(servoPort, restAngle, 300)
    }

    //% group="Paramètres"
    //% block="Catapult: seuil confiance %min"
    //% min.min=0 min.max=1 min.defl=0.4
    export function setConfidence(min: number): void {
        minConf = Genaral.conf(min)
    }

    //% group="Paramètres"
    //% block="Catapult: servo port %p angle lancer %a rest %r"
    //% p.min=1 p.max=6 p.defl=6
    //% a.min=0 a.max=180 a.defl=20
    //% r.min=0 r.max=180 r.defl=0
    export function setServo(p: number, a: number, r: number): void {
        servoPort = p; launchAngle = a; restAngle = r
    }

    //% group="Paramètres"
    //% block="Catapult: vitesse rotation %v gauche %msL ms droite %msR ms"
    //% v.min=0 v.max=100 v.defl=55
    //% msL.min=0 msL.max=8000 msL.defl=1700
    //% msR.min=0 msR.max=8000 msR.defl=1600
    export function setTurn(v: number, msL: number, msR: number): void {
        vTurn = v; leftMs = msL; rightMs = msR
    }

    //% group="Vision"
    //% block="Catapult: lire landmark"
    export function readLandmark(): number {
        lastLm = Genaral.readLandmark(minConf)
        return lastLm
    }

    //% group="Etat"
    //% block="Catapult: dernier landmark"
    export function getLandmark(): number {
        return lastLm
    }

    //% group="Décision"
    //% block="Catapult: décider"
    export function decide(): void {
        if (lastLm == 1) state = State.Launch
        else if (lastLm == 2) state = State.LeftLaunch
        else if (lastLm == 3) state = State.RightLaunch
        else state = State.Idle
    }

    function launch(): void {
        Genaral.servo270(servoPort, launchAngle, 200)
        basic.pause(800)
        Genaral.servo270(servoPort, restAngle, 500)
        basic.pause(600)
    }

    //% group="Action"
    //% block="Catapult: agir"
    export function act(): void {
        if (Genaral.shouldStop() || !Genaral.isActive("L6")) return

        if (state == State.Launch) {
            Genaral.beep()
            launch()
            state = State.Idle
        } else if (state == State.LeftLaunch) {
            Genaral.beep()
            Genaral.pivotLeftFor(vTurn, leftMs)
            basic.pause(150)
            launch()
            Genaral.pivotRightFor(vTurn, leftMs)
            state = State.Idle
        } else if (state == State.RightLaunch) {
            Genaral.beep()
            Genaral.pivotRightFor(vTurn, rightMs)
            basic.pause(150)
            launch()
            Genaral.pivotLeftFor(vTurn, rightMs)
            state = State.Idle
        } else {
            // attente
        }
    }

    //% group="Etat"
    //% block="Catapult: état"
    export function getState(): State {
        return state
    }
}

/**
 * ======================================================
 * LESSON 7 - AI Waste Sorter (Classification -> gates)
 * ======================================================
 */
//% color=#64b5f6 icon="\uf1b8" block="Lesson 7 - Waste Sorter"
//% groups=['Init','Vision','Décision','Action','Etat','Paramètres']
//% weight=84
namespace Lesson7_WasteSorter {
    export enum State {
        //% block="attente"
        Idle = 0,
        //% block="trappe 1"
        Gate1 = 1,
        //% block="trappe 2"
        Gate2 = 2,
        //% block="trappe 3"
        Gate3 = 3,
        //% block="trappe 4"
        Gate4 = 4
    }

    let state = State.Idle
    let lastId = -1
    let minConf = 0.4

    // servos des trappes
    let gate1 = 1
    let gate2 = 2
    let gate3 = 4
    let gate4 = 5

    let openAngle = 52
    let closeAngle = 0

    //% group="Init"
    //% block="WasteSorter: initialiser"
    export function init(): void {
        Genaral.init()
        Genaral.safeStopAll()
        Genaral.setActive("L7")
        Genaral.setMode(wondercam.Functions.Classification)
        state = State.Idle
        lastId = -1

        Genaral.servo270(gate1, closeAngle, 400)
        Genaral.servo270(gate2, closeAngle, 400)
        Genaral.servo270(gate3, closeAngle, 400)
        Genaral.servo270(gate4, closeAngle, 400)
    }

    //% group="Paramètres"
    //% block="WasteSorter: seuil confiance %min"
    //% min.min=0 min.max=1 min.defl=0.4
    export function setConfidence(min: number): void {
        minConf = Genaral.conf(min)
    }

    //% group="Paramètres"
    //% block="WasteSorter: servos trappes %g1 %g2 %g3 %g4"
    //% g1.min=1 g1.max=6 g1.defl=1
    //% g2.min=1 g2.max=6 g2.defl=2
    //% g3.min=1 g3.max=6 g3.defl=4
    //% g4.min=1 g4.max=6 g4.defl=5
    export function setGates(g1: number, g2: number, g3: number, g4: number): void {
        gate1 = g1; gate2 = g2; gate3 = g3; gate4 = g4
    }

    //% group="Vision"
    //% block="WasteSorter: lire ID"
    export function readId(): number {
        lastId = Genaral.readClassId(minConf)
        return lastId
    }

    //% group="Etat"
    //% block="WasteSorter: dernier ID"
    export function getId(): number {
        return lastId
    }

    //% group="Décision"
    //% block="WasteSorter: décider"
    export function decide(): void {
        // mapping simple (comme tes scripts)
        if (lastId >= 2 && lastId <= 4) state = State.Gate1
        else if (lastId >= 5 && lastId <= 7) state = State.Gate2
        else if (lastId >= 8 && lastId <= 10) state = State.Gate3
        else if (lastId >= 11 && lastId <= 13) state = State.Gate4
        else state = State.Idle
    }

    function openClose(port: number): void {
        Genaral.servo270(port, openAngle, 900)
        basic.pause(1200)
        Genaral.servo270(port, closeAngle, 700)
        basic.pause(500)
    }

    //% group="Action"
    //% block="WasteSorter: agir"
    export function act(): void {
        if (Genaral.shouldStop() || !Genaral.isActive("L7")) return

        if (state == State.Gate1) { Genaral.beep(); openClose(gate1); state = State.Idle }
        else if (state == State.Gate2) { Genaral.beep(); openClose(gate2); state = State.Idle }
        else if (state == State.Gate3) { Genaral.beep(); openClose(gate3); state = State.Idle }
        else if (state == State.Gate4) { Genaral.beep(); openClose(gate4); state = State.Idle }
    }

    //% group="Etat"
    //% block="WasteSorter: état"
    export function getState(): State {
        return state
    }
}

/**
 * ======================================================
 * LESSON 8 - AI Multi-legged Robot (Landmark -> motions)
 * ======================================================
 */
//% color=#9575cd icon="\uf6d7" block="Lesson 8 - Multi-legged"
//% groups=['Init','Vision','Décision','Action','Etat','Paramètres']
//% weight=83
namespace Lesson8_MultiLegged {
    export enum State {
        //% block="stop"
        Stop = 0,
        //% block="avance"
        Forward = 1,
        //% block="gauche"
        Left = 2,
        //% block="droite"
        Right = 3
    }

    let state = State.Stop
    let lastLm = -1
    let minConf = 0.4

    let m1 = 1
    let m2 = 2
    let v = 55

    //% group="Init"
    //% block="MultiLegged: initialiser"
    export function init(): void {
        Genaral.init()
        Genaral.safeStopAll()
        Genaral.setActive("L8")
        Genaral.setMode(wondercam.Functions.LandmarkRecognition)
        state = State.Stop
        lastLm = -1
        dadabit.setLego360Servo(m1, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(m2, dadabit.Oriention.Clockwise, 0)
    }

    //% group="Paramètres"
    //% block="MultiLegged: seuil %min"
    //% min.min=0 min.max=1 min.defl=0.4
    export function setConfidence(min: number): void {
        minConf = Genaral.conf(min)
    }

    //% group="Paramètres"
    //% block="MultiLegged: moteurs %p1 %p2 vitesse %speed"
    //% p1.min=1 p1.max=4 p1.defl=1
    //% p2.min=1 p2.max=4 p2.defl=2
    //% speed.min=0 speed.max=100 speed.defl=55
    export function setMotors(p1: number, p2: number, speed: number): void {
        m1 = p1; m2 = p2; v = speed
    }

    //% group="Vision"
    //% block="MultiLegged: lire landmark"
    export function readLandmark(): number {
        lastLm = Genaral.readLandmark(minConf)
        return lastLm
    }

    //% group="Décision"
    //% block="MultiLegged: décider"
    export function decide(): void {
        // exemple : 1=avance, 2=gauche, 3=droite, 5=stop
        if (lastLm == 1) state = State.Forward
        else if (lastLm == 2) state = State.Left
        else if (lastLm == 3) state = State.Right
        else if (lastLm == 5) state = State.Stop
        // sinon on garde l'état actuel
    }

    //% group="Action"
    //% block="MultiLegged: agir"
    export function act(): void {
        if (Genaral.shouldStop() || !Genaral.isActive("L8")) return

        if (state == State.Forward) {
            dadabit.setLego360Servo(m1, dadabit.Oriention.Clockwise, v)
            dadabit.setLego360Servo(m2, dadabit.Oriention.Counterclockwise, v)
        } else if (state == State.Left) {
            dadabit.setLego360Servo(m1, dadabit.Oriention.Counterclockwise, v)
            dadabit.setLego360Servo(m2, dadabit.Oriention.Counterclockwise, v)
        } else if (state == State.Right) {
            dadabit.setLego360Servo(m1, dadabit.Oriention.Clockwise, v)
            dadabit.setLego360Servo(m2, dadabit.Oriention.Clockwise, v)
        } else {
            dadabit.setLego360Servo(m1, dadabit.Oriention.Clockwise, 0)
            dadabit.setLego360Servo(m2, dadabit.Oriention.Clockwise, 0)
        }
    }

    //% group="Etat"
    //% block="MultiLegged: état"
    export function getState(): State {
        return state
    }

    //% group="Etat"
    //% block="MultiLegged: dernier landmark"
    export function getLandmark(): number {
        return lastLm
    }
}

/**
 * ======================================================
 * LESSON 9 - AI Transporter (Line + Number target + Deposit servo 6)
 * Mode B : l'élève contrôle la boucle
 * ======================================================
 */
//% color=#26a69a icon="\uf1b9" block="Lesson 9 - Transporter"
//% groups=['Init','Vision','Décision','Action','Etat','Paramètres']
//% weight=82
namespace Lesson9_Transporter {
    export enum State {
        //% block="attente départ"
        WaitStart = 0,
        //% block="lire cible"
        ReadTarget = 1,
        //% block="suivre ligne"
        Follow = 2,
        //% block="déposer"
        Deposit = 3,
        //% block="fin"
        Done = 4
    }

    let state = State.WaitStart
    let started = false

    let vFollow = 55
    let minConf = 0.4

    let target = 0
    let lastNumber = -1

    let stableInter = 0
    let intersections = 0

    // dépôt servo 6
    let servoPort = 6
    let servoRest = -40
    let servoDrop = -70
    let dropSpeed = 200

    //% group="Init"
    //% block="Transporter: initialiser"
    export function init(): void {
        Genaral.init()
        Genaral.safeStopAll()
        Genaral.setActive("L9")
        Genaral.setMode(wondercam.Functions.NumberRecognition)
        state = State.WaitStart
        started = false
        target = 0
        lastNumber = -1
        stableInter = 0
        intersections = 0
        Genaral.servo270(servoPort, servoRest, 300)
        basic.clearScreen()
    }

    //% group="Paramètres"
    //% block="Transporter: régler vitesse ligne %v"
    //% v.min=0 v.max=100 v.defl=55
    export function setSpeed(v: number): void {
        vFollow = v
    }

    //% group="Paramètres"
    //% block="Transporter: seuil confiance %min"
    //% min.min=0 min.max=1 min.defl=0.4
    export function setConfidence(min: number): void {
        minConf = Genaral.conf(min)
    }

    //% group="Paramètres"
    //% block="Transporter: dépôt servo %p repos %r drop %d vitesse %spd"
    //% p.min=1 p.max=6 p.defl=6
    //% r.min=-180 r.max=180 r.defl=-40
    //% d.min=-180 d.max=180 d.defl=-70
    //% spd.min=0 spd.max=1000 spd.defl=200
    export function setDeposit(p: number, r: number, d: number, spd: number): void {
        servoPort = p
        servoRest = r
        servoDrop = d
        dropSpeed = spd
    }

    //% group="Etat"
    //% block="Transporter: démarrer (départ)"
    export function startGo(): void {
        started = true
        if (state == State.WaitStart) state = State.ReadTarget
    }

    //% group="Etat"
    //% block="Transporter: état"
    export function getState(): State {
        return state
    }

    //% group="Vision"
    //% block="Transporter: lire intersection"
    export function readIntersection(): boolean {
        Genaral.updateLine()
        let inter = Genaral.isIntersection1111()
        if (inter) stableInter += 1
        else stableInter = 0
        return inter
    }

    //% group="Vision"
    //% block="Transporter: lire nombre"
    export function readNumber(): number {
        lastNumber = Genaral.readNumber(minConf)
        return lastNumber
    }

    //% group="Etat"
    //% block="Transporter: cible"
    export function getTarget(): number {
        return target
    }

    //% group="Etat"
    //% block="Transporter: compteur barres"
    export function getIntersections(): number {
        return intersections
    }

    //% group="Décision"
    //% block="Transporter: décider"
    export function decide(): void {
        if (!started) { state = State.WaitStart; return }
        if (state == State.Done) return

        // si cible pas définie -> ReadTarget
        if (target == 0) {
            state = State.ReadTarget
            return
        }

        // si barre stable (anti-rebond simple)
        if (stableInter >= 4) {
            intersections += 1
            // règle simple : target=1 -> 2e barre ; target=2 -> 3e barre
            let needed = (target == 1) ? 2 : 3
            if (intersections == needed) state = State.Deposit
            else state = State.Follow
            stableInter = 0
            return
        }

        state = State.Follow
    }

    //% group="Action"
    //% block="Transporter: agir"
    export function act(): void {
        if (Genaral.shouldStop() || !Genaral.isActive("L9")) return

        if (state == State.WaitStart) {
            Genaral.stopDrive()
            return
        }

        if (state == State.ReadTarget) {
            Genaral.stopDrive()
            if (lastNumber == 1 || lastNumber == 2) {
                target = lastNumber
                Genaral.beep()
                basic.showNumber(target)
                basic.pause(200)
                state = State.Follow
            }
            return
        }

        if (state == State.Follow) {
            Genaral.lineFollow(vFollow)
            return
        }

        if (state == State.Deposit) {
            Genaral.stopDrive()
            basic.pause(100)
            // séquence simple (à adapter ensuite)
            Genaral.pivotRightFor(44, 1200)
            basic.pause(100)
            Genaral.backwardFor(44, 1000)
            basic.pause(100)
            Genaral.servo270(servoPort, servoDrop, dropSpeed)
            basic.pause(1200)
            Genaral.servo270(servoPort, servoRest, 400)
            basic.pause(600)
            state = State.Done
            Genaral.stopDrive()
            return
        }

        if (state == State.Done) {
            Genaral.stopDrive()
        }
    }
}

/**
 * ======================================================
 * LESSON 10 - AI Handler (Color detect -> pick/drop)
 * Mode B : lire -> décider -> agir
 * ======================================================
 */
//% color=#ffa726 icon="\uf0c0" block="Lesson 10 - Handler"
//% groups=['Init','Vision','Décision','Action','Etat','Paramètres']
//% weight=81
namespace Lesson10_Handler {
    export enum State {
        //% block="chercher"
        Search = 0,
        //% block="approcher"
        Approach = 1,
        //% block="saisir"
        Grab = 2,
        //% block="transporter"
        Carry = 3,
        //% block="déposer"
        Drop = 4
    }

    let state = State.Search
    let vFollow = 55
    let colorId = 1
    let found = false
    let x = 0
    let y = 0
    let centerMin = 80
    let centerMax = 240
    let nearY = 230

    // pince servos (exemple)
    let servoA = 5
    let servoB = 6
    let aHome = -60
    let aOpen = -5
    let bHome = 15
    let bClose = -25

    let stableInter = 0
    let carrying = false

    //% group="Init"
    //% block="Handler: initialiser"
    export function init(): void {
        Genaral.init()
        Genaral.safeStopAll()
        Genaral.setActive("L10")
        Genaral.setMode(wondercam.Functions.ColorDetect)
        state = State.Search
        carrying = false
        stableInter = 0
        found = false
        Genaral.servo270(servoA, aHome, 300)
        Genaral.servo270(servoB, bHome, 300)
    }

    //% group="Paramètres"
    //% block="Handler: vitesse ligne %v"
    //% v.min=0 v.max=100 v.defl=55
    export function setSpeed(v: number): void {
        vFollow = v
    }

    //% group="Paramètres"
    //% block="Handler: couleur ID %id"
    //% id.min=1 id.max=10 id.defl=1
    export function setColorId(id: number): void {
        colorId = id
    }

    //% group="Paramètres"
    //% block="Handler: centrage X min %mn max %mx proche Y %ny"
    //% mn.min=0 mn.max=320 mn.defl=80
    //% mx.min=0 mx.max=320 mx.defl=240
    //% ny.min=0 ny.max=320 ny.defl=230
    export function setCenter(mn: number, mx: number, ny: number): void {
        centerMin = mn; centerMax = mx; nearY = ny
    }

    //% group="Paramètres"
    //% block="Handler: servos A %a B %b Ahome %ah Aopen %ao Bhome %bh Bclose %bc"
    //% a.min=1 a.max=6 a.defl=5
    //% b.min=1 b.max=6 b.defl=6
    //% ah.min=-180 ah.max=180 ah.defl=-60
    //% ao.min=-180 ao.max=180 ao.defl=-5
    //% bh.min=-180 bh.max=180 bh.defl=15
    //% bc.min=-180 bc.max=180 bh.defl=-25
    export function setGripper(a: number, b: number, ah: number, ao: number, bh: number, bc: number): void {
        servoA = a; servoB = b
        aHome = ah; aOpen = ao
        bHome = bh; bClose = bc
    }

    //% group="Vision"
    //% block="Handler: lire couleur"
    export function readColor(): boolean {
        found = Genaral.isColor(colorId)
        if (found) {
            x = Genaral.colorX(colorId)
            y = Genaral.colorY(colorId)
        } else {
            x = 0; y = 0
        }
        return found
    }

    //% group="Vision"
    //% block="Handler: lire intersection"
    export function readIntersection(): boolean {
        Genaral.updateLine()
        let inter = Genaral.isIntersection1111()
        if (inter) stableInter += 1
        else stableInter = 0
        return inter
    }

    //% group="Etat"
    //% block="Handler: état"
    export function getState(): State {
        return state
    }

    //% group="Etat"
    //% block="Handler: objet détecté ?"
    export function isFound(): boolean {
        return found
    }

    //% group="Etat"
    //% block="Handler: X"
    export function getX(): number { return x }

    //% group="Etat"
    //% block="Handler: Y"
    export function getY(): number { return y }

    //% group="Décision"
    //% block="Handler: décider"
    export function decide(): void {
        if (!carrying) {
            if (found) {
                // centré -> approcher
                if (x >= centerMin && x <= centerMax) state = State.Approach
                else state = State.Search
            } else {
                state = State.Search
            }
        } else {
            // on transporte : dépôt à la barre
            if (stableInter >= 4) {
                stableInter = 0
                state = State.Drop
            } else state = State.Carry
        }
    }

    function grabSeq(): void {
        Genaral.stopDrive()
        basic.pause(120)
        Genaral.servo270(servoA, aOpen, 500); basic.pause(500)
        Genaral.servo270(servoB, bClose, 500); basic.pause(600)
        Genaral.servo270(servoA, aHome, 500); basic.pause(600)
        carrying = true
    }

    function dropSeq(): void {
        Genaral.stopDrive()
        basic.pause(120)
        Genaral.servo270(servoA, aOpen, 500); basic.pause(500)
        Genaral.servo270(servoB, bHome, 500); basic.pause(600)
        Genaral.servo270(servoA, aHome, 500); basic.pause(600)
        carrying = false
    }

    //% group="Action"
    //% block="Handler: agir"
    export function act(): void {
        if (Genaral.shouldStop() || !Genaral.isActive("L10")) return

        if (state == State.Search) {
            // suivre ligne pendant la recherche
            Genaral.lineFollow(vFollow)
            return
        }

        if (state == State.Approach) {
            // approche simple : suivre ligne tant que Y < nearY
            if (found && y < nearY) {
                Genaral.lineFollow(vFollow)
            } else {
                state = State.Grab
            }
            return
        }

        if (state == State.Grab) {
            Genaral.beep()
            grabSeq()
            state = State.Carry
            return
        }

        if (state == State.Carry) {
            Genaral.lineFollow(vFollow)
            return
        }

        if (state == State.Drop) {
            Genaral.beep()
            dropSeq()
            state = State.Search
            return
        }
    }
}
