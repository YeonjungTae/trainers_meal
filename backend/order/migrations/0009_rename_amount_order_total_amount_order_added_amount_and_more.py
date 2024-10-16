# Generated by Django 4.2.13 on 2024-10-07 21:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("order", "0008_alter_nutrients_calories_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="order",
            old_name="amount",
            new_name="total_amount",
        ),
        migrations.AddField(
            model_name="order",
            name="added_amount",
            field=models.IntegerField(default=0, verbose_name="추가 금액"),
        ),
        migrations.AddField(
            model_name="order",
            name="day_cnt",
            field=models.IntegerField(default=1, verbose_name="식수"),
        ),
        migrations.AddField(
            model_name="order",
            name="default_amount",
            field=models.IntegerField(default=0, verbose_name="기본 금액"),
        ),
    ]
