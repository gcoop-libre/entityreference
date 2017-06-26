/**
 * Implements hook_field_widget_form().
 */
function entityreference_field_widget_form(form, form_state, field, instance, langcode, items, delta, element) {
  try {
    // Build the widget based on the type (we only support auto complete for
    // now).
    switch (instance.widget.type) {
      case 'entityreference_autocomplete':
      case 'entityreference_autocomplete_tags':
      case 'og_complex': // Adds support for the Organic Groups module.
        // Set up the autocomplete.
        var key_title = entity_primary_key_title(field.settings.target_type);
        items[delta].type = 'autocomplete';
        items[delta].delta = delta;
        items[delta].remote = true;
        items[delta].value = entity_primary_key(field.settings.target_type);
        items[delta].label = key_title;
        items[delta].filter = key_title;
        items[delta].path = entityreference_autocomplete_path(field, items[delta]);

        // Set any existing item values.
        if (items[delta].item && items[delta].item.target_id) {
          items[delta].default_value = items[delta].item.target_id;
          items[delta].default_value_label = items[delta].item[key_title];
        }

        break;
      default:
        console.log('entityreference_field_widget_form - unknown widget type (' + instance.widget.type + ')');
        break;
    }
  }
  catch (error) {
    console.log('entityreference_field_widget_form - ' + error);
  }
}

/**
 * Implements hook_field_formatter_view().
 */
function entityreference_field_formatter_view(entity_type, entity, field, instance, langcode, items, display) {
  try {
    var element = {};
    $.each(items, function(delta, item) {
        switch (display.type) {
          // Label
          case 'entityreference_label':
            var text = item[entity_primary_key_title(item['entity_type'])];
            if (display.settings.link == 1) { // Display as link.
              var prefix = item['entity_type'];
              if (in_array(prefix, ['taxonomy_term', 'taxonomy_vocabulary'])) {
                prefix = prefix.replace('_', '/');
              }
              element[delta] = {
                theme: 'button_link',
                text: text,
                path: prefix + '/' + item['target_id']
              };
            }
            else { // Display as plain text.
              element[delta] = { markup: '<div>' + text + '</div>' };
            }
            break;

          // Entity id
          case 'entityreference_entity_id':
            element[delta] = { markup: '<div>' + item.target_id + '</div>' };
            break;

          // Rendered entity
          case 'entityreference_entity_view':
            drupalgap_entity_render_content(item.entity_type, item.entity);
            element[delta] = { markup: item.entity.content };
            break;

          default:
            console.log('entityreference_field_formatter_view - unsupported type: ' + display.type);
            break;
        }
    });
    return element;
  }
  catch (error) {
    console.log('entityreference_field_formatter_view - ' + error);
  }
}
