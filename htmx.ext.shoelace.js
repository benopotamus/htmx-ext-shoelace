const slTypes = 'sl-checkbox, sl-color-picker, sl-input, sl-radio-group, sl-range, sl-rating, sl-select, sl-switch, sl-textarea';

/* Lightly modified version of the same function in htmx.js */
function shouldInclude(elt) {

	// sl-rating doesn't have a name attribute exposed through the Shoelace API (for elt.name) so this check needs to come before the name==="" check
	if (elt.tagName === 'SL-RATING' && elt.getAttribute('name')) {
		return true;
	}

	if (elt.name === "" || elt.name === null || elt.disabled || elt.closest("fieldset[disabled]")) {
		return false;
	}

	if (elt.tagName === 'SL-CHECKBOX' || elt.tagName === 'SL-SWITCH') {
		return elt.checked;
	}

	if (elt.tagName === "SL-RADIO-GROUP") {
		return elt.value.length > 0;
	}

	return true;
}

function queryElements(source) {
	let elements = [];
	if (source.tagName === 'FORM') {
		elements.concat(Array.from(source.querySelectorAll(slTypes)));
	}
	if (source.hasAttribute("hx-include")) {
		const includedSources = source.getAttribute("hx-include").split(",");
		// Iterate through each form ID
		includedSources.forEach(includedSource => {
			// Get all input elements within the form using querySelectorAll
			const includedSourceDOM = document.querySelector(includedSource);
			if (includedSourceDOM !== null) {
				const includedSlInputs = includedSourceDOM.querySelectorAll(slTypes);

				// Convert the NodeList to an array and concatenate it to the allInputs array
				elements = elements.concat(Array.from(includedSlInputs));
			}
		});
	}
	return elements;
}

htmx.defineExtension('shoelace', {
	onEvent : function(name, evt) {
		if (name === "htmx:configRequest") {
			const elements = queryElements(evt.detail.elt);
			elements.forEach((elt) => {
				if (shouldInclude(elt)) {
					if (elt.tagName === 'SL-CHECKBOX' || elt.tagName === 'SL-SWITCH') {
						// Shoelace normally does this bit internally when the formdata event fires, but htmx doesn't fire the formdata event, so we do it here instead. See https://github.com/shoelace-style/shoelace/issues/1891
						evt.detail.parameters[elt.name] = elt.value || 'on';

					} else if (elt.tagName === 'SL-RATING') {
						evt.detail.parameters[elt.getAttribute('name')] = elt.value;

					} else {
						evt.detail.parameters[elt.name] = elt.value;
					}
				}
			});
		}
	}
});