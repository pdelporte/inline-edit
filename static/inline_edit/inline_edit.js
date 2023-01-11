/*
Javascript of inline-edit
Author : Pierre Delporte
email : pierre.delporte@alf-solution.be
creation date : 05/01/2023
last update date : 09/01/2023
Version : 0.3.0
License : MIT Copyright (c) 2023 Pierre Delporte

Add the follow line in your main html file at the end of <body> section
<script src="/static/inline_edit/inline_edit.js"></script>
*/

$(document).ready(function () {
    $(".inline-edit").dblclick(function () {
        const data_type = $(this).data("type");
        var value = String($(this).data("value"));
        const decimal_comma = value.indexOf(",");
        if (data_type == "number" && decimal_comma !== -1) {
            value = Number(value.replace(',', '.'));
        }

        var btn_validate = document.createElement('button');
        btn_validate.classList.add("btn");
        btn_validate.classList.add("btn-outline-primary");
        btn_validate.classList.add("btn-sm");
        btn_validate.innerHTML = "<i class='bi bi-check'></i>";
        btn_validate.addEventListener("click", function () {
            upd(document.getElementById("input_cell"));
        });
        var btn_cancel = document.createElement('button');
        btn_cancel.classList.add("btn");
        btn_cancel.classList.add("btn-outline-danger");
        btn_cancel.classList.add("btn-sm");
        btn_cancel.innerHTML = "<i class='bi bi-x'></i>";
        btn_cancel.addEventListener("click", function () {
            cancel_upd(this.parentElement.parentElement);
        });

        $(this).html("");
        var input = null;
        switch (data_type) {
            case "number":
            case "text":
            case "date":
            case "radio":
                input = document.createElement("input");
                input.type = $(this).data("type");
                input.classList.add("form-control");
                break;
            case "checkbox":
                input = document.createElement("input");
                input.type = $(this).data("type");
                input.classList.add("form-check-input"); // set the CSS class
                break;
            case "select":
                input = document.createElement("select");
                input.classList.add("form-select");
                break;
            case "textarea":
                input = document.createElement("textarea");
                input.classList.add("form-control");
                break;
        }

        input.setAttribute("id", "input_cell");
        input.setAttribute("value", value);
        input.setAttribute("data-initial", value);
        input.setAttribute("data-type", data_type);

        switch (data_type) {
            case "number":
                input.classList.add("text-end"); // set the CSS class
                input.setAttribute("step", "any");
                var div = document.createElement("div");
                div.classList.add("input-group");
                div.appendChild(input);

                div.appendChild(btn_validate);
                div.appendChild(btn_cancel);
                input = div;
                break;
            case "checkbox":
                input.setAttribute("role", "switch");
                if (value === "1") {
                    input.setAttribute("checked", "checked");
                }
                input.setAttribute("data-label-checked", $(this).data("label-checked"));
                input.setAttribute("data-label-unchecked", $(this).data("label-unchecked"));
                var div = document.createElement("div");
                div.classList.add("form-check"); // set the CSS class
                div.classList.add("form-switch"); // set the CSS class
                div.appendChild(input);
                var label = document.createElement('label');
                label.htmlFor = "input_cell";
                label.appendChild(document.createTextNode($(this).data("label-checked")));
                label.classList.add("form-check-label");
                div.appendChild(label);

                div.appendChild(btn_validate);
                div.appendChild(btn_cancel);

                input = div;
                break;
            case "text":
                var div = document.createElement("div");
                div.classList.add("input-group");
                div.appendChild(input);

                div.appendChild(btn_validate);
                div.appendChild(btn_cancel);
                input = div;
                break;
            case "textarea":
                input.removeAttribute('value');
                input.value = value;
                // input.addEventListener("focusout", function () {
                //     upd(this);
                // });
                var div = document.createElement("div");
                div.classList.add("input-group");
                div.appendChild(input);

                div.appendChild(btn_validate);
                div.appendChild(btn_cancel);
                input = div;
                break;
            case "select":
                var request = new XMLHttpRequest();
                var url = $(this).data("url");
                request.open('GET', url, false);  // `false` makes the request synchronous
                request.setRequestHeader("Authorization", api_token);
                request.send(null);

                // Get the options
                if (request.status === 200) {
                    const options = eval(request.responseText);
                    options.forEach((element, key) => {
                        const selected = (element.id == value);
                        input.add(new Option(element.name, element.id, selected, selected));
                    });
                }
                var div = document.createElement("div");
                div.classList.add("input-group"); // set the CSS class
                div.appendChild(input);

                div.appendChild(btn_validate);
                div.appendChild(btn_cancel);

                input = div;
                break;
            case "radio":
                var request = new XMLHttpRequest();
                var url = $(this).data("url");
                request.open('GET', url, false);  // `false` makes the request synchronous
                request.setRequestHeader("Authorization", api_token);
                request.send(null);

                // Get the options
                if (request.status === 200) {
                    const options = eval(request.responseText);
                    var parent = $(this).parent();
                    options.forEach((element, key) => {
                        var checkbox = document.createElement('input');
                        checkbox.type = "radio";
                        checkbox.name = "input_cell";
                        checkbox.value = element.id;
                        checkbox.id = "input_cell" + element.id;
                        if (element.id == value){
                            checkbox.checked = "checked";
                        };
                        checkbox.classList.add("form-check-input");
                        checkbox.setAttribute("data-initial", value);
                        checkbox.setAttribute("data-label", element.name);
                        checkbox.setAttribute("data-type", $(this).data("type"));

                        var label = document.createElement('label');
                        label.htmlFor = "input_cell" + element.id;
                        // label.for = "input_cell" + element.id;
                        label.appendChild(document.createTextNode(element.name));
                        label.classList.add("form-check-label");

                        $(this).get(0).appendChild(checkbox);
                        $(this).get(0).appendChild(label);
                    });

                    btn_validate.addEventListener("click", function () {
                        upd(document.querySelector("input[name=input_cell]:checked"));
                    });
                    $(this).get(0).appendChild(btn_validate);

                    btn_cancel.addEventListener("click", function () {
                        cancel_upd(this.parentElement);
                    });
                    $(this).get(0).appendChild(btn_cancel);
                }
                break;
            case 'date':
                var div = document.createElement("div");
                div.classList.add("input-group"); // set the CSS class
                div.appendChild(input);

                div.appendChild(btn_validate);
                div.appendChild(btn_cancel);

                input = div;
                break;
        }
        if (data_type != 'radio')
            $(this).get(0).appendChild(input); // put it into the DOM
        $("#input_cell").focus();
    });
});

