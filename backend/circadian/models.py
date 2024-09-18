from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, Group, Permission, PermissionsMixin
from django.core.validators import MinLengthValidator, EmailValidator
from django.db import models
import uuid
import base64

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError('ユーザーにはメールアドレスが必要です')
        if not username:
            raise ValueError('ユーザーにはユーザー名が必要です')
        if not password:
            raise ValueError('パスワードが必要です')

        email = self.normalize_email(email)
        user = self.model(email=email, username=username)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None):
        user = self.create_user(email, username, password)
        user.is_admin = True
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=64, unique=True, validators=[MinLengthValidator(3)])
    email = models.EmailField(max_length=64, unique=True, validators=[EmailValidator()])
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    last_login = models.DateTimeField(null=True, blank=True)

    groups = models.ManyToManyField(Group, related_name='custom_users', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='custom_user_permissions', blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        indexes = [
            models.Index(fields=['username']),
            models.Index(fields=['email']),
        ]
        verbose_name = 'user'
        verbose_name_plural = 'users'

    def __str__(self):
        return self.username

class Diary(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='diaries')
    date = models.DateField(db_index=True)
    main_text = models.TextField(blank=True)
    progress = models.TextField(blank=True)
    memo = models.TextField(blank=True)
    todos = models.JSONField(default=list, blank=True)
    files = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    front_id = models.UUIDField(default=uuid.uuid4, editable=False)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'date']),
        ]
        unique_together = ('user', 'date')
        ordering = ['-date']
        verbose_name = 'diary'
        verbose_name_plural = 'diaries'

    def __str__(self):
        return f"{self.user.username}の日記 - {self.date}"

    def generate_url_path(self):
        return str(uuid.uuid4())

    def save(self, *args, **kwargs):
        if self.files:
            for media in self.files:
                if isinstance(media, dict) and 'url' not in media:
                    media['url'] = self.generate_url_path()
                if 'binaryData' in media and isinstance(media['binaryData'], bytes):
                    media['binaryData'] = base64.b64encode(media['binaryData']).decode('utf-8')
        super().save(*args, **kwargs)

class History(models.Model):
    TYPE_CHOICES = [
        ('CREATE', 'Create'),
        ('EDIT', 'Edit'),
        ('DELETE', 'Delete'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    diary = models.ForeignKey(Diary, on_delete=models.CASCADE, related_name='histories')
    timestamp = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='CREATE')
    main_text_diff = models.TextField(blank=True)
    progress_diff = models.TextField(blank=True)
    memo_diff = models.TextField(blank=True)
    todos_diff = models.JSONField(default=list, blank=True)
    files_diff = models.JSONField(default=list, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['diary']),
        ]
        ordering = ['-timestamp']
        verbose_name = 'history'
        verbose_name_plural = 'histories'

    def __str__(self):
        return f"{self.diary.user.username} の {self.diary.date} の日記の履歴 - {self.timestamp}"

class Log(models.Model):
    STATUS_CHOICES = [
        ('VISIT', 'Visit'),
        ('LEAVE', 'Leave'),
        ('REGISTER', 'Register'),
        ('LOGIN', 'Login'),
        ('LOGOUT', 'Logout'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='logs')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='VISIT')
    detail = models.URLField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['timestamp']),
            models.Index(fields=['user', 'timestamp']),
        ]
        verbose_name = 'log'
        verbose_name_plural = 'logs'

    def __str__(self):
        return f"{self.user.username} - {self.get_status_display()} at {self.timestamp}"