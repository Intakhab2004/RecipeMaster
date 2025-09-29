

function getFormattedItems(str) {
    if(!str)return "";

    // Inserting a comma before every "item" except the first
    str = str.replace(/(item\d+)/g, ",$1");

    // Replacing all spaces/commas (multiple) with a single comma
    str = str.replace(/[\s,]+/g, ",");

    // Trim spaces around commas if any remain
    str = str.replace(/\s*,\s*/g, ",");

    // Remove leading/trailing commas
    str = str.replace(/^,|,$/g, "");

    return str;
}

module.exports = getFormattedItems;
