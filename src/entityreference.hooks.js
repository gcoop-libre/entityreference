/**
 * Implements hook_assemble_form_state_into_field().
 */
function entityreference_assemble_form_state_into_field(entity_type, bundle,
  form_state_value, field, instance, langcode, delta, field_key) {
  try {
    if (typeof form_state_value === 'undefined') { return null; }
    var result = null;
    switch (instance.widget.type) {
      case 'entityreference_autocomplete':
      case 'og_complex': // Adds support for the Organic Groups module.
        field_key.value = 'target_id';
        if (form_state_value == '') { result = ''; } // This allows values to be deleted.
        // @see http://drupal.stackexchange.com/a/40347/10645
        else if (!empty(form_state_value)) { result = '... (' + form_state_value + ')'; }
        break;
      case 'entityreference_autocomplete_tags':
        field_key.use_wrapper = false;
        field_key.use_delta = true;
        field_key.use_key = false;
        if (form_state_value == '') { result = ''; } // This allows values to be deleted.
        // @see http://drupal.stackexchange.com/a/40347/10645
        else if (!empty(form_state_value)) { result = '... (' + form_state_value + ')'; }
        break;
      default:
        // For the "check boxes / radio buttons" widget, we must pass something
        // like this: field_name: { und: [123, 456] }
        // @see http://drupal.stackexchange.com/q/42658/10645
        result = [];
        field_key.use_delta = false;
        field_key.use_wrapper = false;
        var ids = form_state_value.split(',');
        $.each(ids, function(delta, id) { if (!empty(id)) { result.push(id); } });
        break;
    }
    return result;
  }
  catch (error) { console.log('entityreference_assemble_form_state_into_field - ' + error); }
}

/**
 * Implements hook_views_exposed_filter().
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} element
 * @param {Object} filter
 * @param {Object} field
 */
function entityreference_views_exposed_filter(form, form_state, element, filter, field) {
  try {
    // Make a select list with the available value options.
    element.type = 'select';
    element.options = {};
    for (var index in filter.value_options) {
      if (!filter.value_options.hasOwnProperty(index)) { continue; }
      element.options[index] =  filter.value_options[index];
    }
    
    if (!element.required) {
      element.options['All'] = '- ' + t('Any') + ' -';
      if (typeof element.value === 'undefined') { element.value = 'All'; }
    }
    
    if (!empty(filter.value)) { element.value = filter.value[0]; }

    return element;
  }
  catch (error) { console.log('entityreference_views_exposed_filter - ' + error); }
}
