/**
 * Given settings from an entity reference field's field_info_field object, this will
 * return an array of bundle names that are used for the target when using Simple entity
 * selection mode. It will return null if there are no target bundles.
 * @param field_settings
 * @returns {*}
 */
function entityreference_get_target_bundles(field_settings) {
  try {
    var bundles = [];
    for (var bundle in field_settings.handler_settings.target_bundles) {
      if (!field_settings.handler_settings.target_bundles.hasOwnProperty(bundle)) { continue; }
      var name = field_settings.handler_settings.target_bundles[bundle];
      var bundle_info = entityreference_get_bundle_and_name_from_field_settings(bundle, field_settings);
      if (bundle_info.bundle) { bundles.push(bundle_info.bundle); }
    }
    return bundles.length ? bundles : null;
  }
  catch (error) { console.log('entityreference_get_target_bundles - ' + error); }
}

function entityreference_get_bundle_and_name_from_field_settings(target_bundle, field_settings) {
  var result = {
    bundle_name: null,
    bundle: null
  };
  switch (field_settings.target_type) {
    case 'node':
      result.bundle_name = 'type';
        result.bundle = target_bundle;
      break;
    case 'taxonomy_term':
      result.bundle_name = 'vid';
      result.bundle = taxonomy_vocabulary_get_vid_from_name(target_bundle);
      break;
  }
  return result;
}
