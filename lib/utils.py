from django.contrib.auth.decorators import login_required
from django.apps import apps
from django.http import JsonResponse
from django.utils.translation import gettext as _

from datetime import datetime


@login_required
def upd_data(request):
    """
    This is the function used to update the information into your database
    This function must be called as POST with the following parameters
    id : the unique identifier of the record containing the field to be updated
    elem : composed of the Django app_name, model_name and field_name join by a "."
    value : the new value of the field to be updated
    data_type : the type of field modified
    """
    rc = {}

    id = request.POST.get("id")
    app_name, model_name, elem = request.POST.get("elem").split('.')
    value = request.POST.get("value", None)
    data_type = request.POST.get("data_type")
    if value == "":
        value = None

    MyModel = apps.get_model(app_name, model_name)

    data = MyModel.objects.filter(id=id).first()
    if data is None:
        rc['result'] = 'failed'
        rc['message'] = 'invalid client'
    else:
        try:
            data.__setattr__(elem, value)
            data.save(update_fields=[elem])
            if data_type == "checkbox":
                if value == "1":
                    label = _("Yes")
                else:
                    label = _("No")
            elif data_type == "date":
                field = getattr(data, elem, None)
                if field is not None:
                    label = datetime.strptime(field, '%Y-%m-%d').strftime('%d/%m/%Y')
            elif data_type == "select":
                ref = getattr(data, elem.replace('_id', ''), None)
                if ref is not None:
                    label = ref.name
                else:
                    label = value
            else:
                label = value
            rc['result'] = "success"
            rc['id'] = id
            rc['data_type'] = data_type
            rc['value'] = value
            rc['label'] = label
        except:
            rc['result'] = 'failed'
            rc['message'] = 'Invalid attribute'
            rc['elem'] = request.POST.get("elem")
            rc['value'] = value
    return JsonResponse(rc)