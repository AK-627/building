-- Normalize legacy project name references from "Lodha Mirabelle" to "Lodha Sadahalli"
-- across editable CMS/config tables.

-- About section body
UPDATE about_config
SET content = regexp_replace(content, '(?i)lodha\\s+mirab+el+e?', 'Lodha Sadahalli', 'g')
WHERE content ~* 'lodha\\s+mirab+el+e?';

-- Contact WhatsApp default/custom message
UPDATE contact_config
SET whatsapp_message = regexp_replace(whatsapp_message, '(?i)lodha\\s+mirab+el+e?', 'LODHA SADAHALLI', 'g')
WHERE whatsapp_message ~* 'lodha\\s+mirab+el+e?';

-- Location section (both human-readable address and map query URL)
UPDATE location_config
SET address = regexp_replace(address, '(?i)lodha\\s+mirab+el+e?', 'Lodha Sadahalli', 'g')
WHERE address ~* 'lodha\\s+mirab+el+e?';

UPDATE location_config
SET embed_url = regexp_replace(embed_url, '(?i)lodha(%20|\\+)+mirab+el+e?', 'Lodha%20Sadahalli', 'g')
WHERE embed_url ~* 'lodha(%20|\\+)+mirab+el+e?';
