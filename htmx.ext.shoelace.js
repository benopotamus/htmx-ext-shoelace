// htmx 2.x now uses the formdata event - which Shoelace fires - so only these 2 Shoelace components need to be specially handled now
const slTypes = 'sl-radio-group, sl-rating'

/* Lightly modified version of the same function in htmx.js */
function shouldInclude(elt) {

	// sl-rating doesn't have a name attribute exposed through the Shoelace API (for elt.name) so this check needs to come before the name==='' check
	if (elt.tagName === 'SL-RATING' && elt.getAttribute('name')) {
		return true
	}

	// Don't include disabled fields (or fields in disabled fieldsets) or fields without names
	if (elt.name === '' || elt.name == null || elt.disabled || elt.closest('fieldset[disabled]')) {
		return false
	}

	// Don't include sl-radio-group value if no option is selected - see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio#data_representation_of_a_radio_group
	if (elt.tagName === 'SL-RADIO-GROUP') {
		return elt.value.length > 0
	}

	return true;
}

htmx.defineExtension('shoelace', {
	init: function () {
		document.body.addEventListener(
			"click",
			(e) => {
				let target = e.target.closest(
					"sl-button[href], sl-icon-button[href], sl-breadcrumb-item[href]"
				);

				if (
					target &&
					target.hasAttribute("href") &&
					target.target !== "_blank" && // Match native behavior excluding _blank targets
					(!target.hostname || target.hostname === window.location.hostname)
				) {
					let isBoosted = target.closest("[hx-boost], [data-hx-boost]");
					if (!isBoosted) {
					  return;
					}
		  
					// Only handle local links
					e.preventDefault();
					e.stopPropagation();

					const href = target.getAttribute("href");
					if (!target.hasAttribute("hx-push-url")) {
						target.setAttribute("hx-push-url", "true");
					}

					htmx.ajax("GET", href, {
						source: target,
						event: e,
						headers: {
							"HX-Boost": "true",
						},
					});
				}
			},
			true // enable only in capture phase
		);
	},
	onEvent: function (name, evt) {
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