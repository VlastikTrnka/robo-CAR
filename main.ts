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
bluetooth.onBluetoothConnected(function on_bluetooth_connected() {
    
    pripojeno = 1
})
// AUTOMATICKY
control.inBackground(function onIn_background() {
    input.onButtonPressed(Button.A, function on_button_pressed_a() {
        let prepni: number;
        if (prepni == 0) {
            prepni = 1
            basic.showNumber(prepni)
        } else {
            prepni = 0
            basic.showNumber(prepni)
        }
        
    })
})
// MANUALNĚ s pomocí (stejný jako automaticky ale když sníma obě černý tak zastaví a podle uartdata odbočí)
//  else:
//      pins.set_pull(pin_R, PinPullMode.PULL_NONE)
//      read_R = pins.digital_read_pin(pin_R)
//      pins.set_pull(pin_L, PinPullMode.PULL_NONE)
//      read_L = pins.digital_read_pin(pin_L)
//      def on_bluetooth_disconnected():
//          global pripojeno
//          pripojeno = 0
//      bluetooth.on_bluetooth_disconnected(on_bluetooth_disconnected)
//      if read_R==1 and read_L==1:
//          pins.set_pull(pin_R, PinPullMode.PULL_NONE)
//          read_R = pins.digital_read_pin(pin_R)
//          pins.set_pull(pin_L, PinPullMode.PULL_NONE)
//          read_L = pins.digital_read_pin(pin_L)
//          PCAmotor.motor_run(leftmotor, rychlej)
//          PCAmotor.motor_run(rightmotor, pomalej)
//      if read_R==0 and read_L==0:
//          pins.set_pull(pin_R, PinPullMode.PULL_NONE)
//          read_R = pins.digital_read_pin(pin_R)
//          pins.set_pull(pin_L, PinPullMode.PULL_NONE)
//          read_L = pins.digital_read_pin(pin_L)
//          PCAmotor.motor_stop_all()
//          if uartdata == '0':
//              pins.set_pull(pin_R, PinPullMode.PULL_NONE)
//              read_R = pins.digital_read_pin(pin_R)
//              pins.set_pull(pin_L, PinPullMode.PULL_NONE)
//              read_L = pins.digital_read_pin(pin_L)
//          if uartdata == "A":
//                  #rovně
//                  PCAmotor.motor_run(rightmotor, 100)
//                  PCAmotor.motor_run(leftmotor, 100)
//          if uartdata == "D":
//                  #doprava
//                  PCAmotor.motor_run(rightmotor, 0)
//                  PCAmotor.motor_run(leftmotor, 70)
//          if uartdata == "C":
//                  #doleva
//                  PCAmotor.motor_run(leftmotor, 0)
//                  PCAmotor.motor_run(rightmotor, 70)
//      if read_L==0 and read_R==1: #doprava
//          pins.set_pull(pin_R, PinPullMode.PULL_NONE)
//          read_R = pins.digital_read_pin(pin_R)
//          pins.set_pull(pin_L, PinPullMode.PULL_NONE)
//          read_L = pins.digital_read_pin(pin_L)
//          PCAmotor.motor_run(leftmotor,10)
//          PCAmotor.motor_run(rightmotor,85)
//      if read_L==1 and read_R==0: #doleva
//          pins.set_pull(pin_R, PinPullMode.PULL_NONE)
//          read_R = pins.digital_read_pin(pin_R)
//          pins.set_pull(pin_L, PinPullMode.PULL_NONE)
//          read_L = pins.digital_read_pin(pin_L)
//          PCAmotor.motor_run(leftmotor,85)
//          PCAmotor.motor_run(rightmotor,12)
basic.forever(function automat() {
    let uartdata: string;
    let read_R: number;
    let read_L: number;
    if (pripojeno == 0) {
        //  sviti = 0; nesviti = 1
        basic.showIcon(IconNames.Heart)
        if (prepni == 1) {
            uartdata = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Hash))
            if (uartdata == "0") {
                PCAmotor.MotorStopAll()
            }
            
            if (uartdata == "A") {
                PCAmotor.MotorRun(PCAmotor.Motors.M2, 255)
                PCAmotor.MotorRun(PCAmotor.Motors.M1, 255)
            }
            
            if (uartdata == "B") {
                PCAmotor.MotorRun(PCAmotor.Motors.M2, -255)
                PCAmotor.MotorRun(PCAmotor.Motors.M1, -255)
            }
            
            if (uartdata == "D") {
                PCAmotor.MotorRun(PCAmotor.Motors.M2, 255)
                PCAmotor.MotorRun(PCAmotor.Motors.M1, 50)
            }
            
            if (uartdata == "C") {
                PCAmotor.MotorRun(PCAmotor.Motors.M2, 50)
                PCAmotor.MotorRun(PCAmotor.Motors.M1, 255)
            }
            
        }
        
        if (prepni == 0) {
            pins.setPull(pin_R, PinPullMode.PullNone)
            read_R = pins.digitalReadPin(pin_R)
            pins.setPull(pin_L, PinPullMode.PullNone)
            read_L = pins.digitalReadPin(pin_L)
            if (read_R == 1 && read_L == 1) {
                pins.setPull(pin_R, PinPullMode.PullNone)
                read_R = pins.digitalReadPin(pin_R)
                pins.setPull(pin_L, PinPullMode.PullNone)
                read_L = pins.digitalReadPin(pin_L)
                PCAmotor.MotorRun(leftmotor, pomalej)
                PCAmotor.MotorRun(rightmotor, rychlej)
            }
            
            if (read_R == 0 && read_L == 0) {
                pins.setPull(pin_R, PinPullMode.PullNone)
                read_R = pins.digitalReadPin(pin_R)
                pins.setPull(pin_L, PinPullMode.PullNone)
                read_L = pins.digitalReadPin(pin_L)
                PCAmotor.MotorRun(leftmotor, pomalej)
                PCAmotor.MotorRun(rightmotor, rychlej)
            }
            
            if (read_L == 0 && read_R == 1) {
                // doprava
                pins.setPull(pin_R, PinPullMode.PullNone)
                read_R = pins.digitalReadPin(pin_R)
                pins.setPull(pin_L, PinPullMode.PullNone)
                read_L = pins.digitalReadPin(pin_L)
                PCAmotor.MotorRun(leftmotor, 10)
                PCAmotor.MotorRun(rightmotor, 120)
            }
            
            if (read_L == 1 && read_R == 0) {
                // doleva
                pins.setPull(pin_R, PinPullMode.PullNone)
                read_R = pins.digitalReadPin(pin_R)
                pins.setPull(pin_L, PinPullMode.PullNone)
                read_L = pins.digitalReadPin(pin_L)
                PCAmotor.MotorRun(leftmotor, 120)
                PCAmotor.MotorRun(rightmotor, 12)
            }
            
        }
        
    }
    
})
