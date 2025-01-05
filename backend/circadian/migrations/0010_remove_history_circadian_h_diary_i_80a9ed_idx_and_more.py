# Generated by Django 5.1.1 on 2024-12-24 04:54

import django.contrib.postgres.fields
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("circadian", "0009_remove_filediff_history_diary_files_and_more"),
    ]

    operations = [
        migrations.RemoveIndex(
            model_name="history",
            name="circadian_h_diary_i_80a9ed_idx",
        ),
        migrations.RemoveIndex(
            model_name="log",
            name="circadian_l_user_id_df7c0a_idx",
        ),
        migrations.RenameField(
            model_name="diary",
            old_name="id",
            new_name="diary_id",
        ),
        migrations.RenameField(
            model_name="diary",
            old_name="main_text",
            new_name="text",
        ),
        migrations.RenameField(
            model_name="history",
            old_name="id",
            new_name="diary_history_id",
        ),
        migrations.RenameField(
            model_name="history",
            old_name="memo_diff",
            new_name="memo_history",
        ),
        migrations.RenameField(
            model_name="history",
            old_name="progress_diff",
            new_name="progress_history",
        ),
        migrations.RenameField(
            model_name="history",
            old_name="main_text_diff",
            new_name="text_history",
        ),
        migrations.RenameField(
            model_name="log",
            old_name="status",
            new_name="action",
        ),
        migrations.RenameField(
            model_name="log",
            old_name="id",
            new_name="log_id",
        ),
        migrations.RenameField(
            model_name="user",
            old_name="id",
            new_name="user_id",
        ),
        migrations.RemoveField(
            model_name="diary",
            name="files",
        ),
        migrations.RemoveField(
            model_name="diary",
            name="todos",
        ),
        migrations.RemoveField(
            model_name="history",
            name="files_diff",
        ),
        migrations.RemoveField(
            model_name="history",
            name="todos_diff",
        ),
        migrations.AddField(
            model_name="diary",
            name="file_names",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.CharField(max_length=255),
                blank=True,
                default=list,
                size=None,
            ),
        ),
        migrations.AddField(
            model_name="diary",
            name="file_types",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.CharField(max_length=255),
                blank=True,
                default=list,
                size=None,
            ),
        ),
        migrations.AddField(
            model_name="diary",
            name="file_urls",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.URLField(max_length=255),
                blank=True,
                default=list,
                size=None,
            ),
        ),
        migrations.AddField(
            model_name="diary",
            name="todos",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.CharField(max_length=255),
                blank=True,
                default=list,
                size=None,
            ),
        ),
        migrations.AddField(
            model_name="history",
            name="file_names_history",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.CharField(max_length=255),
                blank=True,
                default=list,
                size=None,
            ),
        ),
        migrations.AddField(
            model_name="history",
            name="file_types_history",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.CharField(max_length=255),
                blank=True,
                default=list,
                size=None,
            ),
        ),
        migrations.AddField(
            model_name="history",
            name="file_urls_history",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.CharField(max_length=255),
                blank=True,
                default=list,
                size=None,
            ),
        ),
        migrations.AddField(
            model_name="history",
            name="todos_history",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.CharField(max_length=255),
                blank=True,
                default=list,
                size=None,
            ),
        ),
        migrations.AddField(
            model_name="log",
            name="device_info",
            field=models.CharField(default="", max_length=255),
        ),
        migrations.AlterField(
            model_name="diary",
            name="date",
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name="log",
            name="timestamp",
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name="user",
            name="email",
            field=models.EmailField(
                max_length=63,
                unique=True,
                validators=[django.core.validators.EmailValidator()],
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="username",
            field=models.CharField(
                max_length=63,
                unique=True,
                validators=[django.core.validators.MinLengthValidator(3)],
            ),
        ),
        migrations.AddIndex(
            model_name="diary",
            index=models.Index(fields=["date"], name="circadian_d_date_c9a02f_idx"),
        ),
        migrations.AddIndex(
            model_name="history",
            index=models.Index(
                fields=["timestamp"], name="circadian_h_timesta_6eec3c_idx"
            ),
        ),
    ]
