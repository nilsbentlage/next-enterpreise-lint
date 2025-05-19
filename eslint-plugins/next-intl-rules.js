/**
 * Custom ESLint rules for next-intl
 */
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Ensure user-facing strings use next-intl for internationalization",
      category: "i18n",
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      missingString: "User-facing string should use next-intl for internationalization",
    },
  },
  create(context) {
    return {
      // This is a simplified version that checks for hardcoded strings in JSX text content
      JSXText(node) {
        const text = node.value.trim()
        const nonTranslatableContent = /^[\s\d!@#$%^&*()_\-+=[\]{}|\\;:'",.<>/?]+$/
        // Skip empty text, very short strings, or strings that are just whitespace/punctuation
        if (!text || text.length <= 1 || nonTranslatableContent.test(text)) {
          return
        }

        // Check if this might be a user-facing string
        context.report({
          node,
          messageId: "missingString",
        })
      },
    }
  },
}
