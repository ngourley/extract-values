(function() {

	var extractValues = function(str, pattern, options) {
		options = options || {};
		var delimiters = options.delimiters || ["{", "}"];
		var lowercase = options.lowercase;
		var whitespace = options.whitespace;

		var special_chars_regex = /[\\\^\$\*\+\.\?\(\)]/g;
		var token_regex = new RegExp( delimiters[0] + "([^" + delimiters.join("") + "\t\r\n]+)" + delimiters[1], "g");
		var tokens = pattern.match(token_regex);

		var global_pattern_regex = new RegExp(pattern.replace(special_chars_regex, "\\$&").replace(token_regex, "(\.+)"), "g");
		var pattern_regex = new RegExp(pattern.replace(special_chars_regex, "\\$&").replace(token_regex, "(\.+)"));

		if (lowercase) {
			str = str.toLowerCase();
		}

		if (whitespace) {
			str = str.replace(/\s+/g, function(match) {
				var whitespace_str = "";
				for (var i = 0; i < whitespace; i++) {
					whitespace_str = whitespace_str + match.charAt(0);
				};
				return whitespace_str;
			});
		};

		var all_pattern_matches = str.match(global_pattern_regex);

		if (!all_pattern_matches) {
			return null;
		}

		var matched = [];
		for (var x = 0; x < all_pattern_matches.length; x++) {
			matched.push(all_pattern_matches[x].match(pattern_regex));
		};
		
    // Allow exact string matches to return an empty object instead of null
    if (!tokens) {
      return (str == pattern) ? {} : null
    }

    var output = [];

    for(var x = 0; x < matched.length; x++) {

    	output[x] = {};
    	var single_match = matched[x].splice(1);

    	for(var y = 0; y < tokens.length; y++) {
    		output[x][tokens[y].replace( new RegExp( delimiters[0] + "|" + delimiters[1], "g"), "")] = single_match[y];
    	}
    }

	return output;
	

	}

	if(typeof(window) != 'undefined') {
		window.extractValues = extractValues;
	} else {
		module.exports = extractValues;
	}
	
})();
