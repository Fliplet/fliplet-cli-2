# Interface Reference

## Constructor (`Fliplet.Helper`)

Defines a new Helper for the current screen. Use the constructor in Global JS code to define it for the entire app.

#### - `public static object Fliplet.Helper(name: String, options: Object)`

```js
Fliplet.Helper(name, {
  configuration
});
```

**Parameters of the `configuration` object:**

<table style="width:100%">
  <thead>
    <th>Name</th>
    <th>Type</th>
    <th>Attribute</th>
    <th>Description</th>
  </thead>
  <tbody>
    <tr>
      <td><code>configuration.title</code></td>
      <td><code>string</code></td>
      <td>optional</td>
      <td>A title to display at the top of the configuration interface</td>
    </tr>
    <tr>
      <td><code>configuration.fields</code></td>
      <td><code>array</code></td>
      <td>required</td>
      <td><a href="http://127.0.0.1:4000/API/helpers/interface-fields.html">The list of fields to display in the UI</a>.</td>
    </tr>
  </tbody>
</table>

---