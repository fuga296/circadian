# Generated by Django 5.1.1 on 2024-12-26 05:45

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("circadian", "0011_rename_type_history_action_and_more"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="log",
            options={
                "ordering": ["-timestamp"],
                "verbose_name": "log",
                "verbose_name_plural": "logs",
            },
        ),
    ]
