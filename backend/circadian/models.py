from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, Group, Permission, PermissionsMixin
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MinLengthValidator, EmailValidator
from django.db import models
import uuid

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password):
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

    def create_superuser(self, email, username, password):
        if not email:
            raise ValueError('ユーザーにはメールアドレスが必要です')
        if not username:
            raise ValueError('ユーザーにはユーザー名が必要です')
        if not password:
            raise ValueError('パスワードが必要です')

        user = self.create_user(email, username, password)
        user.is_admin = True
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=63, unique=True, validators=[MinLengthValidator(3)])
    email = models.EmailField(max_length=63, unique=True, validators=[EmailValidator()])
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
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
    diary_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='diaries')
    date = models.DateField()
    text = models.TextField(blank=True)
    progress = models.TextField(blank=True)
    memo = models.TextField(blank=True)
    todos = ArrayField(
        models.CharField(max_length=255),
        blank=True,
        default=list,
    )
    file_names = ArrayField(
        models.CharField(max_length=255),
        blank=True,
        default=list,
    )
    file_types = ArrayField(
        models.CharField(max_length=255),
        blank=True,
        default=list,
    )
    file_urls = ArrayField(
        models.URLField(max_length=255),
        blank=True,
        default=list,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    front_id = models.UUIDField(default=uuid.uuid4, editable=False)

    class Meta:
        indexes = [
            models.Index(fields=['date']),
            models.Index(fields=['user', 'date']),
        ]
        unique_together = ('user', 'date')
        ordering = ['-date']
        verbose_name = 'diary'
        verbose_name_plural = 'diaries'

    def __str__(self):
        return f"{self.user.username}の日記 - {self.date}"

class History(models.Model):
    ACTION_CHOICES = [
        ('CREATE', 'Create'),
        ('EDIT', 'Edit'),
        ('DELETE', 'Delete'),
    ]

    history_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    diary = models.ForeignKey(Diary, on_delete=models.CASCADE, related_name='histories')
    timestamp = models.DateTimeField(auto_now_add=True)
    action = models.CharField(max_length=10, choices=ACTION_CHOICES, default='CREATE')
    text = models.TextField(blank=True)
    progress = models.TextField(blank=True)
    memo = models.TextField(blank=True)
    todos = ArrayField(
        models.CharField(max_length=255),
        blank=True,
        default=list,
    )
    file_names = ArrayField(
        models.CharField(max_length=255),
        blank=True,
        default=list,
    )
    file_types = ArrayField(
        models.CharField(max_length=255),
        blank=True,
        default=list,
    )
    file_urls = ArrayField(
        models.CharField(max_length=255),
        blank=True,
        default=list,
    )

    class Meta:
        indexes = [
            models.Index(fields=['timestamp']),
        ]
        ordering = ['-timestamp']
        verbose_name = 'history'
        verbose_name_plural = 'histories'

    def __str__(self):
        return f"{self.diary.user.username} の日記 - {self.diary.date} | {self.timestamp}"

class Log(models.Model):
    ACTION_CHOICES = [
        ('VISIT', 'Visit'),
        ('LEAVE', 'Leave'),
        ('REGISTER', 'Register'),
        ('LOGIN', 'Login'),
        ('LOGOUT', 'Logout'),
    ]

    log_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='logs')
    timestamp = models.DateTimeField(auto_now_add=True)
    action = models.CharField(max_length=10, choices=ACTION_CHOICES, default='VISIT')
    detail = models.URLField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    device_info = models.CharField(max_length=255, default="")

    class Meta:
        indexes = [
            models.Index(fields=['timestamp']),
            models.Index(fields=['user', 'timestamp']),
        ]
        ordering = ['-timestamp']
        verbose_name = 'log'
        verbose_name_plural = 'logs'

    def __str__(self):
        return f"{self.user.username} - {self.action} | {self.timestamp}"