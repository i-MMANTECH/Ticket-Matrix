# Emmanuel Aro's project submission for evaluation.
from django.contrib import admin

from .models import Comment, Ticket


class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0
    readonly_fields = ("created_at",)


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("reference", "subject", "customer", "priority", "status", "created_at")
    list_filter = ("status", "priority", "category")
    search_fields = ("reference", "subject", "description", "customer__name", "customer__email")
    readonly_fields = ("reference", "created_at", "updated_at")
    inlines = [CommentInline]
    ordering = ("-created_at",)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("ticket", "author_name", "created_at")
    search_fields = ("ticket__reference", "author_name", "content")
    readonly_fields = ("created_at",)
