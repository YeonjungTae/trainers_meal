# Generated by Django 4.2.13 on 2024-10-09 11:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("order", "0011_rename_added_amount_order_detail_amount_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="payment",
            name="billing_key",
        ),
        migrations.RemoveField(
            model_name="payment",
            name="customer_key",
        ),
        migrations.RemoveField(
            model_name="payment",
            name="payment_key",
        ),
        migrations.RemoveField(
            model_name="payment",
            name="toss_order_id",
        ),
        migrations.AlterField(
            model_name="payment",
            name="status",
            field=models.IntegerField(
                choices=[(0, "결제 실패"), (1, "결제 승인"), (2, "구독 기간 초과")],
                null=True,
                verbose_name="결제 처리 상태",
            ),
        ),
    ]
