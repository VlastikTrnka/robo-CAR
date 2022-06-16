uartdata = ""
pripojeno = 0
bluetooth.set_transmit_power(7)
bluetooth.start_uart_service()
pin_L = DigitalPin.P12
pin_R = DigitalPin.P15

rightmotor = PCAmotor.Motors.M1
leftmotor = PCAmotor.Motors.M2
pomalej = 140
rychlej = pomalej - 12
prepni = 0

#vyplej prijme V; zaplej prijme S

def on_bluetooth_connected():
    global uartdata, pripojeno
    pripojeno = 1
    while pripojeno == 1:
        uartdata = bluetooth.uart_read_until(serial.delimiters(Delimiters.HASH))
        print(uartdata)
bluetooth.on_bluetooth_connected(on_bluetooth_connected)
def on_bluetooth_disconnected():
    global pripojeno
    pripojeno = 0
bluetooth.on_bluetooth_disconnected(on_bluetooth_disconnected)

# def onIn_background():
#     global uartdata
#     if uartdata == 'S':
#         global prepni
#         prepni = 1
#         basic.show_string('S')
#     if uartdata == 'V':
#         global prepni
#         prepni = 0
#         PCAmotor.motor_run(PCAmotor.Motors.M2, 0)
#         PCAmotor.motor_run(PCAmotor.Motors.M1, 0)
#         basic.show_string('V')
# control.in_background(onIn_background)

def manual():
    PCAmotor.motor_stop_all()
    global uartdata, prepni
    if uartdata == 'S':
        prepni = 1
    if uartdata == '0':
        PCAmotor.motor_stop_all()
    if uartdata == 'A':
        PCAmotor.motor_run(leftmotor, 215)
        PCAmotor.motor_run(rightmotor, 255)
    if uartdata == "B":
        PCAmotor.motor_run(leftmotor, -255)
        PCAmotor.motor_run(rightmotor, -205)
    if uartdata == "D":
        PCAmotor.motor_run(leftmotor, 255)
        PCAmotor.motor_run(rightmotor, 0)
    if uartdata == "C":
        PCAmotor.motor_run(leftmotor, 0)
        PCAmotor.motor_run(rightmotor, 255)

def funguj():
    global prepni
    if prepni == 1:
        automat()
    if prepni == 0:
        manual()
basic.forever(funguj)

def automat():
    global uartdata, prepni, pomalej, rychlej
    if uartdata == 'V':
        prepni = 0
        PCAmotor.motor_stop_all()

    pins.set_pull(pin_R, PinPullMode.PULL_NONE)
    read_R = pins.digital_read_pin(pin_R)
    pins.set_pull(pin_L, PinPullMode.PULL_NONE)
    read_L = pins.digital_read_pin(pin_L)
    if read_R==1 and read_L==1: #rovně
        PCAmotor.motor_run(leftmotor, pomalej)
        PCAmotor.motor_run(rightmotor, rychlej)

    if read_R==0 and read_L==0:
        PCAmotor.motor_run(leftmotor, pomalej)
        PCAmotor.motor_run(rightmotor, rychlej)

    if read_L==1 and read_R==0: #doprava
        PCAmotor.motor_run(leftmotor,115)
        PCAmotor.motor_run(rightmotor,8)
    if read_L==0 and read_R==1: #doleva
        PCAmotor.motor_run(leftmotor,10)
        PCAmotor.motor_run(rightmotor,115)

    if uartdata == 'A':
        PCAmotor.motor_run(leftmotor, -180)
        PCAmotor.motor_run(rightmotor, 180)
        basic.pause(500)
        PCAmotor.motor_stop_all()
    if uartdata == 'C':
        PCAmotor.motor_run(leftmotor,0)
        PCAmotor.motor_run(rightmotor,180)
    if uartdata == 'D':
        PCAmotor.motor_run(leftmotor, 200)
        PCAmotor.motor_run(rightmotor,0)
    if uartdata == '0':
        pins.set_pull(pin_R, PinPullMode.PULL_NONE)
        read_R = pins.digital_read_pin(pin_R)
        pins.set_pull(pin_L, PinPullMode.PULL_NONE)
        read_L = pins.digital_read_pin(pin_L)

