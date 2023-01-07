from django.template import Library
from django.utils.translation import gettext as _

register = Library()


@register.filter(name='YesNo')
def yes_no(value):
    if value:
        return _('Yes')
    else:
        return _('No')
