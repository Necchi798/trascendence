import io
import base64
import pyotp
import qrcode
from django.conf import settings
from django.http import HttpResponse
from rest_framework import status
from rest_framework.views import APIView
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import QRCode
from rest_framework.response import Response

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
            return HttpResponse(image_data, content_type='image/png')
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
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "Code is invalid."})
        
