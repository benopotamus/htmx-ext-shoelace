const slTypes = 'sl-button, sl-checkbox, sl-color-picker, sl-input, sl-radio-group, sl-range, sl-rating, sl-select, sl-switch, sl-textarea'

/* Lightly modified version of the same function in htmx.js */
function shouldInclude(elt) {

	// sl-rating doesn't have a name attribute exposed through the Shoelace API
	if (elt.tagName == 'SL-RATING' && elt.getAttribute('name')) {
		return true;
	}
	if (elt.name === "" || elt.name == null || elt.disabled) {
		return false;
	}
	if (elt.type === "submit") {
		return false;
	}
	if (elt.tagName === 'SL-CHECKBOX' || elt.tagName === 'SL-SWITCH') {
		return elt.checked;
	}
	return true;
}

function addParameter(parameters, elt) {
    if (elt.tagName === 'SL-CHECKBOX' || elt.tagName === 'SL-SWITCH') {
        parameters[elt.name] = elt.checked;
    } else if (elt.tagName == 'SL-RATING') {
        parameters[elt.getAttribute('name')] = elt.value;
    } else {
        parameters[elt.name] = elt.value;
    }
}

function includeAllParameters(elt) {
    let parameters = {};
    elt.querySelectorAll(slTypes).forEach((elt) => {
        if (shouldInclude(elt)) {
            addParameter(parameters, elt);
        }
    });
    return parameters;
}

function excludeParameters(elt, excludedParams) {
    let parameters = {};
    elt.querySelectorAll(slTypes).forEach((elt) => {
        if (shouldInclude(elt) && !excludedParams.includes(elt.name)) {
            addParameter(parameters, elt);
        }
    });
    return parameters;
}

function includeParameters(elt, includedParams) {
    let parameters = {};
    elt.querySelectorAll(slTypes).forEach((elt) => {
        if (shouldInclude(elt) && includedParams.includes(elt.name)) {
            addParameter(parameters, elt);
        }
    });
    return parameters;
}



htmx.defineExtension('shoelace', {
    onEvent : function(name, evt) {
        if ((name !== "htmx:configRequest") && (evt.detail.elt.tagName != 'FORM')) {
			return
		}

		let parameters = {};
		let hxParams = evt.detail.elt.getAttribute('hx-params');

		if (!hxParams || hxParams === "*") {
			parameters = includeAllParameters(evt.detail.elt);
		} else if (hxParams === "none") {
			parameters = {}
		} else if (hxParams.startsWith("not ")) {
			let excludedParams = hxParams.substr(4).split(",");
			parameters = excludeParameters(evt.detail.elt, excludedParams);
		} else {
			let includedParams = hxParams.split(",");
			parameters = includeParameters(evt.detail.elt, includedParams);
		}
		evt.detail.parameters = parameters;
    }
});