(() => {
  const replacements = [
    [/\bRaven AI\b/g, "FlowConnect AI"],
    [/\bRaven Cloud\b/g, "Managed Push Service"],
    [/\bRaven mobile\b/g, "FlowConnect mobile"],
    [/\bRaven admins\b/g, "FlowConnect admins"],
    [/\bRaven Admin\b/g, "FlowConnect Admin"],
    [/\bRaven Settings\b/g, "FlowConnect Settings"],
    [/\bRaven\b/g, "FlowConnect"],
    [/\bERPNext\b/g, "FlowERP"],
    [/\bFrappe HR\b/g, "FlowHR"],
  ]

  const excluded = "script,style,code,pre,input,textarea,[contenteditable='true'],.flow-no-brand"

  const replaceText = (root) => {
    if (!root || root.nodeType !== Node.ELEMENT_NODE || root.matches?.(excluded)) return
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.parentElement?.closest(excluded)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT
      },
    })
    const nodes = []
    while (walker.nextNode()) nodes.push(walker.currentNode)
    for (const node of nodes) {
      let value = node.nodeValue
      for (const [pattern, replacement] of replacements) value = value.replace(pattern, replacement)
      node.nodeValue = value
    }
  }

  const apply = () => {
    document.title = document.title.replace(/Raven/g, "FlowConnect")
    replaceText(document.body)
    document.querySelectorAll("img").forEach((image) => {
      if (/raven-logo/i.test(`${image.src} ${image.alt}`)) {
        image.src = "/assets/raven/flow-logo.png"
        image.alt = "FlowConnect"
      }
    })
  }

  const start = () => {
    apply()
    new MutationObserver(apply).observe(document.body, { childList: true, subtree: true })
  }
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", start, { once: true })
    : start()
})()
