let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
let MutationObserverConfig = {
  childList: true,
  subtree: true,
  attributeFilter: ["data-label"],
  characterData: true,
};
let unTranslatedSet = new Set();

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

  function isUnTranslated(text) {
    return !RegExp(/[\u4e00-\u9fa5]|CDATA|\n/).test(text);
  }

  let currentNode = treeWalker.currentNode;
  while (currentNode) {
    if (currentNode.nodeType === 3) {
      let text1 = currentNode.textContent;
      if (isUnTranslated(text1)) {
        unTranslatedSet.add(text1);
      }
    } else {
      let text2 = currentNode.getAttribute("data-label");
      if (isUnTranslated(text2)) {
        unTranslatedSet.add(text2);
      }

      let text3 = currentNode.getAttribute("placeholder") || "";
      if ((text3 = text3.trim())) {
        if (isUnTranslated(text3)) {
          unTranslatedSet.add(text3);
        }
      }
    }

    currentNode = treeWalker.nextNode();

    console.log(unTranslatedSet);
  }
});

observer.observe(document.body, MutationObserverConfig);
