# htmx-ext-shoelace

An extension to make [Shoelace](https://shoelace.style/) elements work seamlessly (as possible) with htmx.

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

## TypeError: Cannot read properties of null (reading 'focus')

If you're experiencing this error, the solution is to change this [line in htmx](https://github.com/bigskysoftware/htmx/blob/66387c04221b257b9cfa858db2636e6dd3c6fda7/src/htmx.js#L3386C37-L3386C37) to:

```
// Temporary Shoelace+htmx fix
try {
	newActiveElt.focus(focusOptions);
} catch (error) {
	console.warn('Error when executing newActiveElt.focus(focusOptions);')
	console.warn(error)
}
```

A little more discussion on the topic is here https://github.com/shoelace-style/shoelace/discussions/866#discussion-4321444
