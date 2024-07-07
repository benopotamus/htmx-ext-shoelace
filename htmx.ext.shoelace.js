const slTypes = 'sl-radio-group, sl-rating'

/* Lightly modified version of the same function in htmx.js */
function shouldInclude(elt) {

	// sl-rating doesn't have a name attribute exposed through the Shoelace API (for elt.name) so this check needs to come before the name==='' check
	if (elt.tagName === 'SL-RATING' && elt.getAttribute('name')) {
		return true
	}

	if (elt.name === '' || elt.name == null || elt.disabled || elt.closest('fieldset[disabled]')) {
		return false
	}

	if (elt.tagName === 'SL-RADIO-GROUP') {
		return elt.value.length > 0
	}

	return true;
}

htmx.defineExtension('shoelace', {
	onEvent : function(name, evt) {
		if ((name === "htmx:configRequest") && (evt.detail.elt.tagName === 'FORM')) {
			evt.detail.elt.querySelectorAll(slTypes).forEach((elt) => {
				if (shouldInclude(elt)) {
					if (elt.tagName == 'SL-RATING') {
						evt.detail.parameters[elt.getAttribute('name')] = elt.value

					} else {
						evt.detail.parameters[elt.name] = elt.value
					}
				}
			})
			// Prevent form submission if one or more fields are invalid. 
			// evt.detail.elt is always a form as per the main if statement
			if (!evt.detail.elt.checkValidity()) {
				return false
			}
		}
	}
})