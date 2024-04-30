# Generated by Django 5.0.4 on 2024-04-30 16:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('twofa', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='QRCode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.BinaryField()),
                ('owner', models.IntegerField(unique=True)),
            ],
        ),
        migrations.DeleteModel(
            name='TFAUser',
        ),
    ]
