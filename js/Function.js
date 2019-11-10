function getPossibleX(value, length) {
    let arr = [];
    for (let i = 0; i < length; i++) {
        arr.push(value * i);
    }
    return arr;
}
  
function filterNull(arr) {
    return arr.filter(function(item){
        return !!item;
    });
}

function checkParentNode(parentNode, childNode) {
	if('contains' in parentNode) {
		return parentNode.contains(childNode);
	}
	else {
		return parentNode.compareDocumentPosition(childNode) % 16;
	}
}