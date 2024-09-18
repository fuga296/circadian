from django.contrib import admin
from .models import User, Diary, History, Log

# Register your models here.
admin.site.register(User)
admin.site.register(Diary)
admin.site.register(History)
admin.site.register(Log)