import pyotp, qrcode

key="Vamos"


uri = pyotp.totp.TOTP(key).provisioning_uri(name="Jhon Doe", issuer_name="Secure App")

print("Scan this QR code with your Google Authenticator App:", uri)

qrcode.make(uri).save("qrcode.png")

totp=pyotp.TOTP(key)
while True:
    print(totp.now())
    print(totp.verify(input("Enter the code: ")))

