---
description: Customize your component to localize to different languages and regions.
---

# Localization

The `Fliplet.Locale` JS API and Fliplet's localization framework allow you to customize your component to different languages and regions.

<p class="quote"><strong>Early preview</strong>: this feature is currently in internal preview and it's not available to all our customers yet. Please get in touch with us if you want to learn more.</p>

There are 3 key aspects of a component that can be localized to the device or browser language/region settings.

- String translation
- Date format
- Number format

## String translation

Components can now define a `translation.json` file in their root to list out all keys and default English translation value.

* Keys can be nested
* Plurals and placeholders are expected to use the i18n notation


```json
{
  "widgets": {
    "form": {
      "submitButton": {
        "label": "Submit"
      },
      "required": {
        "label": "apple"
      },
      "errors": {
        "required": "There are {{n}} fields that need to be filled in",
        "offline": "You need to be online to submit this form."
      },
      "success": {
        "message": "{{- msg}}"
      }
    }
  }
}
```

A new JS API and global functions wrapping [i18next](https://www.i18next.com/translation-function/formatting) will be made available to JavaScript and client-side Handlebars.

**JS API**

```js
Fliplet.Locale.translate("widgets.form.required.label");
Fliplet.Locale.translate("widgets.form.errors.required", { n: 3 });

// Use the T() shorthand function instead
T("widgets.form.success.message", { msg: "<img..>" });
```

**Handlebars**

{% raw %}
```html
{{ T "widgets.form.success.message" }}
```
{% endraw %}

### Localization helper libraries and frameworks

**jQuery**

Components can use `$(this).translate()` (e.g. in `Fliplet.Widget.instance()`) after having initialized their template to automatically bind `data-translate="key"` properties in the target element.

More docs on [https://github.com/i18next/jquery-i18next](https://github.com/i18next/jquery-i18next).

**Handlebars**

Client-side Handlebars templates can use the `{{ T }}` helper to print translations.

{% raw %}
```js
Handlebars.compile("{{ T "widgets.form.errors.required" n=3 }}")()
```
{% endraw %}

More docs on [https://github.com/UUDigitalHumanitieslab/handlebars-i18next](https://github.com/UUDigitalHumanitieslab/handlebars-i18next)

**Vue.js**

Vue can optionally bind the i18n helper for Vue (returned by `Fliplet.Locale.plugins.vue()`) on initialization:

```js
var $form = new Vue({ i18n: Fliplet.Locale.plugins.vue() });
```

Then, strings can be translated using the $t helper in vue templates in build.html or Vue templates in general:

{% raw %}
```html
{{ $t("widgets.form.required.label") }}
```
{% endraw %}


More docs on [https://panter.github.io/vue-i18next/guide/component-interpolation.html](https://panter.github.io/vue-i18next/guide/component-interpolation.html)


## Date format

Powered by Moment.js, the number localization API can help you localize numbers to the language/regional preference.

**JS API**

```js
Fliplet.Locale.date(value, options)
TD(value, options)
```

**Handlebars helpers**

{% raw %}
```html
{{ TD value [options] }}
```
{% endraw %}

**Parameters**

* `value` {*} The date or time value to be used for formatting. The input type can be a `Moment` object, `Date` object or a string. Strings must be formatted as `YYYY-MM-DD` for dates and `HH:mm` (24-hour time) for times.
* `options` {Object} A map of options
* `options.format` {String} The formatting to be used. See [Moment documentation](https://github.com/moment/momentjs.com/blob/master/docs/moment/07-customization/06-long-date-formats.md) for the supported locale formats, e.g. `LL` for long form localized dates or `LT` for localized time without seconds.
* `options.locale` {String} (Optional) Use a specific locale for the formatting. Default: device/browser language settings or `en` when that's not found or valid.

Supported formats

**Examples**

{% raw %}
```js
Fliplet.Locale.date('2021-03-04', { format: 'LL' }) // 4 March 2021 (UK) 4 marzo 2021 (IT) or 4 mars 2021 (FR)
Fliplet.Locale.date('2021-03-04', { format: 'LL', locale: 'en-US' }) // March 4, 2021
Fliplet.Locale.date('14:23', { format: 'LT' }) // 14:23 (UK) 2:23 PM (US) 下午2點23分 (ZH-TW)
Fliplet.Locale.date('14:23', { format: 'LT', locale: 'en-US' }) // 2:23 PM

Handlebars.compile('{{ TD foo format="LL" }}')({ foo: '2021-03-04' }) // 4 March 2021 (UK) 4 marzo 2021 (IT) or 4 mars 2021 (FR)
Handlebars.compile('{{ TD foo format="LL" locale="en-US" }}')({ foo: '2021-03-04' }) // March 4, 2021
Handlebars.compile('{{ TD foo format="LT" }}')({ foo: '14:23' }) // 14:23 (UK) 2:23 PM (US) 下午2點23分 (ZH-TW)
Handlebars.compile('{{ TD foo format="LT" locale="en-US" }}')({ foo: '14:23' }) // 2:23 PM
```
{% endraw %}

## Number format

Powered by `Intl.NumberFormat()`, the number localization API can help you localize numbers to the language/regional preference.

**JS API**

```js
Fliplet.Locale.number(value, options)
TN(value, options)
```

**Handlebars helpers**

{% raw %}
```html
{{ TN value [options] }}
```
{% endraw %}

**Parameters**

* `value` {*} The value to be used for formatting. Numbers are preferred. Other types of input will be parsed to determine its numerical value.
* `options` {Object} A map of options. See [`Intl.NumberFormat()` documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) for the supported options.

**Examples**

{% raw %}
```js
Fliplet.Locale.number(1234) // 1,234 (UK) 1.234 (IT) or 1 234 (FR)
Fliplet.Locale.number(1234, { locale: 'en-US' }) // 1,234
Fliplet.Locale.number(1234, { minimumFractionDigits: 2 }) // 1,234.00 (UK) 1.234,00 (IT) or 1 234,00 (FR)
Fliplet.Locale.number(1234, { minimumFractionDigits: 2, useGrouping: false }) // 1234.00 (UK) 1234,00 (IT) or 1234,00 (FR)

Handlebars.compile('{{ TN foo }}')({ foo: 1234 }) // 1,234 (UK) 1.234 (IT) or 1 234 (FR)
Handlebars.compile('{{ TN foo locale="en-US" }}')({ foo: 1234 }) // 1,234
Handlebars.compile('{{ TN foo minimumFractionDigits=2 }}')({ foo: 1234 }) // 1,234.00 (UK) 1.234,00 (IT) or 1 234,00 (FR)
Handlebars.compile('{{ TN foo minimumFractionDigits=2 useGrouping=false }}')({ foo: 1234 }) // 1234.00 (UK) 1234,00 (IT) or 1234,00 (FR)
```
{% endraw %}

---

[Back to API documentation](../API-Documentation.md)
{: .buttons}