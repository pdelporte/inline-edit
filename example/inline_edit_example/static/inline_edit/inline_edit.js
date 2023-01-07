/*
Javascript of inline-edit
Author : Pierre Delporte
email : pierre.delporte@alf-solution.be
date : 05/01/2023
Version : 0.1.0
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
            value = Number(value.replace(',', '.'))
        }
        $(this).html("");
        switch (data_type) {
            case "number":
            case "text":
            case "date":
            case "checkbox":
                var input = document.createElement("input");
                input.type = $(this).data("type");
                break;
            case "select":
                var input = document.createElement("select");
                break;
        }
        input.addEventListener("focusout", function () {
            upd(this);
        });
        input.classList.add("form-control");
        input.setAttribute("id", "input_cell");
        input.setAttribute("value", value);
        input.setAttribute("data-initial", value);
        input.setAttribute("data-type", $(this).data("type"));

        switch (data_type) {
            case "number":
                input.classList.add("text-end"); // set the CSS class
                input.setAttribute("step", "any");
                break;
            case "checkbox":
                input.setAttribute("role", "switch");
                input.classList.add("form-check-input"); // set the CSS class
                if (value == "1")
                    input.setAttribute("checked", "checked");
                var div = document.createElement("div");
                div.classList.add("form-check"); // set the CSS class
                div.appendChild(input);
                input = div;
                break;
            case "text":
                break;
            case "select":
                const request = new XMLHttpRequest();
                const url = $(this).data("url");
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
                break;
        }
        $(this).get(0).appendChild(input); // put it into the DOM
        console.log($(this).html());
        $("#input_cell").focus();
    });
});

function upd(obj) {
    var elm = $(obj);
    var parent = $(elm).parent();
    var value = $(elm).val();
    switch ($(elm).data("type")) {
        case "checkbox":
            if (obj.checked) {
                value = 1;
            } else {
                value = 0;
            }
            parent = $(parent).parent();
            break;
    }

    if (elm.data("initial") !== value) {
        $.post('/update/data/', {'id': parent.data("id"), 'model': parent.data("model"), 'elem': parent.data("name"), 'value': value, 'data_type': parent.data("type")}, function (data, status) {
            if (data['result'] == "success") {
                parent.html(data['label']);
                $(parent).data("value", value);
            }
        });
    } else {
        parent.html(elm.data("initial"));
    }
};