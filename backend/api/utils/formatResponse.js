function format(json, spacing = 0) {
    let formatted = "";
    if (typeof json==='boolean' && json!=null) 
        return `${json}`;
    for (idx in json) {
        item = json[idx];
        formatted+=" ".repeat(spacing);
        if (typeof item==='object' && item!==null)
            formatted+=`${idx}: \n${format(item, spacing+2)}`
        else
            formatted+=`${idx}: ${item}\n`
    };
    return formatted;
}

module.exports = format;