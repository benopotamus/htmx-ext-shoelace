# htmx-ext-shoelace

An extension to make [Shoelace](https://shoelace.style/) elements work seamlessly (as possible) with HTMX.

## Usage

1. Import HTMX and the extension

```
<script src="htmx.js"></script>
<script src="htmx.ext.shoelace.js"></script>
```

2. Add "shoelace" to the `hx-ext` parameter on a `form` or `body` tag. Adding it to the body tag will make **all** forms in the page include the values of Shoelace elements within them.

```
<body hx-ext="shoelace">
```

3. Don't forget to add a `name` attribute to your Shoelace elements 🤦

## TODO

1. add support for https://htmx.org/attributes/hx-params/
1. all the fancy validation stuff in htmx.js processInputValue() ?

## And now, a poem
![image](https://user-images.githubusercontent.com/3161149/205877493-5ad681cc-c3be-4704-b41f-9c519a14a34d.png)
