uartdata = ""
pripojeno = 0
bluetooth.set_transmit_power(7)
bluetooth.start_uart_service()
pin_L = DigitalPin.P12
pin_R = DigitalPin.P15

rightmotor = PCAmotor.Motors.M1
leftmotor = PCAmotor.Motors.M2
pomalej=140
rychlej=pomalej+10
prepni = 0

def on_bluetooth_connected():
    global pripojeno, uartdata, prepni
    pripojeno = 1
bluetooth.on_bluetooth_connected(on_bluetooth_connected)
#AUTOMATICKY
def onIn_background():
    def on_button_pressed_a():
        if prepni == 0:
            prepni = 1
            basic.show_number(prepni)
        else:
            prepni = 0
            basic.show_number(prepni)
    input.on_button_pressed(Button.A, on_button_pressed_a)
control.in_background(onIn_background)
def automat():
    if pripojeno == 0:
        # sviti = 0; nesviti = 1
        basic.show_icon(IconNames.HEART)
        if prepni == 1:
            uartdata = bluetooth.uart_read_until(serial.delimiters(Delimiters.HASH))
            if uartdata == '0':
                PCAmotor.motor_stop_all()
            if uartdata == 'A':
                PCAmotor.motor_run(PCAmotor.Motors.M2, 255)
                PCAmotor.motor_run(PCAmotor.Motors.M1, 255)
            if uartdata == "B":
                PCAmotor.motor_run(PCAmotor.Motors.M2, -255)
                PCAmotor.motor_run(PCAmotor.Motors.M1, -255)
            if uartdata == "D":
                PCAmotor.motor_run(PCAmotor.Motors.M2, 255)
                PCAmotor.motor_run(PCAmotor.Motors.M1, 50)
            if uartdata == "C":
                PCAmotor.motor_run(PCAmotor.Motors.M2, 50)
                PCAmotor.motor_run(PCAmotor.Motors.M1, 255)
        if prepni == 0:
            pins.set_pull(pin_R, PinPullMode.PULL_NONE)
            read_R = pins.digital_read_pin(pin_R)
            pins.set_pull(pin_L, PinPullMode.PULL_NONE)
            read_L = pins.digital_read_pin(pin_L)

            if read_R==1 and read_L==1:
                pins.set_pull(pin_R, PinPullMode.PULL_NONE)
                read_R = pins.digital_read_pin(pin_R)
                pins.set_pull(pin_L, PinPullMode.PULL_NONE)
                read_L = pins.digital_read_pin(pin_L)
                PCAmotor.motor_run(leftmotor, pomalej)
                PCAmotor.motor_run(rightmotor, rychlej)

            if read_R==0 and read_L==0:
                pins.set_pull(pin_R, PinPullMode.PULL_NONE)
                read_R = pins.digital_read_pin(pin_R)
                pins.set_pull(pin_L, PinPullMode.PULL_NONE)
                read_L = pins.digital_read_pin(pin_L)
                PCAmotor.motor_run(leftmotor, pomalej)
                PCAmotor.motor_run(rightmotor, rychlej)

            if read_L==0 and read_R==1: #doprava
                pins.set_pull(pin_R, PinPullMode.PULL_NONE)
                read_R = pins.digital_read_pin(pin_R)
                pins.set_pull(pin_L, PinPullMode.PULL_NONE)
                read_L = pins.digital_read_pin(pin_L)
                PCAmotor.motor_run(leftmotor,10)
                PCAmotor.motor_run(rightmotor,120)

            if read_L==1 and read_R==0: #doleva
                pins.set_pull(pin_R, PinPullMode.PULL_NONE)
                read_R = pins.digital_read_pin(pin_R)
                pins.set_pull(pin_L, PinPullMode.PULL_NONE)
                read_L = pins.digital_read_pin(pin_L)
                PCAmotor.motor_run(leftmotor,120)
                PCAmotor.motor_run(rightmotor,12)
    #MANUALNĚ s pomocí (stejný jako automaticky ale když sníma obě černý tak zastaví a podle uartdata odbočí)
        # else:
        #     pins.set_pull(pin_R, PinPullMode.PULL_NONE)
        #     read_R = pins.digital_read_pin(pin_R)
        #     pins.set_pull(pin_L, PinPullMode.PULL_NONE)
        #     read_L = pins.digital_read_pin(pin_L)
        #     def on_bluetooth_disconnected():
        #         global pripojeno
        #         pripojeno = 0
        #     bluetooth.on_bluetooth_disconnected(on_bluetooth_disconnected)
        #     if read_R==1 and read_L==1:
        #         pins.set_pull(pin_R, PinPullMode.PULL_NONE)
        #         read_R = pins.digital_read_pin(pin_R)
        #         pins.set_pull(pin_L, PinPullMode.PULL_NONE)
        #         read_L = pins.digital_read_pin(pin_L)
        #         PCAmotor.motor_run(leftmotor, rychlej)
        #         PCAmotor.motor_run(rightmotor, pomalej)
        
        #     if read_R==0 and read_L==0:
        #         pins.set_pull(pin_R, PinPullMode.PULL_NONE)
        #         read_R = pins.digital_read_pin(pin_R)
        #         pins.set_pull(pin_L, PinPullMode.PULL_NONE)
        #         read_L = pins.digital_read_pin(pin_L)
        #         PCAmotor.motor_stop_all()
        #         if uartdata == '0':
        #             pins.set_pull(pin_R, PinPullMode.PULL_NONE)
        #             read_R = pins.digital_read_pin(pin_R)
        #             pins.set_pull(pin_L, PinPullMode.PULL_NONE)
        #             read_L = pins.digital_read_pin(pin_L)
        #         if uartdata == "A":
        #                 #rovně
        #                 PCAmotor.motor_run(rightmotor, 100)
        #                 PCAmotor.motor_run(leftmotor, 100)
        #         if uartdata == "D":
        #                 #doprava
        #                 PCAmotor.motor_run(rightmotor, 0)
        #                 PCAmotor.motor_run(leftmotor, 70)
        #         if uartdata == "C":
        #                 #doleva
        #                 PCAmotor.motor_run(leftmotor, 0)
        #                 PCAmotor.motor_run(rightmotor, 70)
                
        #     if read_L==0 and read_R==1: #doprava
        #         pins.set_pull(pin_R, PinPullMode.PULL_NONE)
        #         read_R = pins.digital_read_pin(pin_R)
        #         pins.set_pull(pin_L, PinPullMode.PULL_NONE)
        #         read_L = pins.digital_read_pin(pin_L)
        #         PCAmotor.motor_run(leftmotor,10)
        #         PCAmotor.motor_run(rightmotor,85)

        #     if read_L==1 and read_R==0: #doleva
        #         pins.set_pull(pin_R, PinPullMode.PULL_NONE)
        #         read_R = pins.digital_read_pin(pin_R)
        #         pins.set_pull(pin_L, PinPullMode.PULL_NONE)
        #         read_L = pins.digital_read_pin(pin_L)
        #         PCAmotor.motor_run(leftmotor,85)
        #         PCAmotor.motor_run(rightmotor,12)
basic.forever(automat)
