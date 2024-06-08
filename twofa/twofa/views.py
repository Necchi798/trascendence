import io, base64, pyotp, qrcode, jwt, datetime
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from rest_framework import status
from rest_framework.views import APIView
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import QRCode
from rest_framework.response import Response
import smtplib

class QRCodeCreationView(APIView):
    def post(self, request):
        # Codifica l'URI come immagine QR
        key = base64.b32encode(settings.SECRET_KEY.encode() + str(request.data["id"]).encode())
        uri = pyotp.totp.TOTP(key).provisioning_uri(name=request.data["username"], issuer_name="ft_transcendence")
        qrcode_image = qrcode.make(uri)

        # Salva l'immagine QR come file temporaneo
        buffer = io.BytesIO()
        qrcode_image.save(buffer, format='PNG')
        buffer.seek(0)

        # Leggi i dati binari dall'immagine QR
        image_data = buffer.read()

        # Salva i dati binari nel database
        try:
            qr_code = QRCode.objects.create(image=image_data, owner_id=request.data["id"])
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": str(e)})
        print(type(qr_code.image))
        return Response(status=status.HTTP_201_CREATED, data={"message": "QR code created successfully."})
    
    def get(self, request):
        try:
            qr_code = QRCode.objects.get(owner_id=request.data["id"])
            image_data = qr_code.image
            #image_base64 = base64.b64encode(image_data).decode()
            response_data = {
            #    "image": image_base64,
                "content_type": "image/png"
            }
            #return JsonResponse(response_data)
            return HttpResponse(image_data, content_type="image/png")
        except QRCode.DoesNotExist:
            raise NotFound(detail="QR code not found for this user.")
    
    def delete(self, request):
        try:
            qr_code = QRCode.objects.get(owner_id=request.data["id"])
            qr_code.delete()
            return Response(status=status.HTTP_204_NO_CONTENT, data={"message": "QR code deleted successfully."})
        except QRCode.DoesNotExist:
            raise NotFound(detail="QR code not found for this user.")

class TOPVerificationView(APIView):
    def post(self, request):
        key=base64.b32encode(settings.SECRET_KEY.encode() + str(request.data["id"]).encode())
        totp = pyotp.TOTP(key)
#        print(str(totp.now()))
        if totp.verify(request.data["code"]):
            return Response(status=status.HTTP_200_OK, data={"message": "Code is valid."})
        
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED, data={"message": "Code is invalid."})

class setMail(APIView):
    def post(self, request):
        try:
            qr_code = QRCode.objects.get(owner_id=request.data["id"])
            qr_code.email = request.data["email"]
            qr_code.save()
            return Response(status=status.HTTP_201_CREATED, data={"message": "Email set successfully."})
        except QRCode.DoesNotExist:
            raise NotFound(detail="QR code not found for this user.")

class sendMail(APIView):
    def post(self, request):
        try:
            mail=QRCode.objects.filter(owner_id=request.data["id"]).values('email')
            sender = settings.SENDER
            app_password = settings.APP_PWD
            dest = mail[0]['email']
            server = smtplib.SMTP("smtp.gmail.com", 587)
            server.starttls()
            server.login(sender, app_password)
            key=base64.b32encode(settings.SECRET_KEY.encode() + str(request.data["id"]).encode())
            totp = pyotp.TOTP(key)
            server.sendmail(sender, dest, str(totp.now()))
            server.quit()
            return Response(status=status.HTTP_200_OK, data={"message": "Mail sent successfully."})
        except QRCode.DoesNotExist:
            raise NotFound(detail="QR code not found for this user.")
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": str(e)})
        

