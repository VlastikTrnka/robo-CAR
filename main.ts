let uartdata = ""
let pripojeno = 0
bluetooth.setTransmitPower(7)
bluetooth.startUartService()
let pin_L = DigitalPin.P12
let pin_R = DigitalPin.P15
let rightmotor = PCAmotor.Motors.M1
let leftmotor = PCAmotor.Motors.M2
let pomalej = 140
let rychlej = pomalej + 10
let prepni = 0
// vyplej prijme V; zaplej prijme S
bluetooth.onBluetoothConnected(function on_bluetooth_connected() {
    
    pripojeno = 1
    while (pripojeno == 1) {
        uartdata = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Hash))
        console.log(uartdata)
    }
})
bluetooth.onBluetoothDisconnected(function on_bluetooth_disconnected() {
    
    pripojeno = 0
})
//  def onIn_background():
//      global uartdata
//      if uartdata == 'S':
//          global prepni
//          prepni = 1
//          basic.show_string('S')
//      if uartdata == 'V':
//          global prepni
//          prepni = 0
//          PCAmotor.motor_run(PCAmotor.Motors.M2, 0)
//          PCAmotor.motor_run(PCAmotor.Motors.M1, 0)
//          basic.show_string('V')
//  control.in_background(onIn_background)
function manual() {
    PCAmotor.MotorStopAll()
    
    if (uartdata == "S") {
        prepni = 1
    }
    
    if (uartdata == "0") {
        PCAmotor.MotorStopAll()
    }
    
    if (uartdata == "A") {
        PCAmotor.MotorRun(leftmotor, 215)
        PCAmotor.MotorRun(rightmotor, 255)
    }
    
    if (uartdata == "B") {
        PCAmotor.MotorRun(leftmotor, -255)
        PCAmotor.MotorRun(rightmotor, -205)
    }
    
    if (uartdata == "D") {
        PCAmotor.MotorRun(leftmotor, 255)
        PCAmotor.MotorRun(rightmotor, 0)
    }
    
    if (uartdata == "C") {
        PCAmotor.MotorRun(leftmotor, 0)
        PCAmotor.MotorRun(rightmotor, 255)
    }
    
}

basic.forever(function funguj() {
    
    if (prepni == 1) {
        automat()
    }
    
    if (prepni == 0) {
        manual()
    }
    
})
function automat() {
    
    if (uartdata == "V") {
        prepni = 0
        PCAmotor.MotorStopAll()
    }
    
    pins.setPull(pin_R, PinPullMode.PullNone)
    let read_R = pins.digitalReadPin(pin_R)
    pins.setPull(pin_L, PinPullMode.PullNone)
    let read_L = pins.digitalReadPin(pin_L)
    if (read_R == 1 && read_L == 1) {
        // rovně
        PCAmotor.MotorRun(leftmotor, pomalej)
        PCAmotor.MotorRun(rightmotor, rychlej)
    }
    
    if (read_R == 0 && read_L == 0) {
        PCAmotor.MotorRun(leftmotor, pomalej)
        PCAmotor.MotorRun(rightmotor, rychlej)
    }
    
    if (read_L == 0 && read_R == 1) {
        // doprava
        PCAmotor.MotorRun(leftmotor, 10)
        PCAmotor.MotorRun(rightmotor, 120)
    }
    
    if (read_L == 1 && read_R == 0) {
        // doleva
        PCAmotor.MotorRun(leftmotor, 120)
        PCAmotor.MotorRun(rightmotor, 12)
    }
    
    if (uartdata == "A") {
        PCAmotor.MotorRun(leftmotor, -180)
        PCAmotor.MotorRun(rightmotor, 180)
        basic.pause(500)
        PCAmotor.MotorStopAll()
    }
    
    if (uartdata == "C") {
        PCAmotor.MotorRun(leftmotor, 0)
        PCAmotor.MotorRun(rightmotor, 180)
    }
    
    if (uartdata == "D") {
        PCAmotor.MotorRun(leftmotor, 180)
        PCAmotor.MotorRun(rightmotor, 0)
    }
    
    if (uartdata == "0") {
        pins.setPull(pin_R, PinPullMode.PullNone)
        read_R = pins.digitalReadPin(pin_R)
        pins.setPull(pin_L, PinPullMode.PullNone)
        read_L = pins.digitalReadPin(pin_L)
    }
    
}

