# htmx-ext-shoelace

An extension to make [Shoelace](https://shoelace.style/) elements work even more seamlessly with htmx.

## Features

 1. Include `sl-rating` values. These are ignored by htmx as Shoelace doesn't implement the `name` attribute for `sl-rating` - and a name is needed for the formData key.
 2. Includes an `sl-radio-group` value only if it has a value set
 3. Prevents form submission if the form is not valid (e.g. a required field has no value)

## Usage

1. Import htmx and the extension

```
<script src="htmx.js"></script>
<script src="htmx.ext.shoelace.js"></script>
```

2. Add "shoelace" to the `hx-ext` parameter on a `form` or `body` tag. Adding it to the body tag will make **all** forms in the page include the values of Shoelace elements within them.

```
<body hx-ext="shoelace">
```

3. Don't forget to add a `name` attribute to your Shoelace elements 🤦

