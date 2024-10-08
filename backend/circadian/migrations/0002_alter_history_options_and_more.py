# Generated by Django 5.0.6 on 2024-09-12 08:08

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("circadian", "0001_initial"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="history",
            options={
                "ordering": ["-timestamp"],
                "verbose_name": "history",
                "verbose_name_plural": "histories",
            },
        ),
        migrations.RenameField(
            model_name="diary",
            old_name="front_diary_id",
            new_name="front_id",
        ),
        migrations.RenameField(
            model_name="diary",
            old_name="diary_id",
            new_name="id",
        ),
        migrations.RenameField(
            model_name="history",
            old_name="history_id",
            new_name="id",
        ),
        migrations.RenameField(
            model_name="history",
            old_name="edit_timestamp",
            new_name="timestamp",
        ),
        migrations.RenameField(
            model_name="history",
            old_name="history_type",
            new_name="type",
        ),
        migrations.RenameField(
            model_name="log",
            old_name="log_id",
            new_name="id",
        ),
        migrations.RenameField(
            model_name="user",
            old_name="user_id",
            new_name="id",
        ),
    ]
