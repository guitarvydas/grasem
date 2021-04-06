function escapeEscapes (s) {
    // grammar needs to have all backslashes doubled before inclusion in a backtick string constant, to be compatible with Ohm-JS
    return s.replace (/\\/g,'\\\\');
}