function upd(obj) {
    var elm = $(obj);
    var parent = $(elm).parent();
    var value = $(elm).val();
    var label = value;
    switch ($(elm).data("type")) {
        case "select":
        case "text":
        case "textarea":
        case "date":
        case "number":
            parent = $(parent).parent();
            break;
        case "checkbox":
            if (obj.checked) {
                value = 1;
                label = obj.getAttribute('data-label-checked');
            } else {
                value = 0;
                label = obj.getAttribute('data-label-unchecked');
            }
            parent = $(parent).parent();
            break;
        case "radio":
            var element = document.querySelector("input[name='input_cell']:checked");
            value = element.value;
            label = element.getAttribute("data-label");
            break;
    }

    if (elm.data("initial") !== value) {
        $.post('/update/data/', {'id': parent.data("id"), 'model': parent.data("model"), 'elem': parent.data("name"), 'value': value, 'data_type': parent.data("type"), 'label': label}, function (data, status) {
            if (data['result'] == "success") {
                parent.html(data['label']);
                $(parent).data("value", value);
            }
        });
    } else {
        cancel_upd(obj.parentElement.parentElement);
    }
};

function cancel_upd(obj){
    var data_type = $(obj).data("type");
    switch (data_type) {
        case 'checkbox':
            if ($(obj).data("value") == 1)
                $(obj).html($(obj).data("label-checked"));
            else
                $(obj).html($(obj).data("label-unchecked"));
            break;
        case 'text':
        case 'number':
            $(obj).html($(obj).data("value"));
            break;
        case 'textarea':
            $(obj).html($(obj).data("value").replace(/\n/g, "<br />"));
            break;
        default:
            $(obj).html($(obj).data("label"));
            break;
    }
}