# Generated by Django 5.1.1 on 2024-12-27 15:10

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("circadian", "0012_alter_log_options"),
    ]

    operations = [
        migrations.RenameField(
            model_name="history",
            old_name="file_names_history",
            new_name="file_names",
        ),
        migrations.RenameField(
            model_name="history",
            old_name="file_types_history",
            new_name="file_types",
        ),
        migrations.RenameField(
            model_name="history",
            old_name="file_urls_history",
            new_name="file_urls",
        ),
        migrations.RenameField(
            model_name="history",
            old_name="memo_history",
            new_name="memo",
        ),
        migrations.RenameField(
            model_name="history",
            old_name="progress_history",
            new_name="progress",
        ),
        migrations.RenameField(
            model_name="history",
            old_name="text_history",
            new_name="text",
        ),
        migrations.RenameField(
            model_name="history",
            old_name="todos_history",
            new_name="todos",
        ),
    ]