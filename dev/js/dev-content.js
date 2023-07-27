let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
let MutationObserverConfig = {
  childList: true,
  subtree: true,
  attributeFilter: ["data-label"],
  characterData: true,
};

let observer = new MutationObserver(function (mutations) {
  let treeWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_ALL,
    {
      acceptNode: function (node) {
        if (
          node.nodeType === 3 ||
          (node.hasAttribute &&
            (node.hasAttribute("data-label") ||
              node.hasAttribute("placeholder")))
        ) {
          return NodeFilter.FILTER_ACCEPT;
        } else {
          return NodeFilter.FILTER_SKIP;
        }
      },
    },
    false
  );
  let unTranslatedSet = new Set();

  let currentNode = treeWalker.currentNode;
  while (currentNode) {
    if (currentNode.nodeType === 3) {
      let text = currentNode.textContent;
      if (!RegExp(/[\u4e00-\u9fa5]|CDATA/).test(text)) {
        unTranslatedSet.add(text);
      }
    } else {
      // let key2 = currentNode.getAttribute("data-label");
      // if (key2 && dataMap.has(key2))
      //   currentNode.setAttribute("data-label", dataMap.get(key2));
      // let key3 = currentNode.getAttribute("placeholder") || "";
      // if ((key3 = key3.trim())) {
      //   if (dataMap.has(key3))
      //     currentNode.setAttribute("placeholder", dataMap.get(key3));
      // }
    }

    currentNode = treeWalker.nextNode();

    console.log(unTranslatedSet);
  }
});

observer.observe(document.body, MutationObserverConfig);
