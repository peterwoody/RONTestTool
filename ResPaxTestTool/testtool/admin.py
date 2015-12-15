from django.contrib import admin
from models import AddOperator

# Register your models here.


class SignUpAdmin(admin.ModelAdmin):
    list_display = ["__unicode__", "timestamp", "updated"]

    class Meta:
        model = AddOperator

admin.site.register(AddOperator)
