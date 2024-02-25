const slTypes = 'sl-button, sl-checkbox, sl-color-picker, sl-input, sl-radio-group, sl-range, sl-rating, sl-select, sl-switch, sl-textarea'

/* Lightly modified version of the same function in htmx.js */
function shouldInclude(elt) {
	// sl-rating doesn't have a name attribute exposed through the Shoelace API so this check needs to come before the name==="" check
	if (elt.tagName === 'SL-RATING' && elt.getAttribute('name')) {
		return true
	}
	if (elt.name === "" || elt.name == null || elt.disabled || elt.closest("fieldset[disabled]")) {
		return false
	}
	if (elt.type === "button" || elt.type === "submit" || elt.tagName === "image" || elt.tagName === "reset" || elt.tagName === "file" )  {
		return false
	}
	if (elt.tagName === 'SL-CHECKBOX' || elt.tagName === 'SL-SWITCH') {
		return elt.checked
	}
	if (elt.tagName === "SL-RADIO-GROUP") {
		return elt.value.length > 0
	}
	return true;
}

htmx.defineExtension('shoelace', {
	onEvent : function(name, evt) {
		if ((name === "htmx:configRequest") && (evt.detail.elt.tagName === 'FORM')) {
			evt.detail.elt.querySelectorAll(slTypes).forEach((elt) => {
				if (shouldInclude(elt)) {
					if (elt.tagName === 'SL-CHECKBOX' || elt.tagName === 'SL-SWITCH') {
						// Temp Shoelace (unconfirmed) bug fix
						evt.detail.parameters[elt.name] = elt.value || 'on'

					} else if (elt.tagName == 'SL-RATING') {
						evt.detail.parameters[elt.getAttribute('name')] = elt.value

					} else {
						evt.detail.parameters[elt.name] = elt.value
					}
				}
			})
		}
	}
})